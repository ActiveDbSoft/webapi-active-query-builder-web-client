import java.io.*;
import java.util.ArrayList;
import java.util.List;

import java.net.InetSocketAddress;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.Headers;

import java.sql.*;

import com.sun.rowset.internal.Row;
import webapi.activequerybuilder.ApiException;
import webapi.activequerybuilder.api.ActiveQueryBuilderApi;
import webapi.activequerybuilder.ApiClient;
import webapi.activequerybuilder.model.*;

import com.fasterxml.jackson.databind.ObjectMapper;

public class Main {
    private static String guid = "0079c7e1-1264-4ffc-9666-4ce111d29281";
    private static String sql = "Select customer_id, first_name, last_name, create_date from customer";

    public static void main(String[] args) throws Exception {
        test();
        HttpServer server = HttpServer.create(new InetSocketAddress("localhost", 3000), 0);
        server.createContext("/GetQueryColumns", new GetQueryColumnsHandler());
        server.createContext("/TransformSql", new TransformSqlHandler());
        server.setExecutor(null);
        server.start();
    }

    private static ActiveQueryBuilderApi createApiInstance() {
        ApiClient client = new ApiClient();
        client.setBasePath("http://webapiactivequerybuilder-test.cloudapp.net/");

        return new ActiveQueryBuilderApi(client);
    }

    private static void writeResponse(HttpExchange t, String res) throws IOException {
        t.sendResponseHeaders(200, res.length());
        t.getResponseHeaders().set("Content-Type", "application/json");
        OutputStream os = t.getResponseBody();
        os.write(res.getBytes());
        os.close();
    }

    private static void writeJson(HttpExchange t, String res) throws IOException {
        t.sendResponseHeaders(200, res.length());
        t.getResponseHeaders().set("Content-Type", "application/json");

        try {
            t.getResponseBody().write(res.getBytes());
        } catch(IOException ex) {
            System.out.println(ex.getMessage());
        }
        t.close();
    }

    private static void writeCorsToHeaders(HttpExchange t) {
        Headers headers = t.getResponseHeaders();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }

    private static class GetQueryColumnsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            if (t.getRequestMethod().equals("OPTIONS")) {
                writeCorsToHeaders(t);
                writeResponse(t, "OK");
            } else {
                ActiveQueryBuilderApi api = createApiInstance();

                SqlQuery query = new SqlQuery();
                query.setGuid(guid);
                query.setText(sql);

                List<QueryColumn> fields = null;

                try {
                    fields = api.getQueryColumnsPost(query);
                } catch (ApiException ex) {

                }

                ObjectMapper mapper = new ObjectMapper();

                writeCorsToHeaders(t);
                writeJson(t, mapper.writeValueAsString(fields));
            }
        }
    }

    private static class TransformSqlHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            if (t.getRequestMethod().equals("OPTIONS")) {
                writeCorsToHeaders(t);
                writeResponse(t, "OK");
            } else {
                ActiveQueryBuilderApi api = createApiInstance();

                InputStreamReader inputReader = new InputStreamReader(t.getRequestBody());
                BufferedReader reader = new BufferedReader(inputReader);

                String postData = reader.readLine();

                Transform transform = mapTransformFromString(postData);
                transform.setGuid(guid);
                transform.setSql(sql);

                TransformResult result = null;
                try {
                    result = api.transformSQLPost(transform);
                } catch (ApiException ex) {

                }

                String data = null;
                try {
                    data = getDataGromSqlServer(result.getSql(), result.getTotals());
                } catch (SQLException ex) {
                    System.out.println(ex.getMessage());
                } catch (ClassNotFoundException ex) {
                    System.out.println(ex.getMessage());
                }

                writeCorsToHeaders(t);
                writeJson(t, data);
            }
        }

        private String getDataGromSqlServer(String sql, String totalsSql) throws SQLException, ClassNotFoundException, JsonProcessingException {
            Class.forName("com.mysql.jdbc.Driver");
            String url = "jdbc:mysql://localhost:3306/sakila";
            String user = "admin";
            String password = "admin";

            Connection con = DriverManager.getConnection(url, user, password);
            Statement statement = con.createStatement();

            ResultSet set = statement.executeQuery(sql);

            String result = "{ \"Data\": " + to_json(set, false);

            if(totalsSql != null && !totalsSql.isEmpty()) {
                set = statement.executeQuery(totalsSql);
                result = result.concat(", \"Totals\": " + to_json(set, true) );
            }

            return result + " }";
        }

        private String to_json(ResultSet set, Boolean singleRow) throws SQLException {
            ResultSetMetaData metaData = set.getMetaData();

            int colCount = metaData.getColumnCount();

            String json = singleRow ? "" : "[";
            while(set.next()) {
                json = json.concat("{");
                for(int i = 1; i <= colCount; i++) {
                    String key = metaData.getColumnName(i);
                    String value = set.getString(key);

                    json = json.concat("\"" + key + "\"" + ":" + "\"" + value + "\"");
                    if(i != colCount)
                        json = json.concat(",");
                }
                json = json.concat("},");
            }
            if(singleRow)
                json = json.substring(0, json.length()-1);
            else
                json = json.substring(0, json.length()-1).concat("]");

            return json;
        }

        private Transform mapTransformFromString(String postData) throws IOException {
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

            Transform transform = mapper.readValue(postData, Transform.class);//todo total func uppercase

            return transform;
        }
    }

    private static void test() throws IOException {
        /*ObjectMapper mapper = new ObjectMapper();
        mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

        String json = "{\"pagination\":{\"skip\":0,\"take\":5},\"totals\":[],\"sortings\":[],\"filter\":{\"junctionType\":\"All\",\"conditions\":[],\"conditionGroups\":[]},\"hiddenColumns\":[]}";
        Transform transform = mapper.readValue(json, Transform.class);

        System.out.println(transform);*/
    }
}
