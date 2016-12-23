require 'webrick'
require 'json'
require 'mysql'
require 'webapi-active-query-builder'

include WebApiActivequerybuilder

$guid = "0079c7e1-1264-4ffc-9666-4ce111d29281";
$sql = "Select customer_id, first_name, last_name, create_date from customer";

def create_api_instance
	config = Configuration.default
    config.scheme = "http"
    config.host = "webapiactivequerybuilder-test.cloudapp.net"

    client = ApiClient.new(config)

    return ActiveQueryBuilderApi.new(client)
end

def setup_header res
	res.header["Access-Control-Allow-Credentials"] = 'true'
	res.header["Access-Control-Allow-Origin"] = '*'
	res.header["Access-Control-Allow-Methods"] = 'GET, POST, OPTIONS'
	res.header["Access-Control-Allow-Headers"] = 'X-Requested-With, Content-type'
end

class GetQueryColumnsServlet < WEBrick::HTTPServlet::AbstractServlet
	def do_OPTIONS req, res
		setup_header(res)
		res.status = 200
	end		

	def do_POST req, res
		api = create_api_instance() 

		query = SqlQuery.new
    	query.guid = $guid
    	query.text = $sql

    	fields = api.get_query_columns_post(query) 

		setup_header(res)
		res.status = 200
		res.body = JSON.generate( fields.map { |f| {:name => f.name, :dataType => f.data_type} })
	end
end

class TransformSqlServlet < WEBrick::HTTPServlet::AbstractServlet
	def do_OPTIONS req, res
		setup_header(res)
		res.status = 200
	end	

	def do_POST req, res
		transform = JSON.parse(req.body)
		transform["guid"] = $guid
		transform["sql"] = $sql

		api = create_api_instance() 
		result = api.transform_sql_post(transform)

		data = get_data_from_sql_server result.sql, result.totals

		setup_header(res)
		res.status = 200
		res.body = JSON.generate( data )
	end

	def get_data_from_sql_server sql, totalsSql
		result = { :Data => [], :Totals => {} }

		con = Mysql.new('127.0.01', 'admin', 'admin', 'sakila')

		con.query(sql).each_hash do |row|
			result[:Data] << row
		end

		if totalsSql.to_s != ''
			con.query(totalsSql).each_hash do |row|
				result[:Totals] = row
			end
		end

		return result			
	end
end

server = WEBrick::HTTPServer.new :Port => 3000

trap 'INT' do server.shutdown end

server.mount '/GetQueryColumns', GetQueryColumnsServlet
server.mount '/TransformSql', TransformSqlServlet

server.start