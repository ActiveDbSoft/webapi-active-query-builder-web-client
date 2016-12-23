
package Perl;
use Dancer2;
use DBI;
use DBD::mysql;

set serializer => 'JSON';

our $VERSION = '0.1';
use SQL::QueryBuilder::WebApi;
use SQL::QueryBuilder::WebApi::Object::Transform;
 
my $guid = "0079c7e1-1264-4ffc-9666-4ce111d29281";
my $sql = "Select customer_id, first_name, last_name, create_date from customer";

options '/*' => sub {
	cors();
	return "OK";
};

post '/GetQueryColumns' => sub {
	cors();

	my $api = get_webapi_instance();

	my $query = create_sql_query();
	$query->guid( $guid );
	$query->text( $sql );

	my $columns = $api->get_query_columns_post(query => $query);

	my @fields = ();
	while(true) {
		my $test = pop $columns;

		if($test eq undef) {
			last;
		} else {
			unshift @fields, { name => $test->name, dataType => $test->data_type };
		}
	}

    return [ @fields ];
};

post '/TransformSql' => sub {
	cors();

	my $post_data = from_json request->body;

	my $api = get_webapi_instance();

	my $transform = SQL::QueryBuilder::WebApi::Object::Transform->new();
	$transform->guid( $guid );
	$transform->sql( $sql );
	$transform->pagination( $post_data->{'pagination'} );
	$transform->totals( $post_data->{'totals'} );
	$transform->sortings( $post_data->{'sortings'} );
	$transform->filter( $post_data->{'filter'} );

	my $result = $api->transform_sql_post(transform => $transform);
	
	get_data_from_sql_server($result->sql, $result->totals);
};

sub cors {
	response_headers 'Access-Control-Allow-Origin' => '*';
	response_headers 'Access-Control-Allow-Methods' => '*';
	response_headers 'Access-Control-Allow-Headers' => 'X-Requested-With, Content-type';
}

sub get_webapi_instance() {
	my $api = create_api();
	$api->{api_client}->{base_url} = 'http://webapiactivequerybuilder-test.cloudapp.net/';

	return $api;
}

sub get_data_from_sql_server {
	my $data_result = {
		Data => [],
		Totals => {}
	};

	my $sql = $_[0];
	my $totals = $_[1];

	my $dsn = "dbi:mysql:host=127.0.0.1;database=sakila";

	my $dbh = DBI->connect($dsn, 'admin', 'admin');
	
	my $cmd = $dbh->prepare($sql);

	$cmd->execute();

	while(my $ref = $cmd->fetchrow_hashref()) {
		push($data_result->{'Data'}, $ref);
	}

	if(length $totals)
	{	
		my $cmd = $dbh->prepare($totals);

		$cmd->execute();

		$data_result->{'Totals'} = $cmd->fetchrow_hashref();
	}

	$dbh->disconnect;

	return $data_result;
}

true;