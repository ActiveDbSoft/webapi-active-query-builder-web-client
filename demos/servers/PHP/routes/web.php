<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

require_once __DIR__.'/../vendor/activedbsoft/webapi-active-query-builder/autoload.php';

use \WebApiActiveQueryBuilder\ApiClient;
use \WebApiActiveQueryBuilder\ActiveQueryBuilderApi;
use \WebApiActiveQueryBuilder\Transform;
use \WebApiActiveQueryBuilder\Totals;
use \WebApiActiveQueryBuilder\Sorting;
use \WebApiActiveQueryBuilder\Condition;
use \WebApiActiveQueryBuilder\ConditionGroup;
use \WebApiActiveQueryBuilder\HiddenColumn;
use \WebApiActiveQueryBuilder\Pagination;
use \WebApiActiveQueryBuilder\SqlQuery;

use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    var_dump(phpinfo());
    return '';
});

Route::options('/GetQueryColumns', ['middleware' => 'cors', function () {
    return "OK";
}]);

Route::options('/TransformSql', ['middleware' => 'cors', function () {
    return "OK";
}]);

Route::post('/GetQueryColumns', ['middleware' => 'cors', function () {
	$api = getApiInstance();

	$query = new SqlQuery();
	$query->setGuid( getGuid() );
	$query->setText( getSql() );

	$fields = $api->getQueryColumnsPost($query);		

	return array_map(function($column) {
		return array( "name" => $column->getName(), 'dataType' => $column->getDataType() );
	}, $fields);
}]);

Route::post('/TransformSql', ['middleware' => 'cors', function () {
	$api = getApiInstance();

	$postData = Input::all();

	$postData['Guid'] = getGuid();
	$postData['Sql'] = getSql();

	$result = $api->transformSqlPost($postData);

    return getDataFromSqlServer($result['sql'], $result['totals']);
}]);

function getApiInstance() {
	$apiClient = new WebApiActiveQueryBuilder\ApiClient();
    $apiClient->getConfig()->setHost("http://webapiactivequerybuilder-test.cloudapp.net/");

	return new ActiveQueryBuilderApi($apiClient);
}

function getGuid() {
	return "0079c7e1-1264-4ffc-9666-4ce111d29281";
}

function getSql() {
	return "Select customer_id, first_name, last_name, create_date from customer";
}

function getDataFromSqlServer($sql, $totals) {
	$dataResult = array( "Data" => [], "Totals" => [] );

	$dataResult["Data"] = DB::select($sql);

	if(!empty($totals))
		$dataResult["Totals"] = DB::select($totals)[0];

	return $dataResult;
}