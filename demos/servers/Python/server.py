from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import json
import pymysql.cursors
from webapi_active_query_builder import *

guid = "0079c7e1-1264-4ffc-9666-4ce111d29281";
sql = "Select customer_id, first_name, last_name, create_date from customer";

class Server(BaseHTTPRequestHandler):

	def set_headers(self):
		self.send_header('Access-Control-Allow-Credentials', 'true')
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
		self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")
		self.end_headers()

	def do_OPTIONS(self):
		self.send_response(200, "ok")
		self.set_headers()

	def do_POST(self):
		if self.path == '/GetQueryColumns':
			self.get_query_columns()
		elif self.path == '/TransformSql':
			self.transform_sql()
		else:
			self.wfile.write("404")

	def get_query_columns(self):
		api = self.create_api_instance()
		
		query = SqlQuery()
		query.guid = guid
		query.text = sql

		fields = api.get_query_columns_post(query)
		fields = map(lambda f: f.to_dict(), fields)

		self.send_response(200, "OK")
		self.set_headers()
		self.wfile.write( json.dumps( fields ) )#todo

	def transform_sql(self):
		content_len = int(self.headers.getheader('content-length', 0))
		req_body = self.rfile.read(content_len)

		transform = json.loads(req_body)
		transform["guid"] = guid
		transform["sql"] = sql

		api = self.create_api_instance()
		result = api.transform_sql_post(transform)

		data = self.get_data_from_sql_server(result.sql, result.totals)

		self.send_response(200, "OK")
		self.set_headers()
		self.wfile.write( json.dumps( data ) )

	def create_api_instance(self):
		client = ApiClient('http://webapiactivequerybuilder-test.cloudapp.net/')
		return ActiveQueryBuilderApi(client)

	def get_data_from_sql_server(self, sql, totals_sql):
		result = {'Data': [], 'Totals': []}

		connection = pymysql.connect(
			host='127.0.0.1',
			user='admin', 
			password='admin', 
			db='sakila',
			cursorclass=pymysql.cursors.DictCursor)

		cursor = connection.cursor()	
		cursor.execute(sql)

		col_names = [desc[0] for desc in cursor.description]

		result['Data'] = cursor.fetchall()

		for r in result['Data']:
			r['create_date'] = str( r['create_date'] )
		
		if totals_sql:
			totals_cursor = connection.cursor()	
			totals_cursor.execute(totals_sql)
			
			result['Totals'] = { k: str(v) for k, v in totals_cursor.fetchone().iteritems() }

		connection.close()

		return result


def run():
	server_class = HTTPServer
	handler_class = Server
	server_address = ('localhost', 3000)

	httpd = server_class(server_address, handler_class)
	httpd.serve_forever()

if __name__ == "__main__":
	run()
