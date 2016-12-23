var express = require('express');
var bodyparser = require('body-parser');
var mysql = require('mysql');
Promise = require('es6-promise').Promise;
var webapi = require('webapi-active-query-builder');

var guid = "0079c7e1-1264-4ffc-9666-4ce111d29281";
var sql = "Select customer_id, first_name, last_name, create_date from customer";

var app = express();

app.use(bodyparser.json());

app.use(function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
 	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

 	next();
});

app.use('/*', function(req, res, next) {
	if(req.method === 'OPTIONS')
		res.sendStatus(200);
	else
		next();
});

app.use('/GetQueryColumns', function(req, res) {
	var api = _getApiInstance();
	
	var query = new webapi.SqlQuery();
    query.guid = guid
    query.text = sql

    api.getQueryColumnsPost(query)
	    .then(function(fields) {
	    	res.json(fields);
	    })
	    .catch(function(error) {
	        res.status(500).send(error);
	    });   
});

app.use('/TransformSql', function(req, res) {
	var transform = req.body;
	transform.guid = guid;
	transform.sql = sql;

	var api = _getApiInstance();
	
	var result = api.transformSQLPost(transform)
		.then(function (result) {
			var serverResult = {};//todo to method getDataFromServer

			var connection = mysql.createConnection({
				host: '127.0.0.1',
				user: 'admin',
				password: 'admin',
				database: 'sakila'
			});

			connection.connect();

			connection.query(result.sql, function(err, rows) {
				serverResult.Data = rows;

				if(result.totals)
					connection.query(result.totals, function(err, rows, fields) {
						serverResult.Totals = rows[0];
						connection.end();
						res.json(serverResult);				
					});
				else {
					connection.end();
					res.json(serverResult);
				}
			});
		});							
});

app.use(function(req, res) {
	console.log(req.url);
	res.status(404).send('Not Found');
});

function _getApiInstance() {
	var client = new webapi.ApiClient();
	client.basePath = "http://webapiactivequerybuilder-test.cloudapp.net/";

	var api = new webapi.ActiveQueryBuilderApi(client);
	
	return api;	
}

function startServer() {
	app.listen(3000, function() {
		console.log('Server started');
	});
}

startServer();

