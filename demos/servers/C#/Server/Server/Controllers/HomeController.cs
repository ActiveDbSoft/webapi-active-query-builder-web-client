using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using WebApi.ActiveQueryBuilder.Api;
using WebApi.ActiveQueryBuilder.Model;

namespace Server.Controllers
{
    [Cors]
    public class GetQueryColumnsController : Controller
    {
        private string _guid = "0079c7e1-1264-4ffc-9666-4ce111d29281";
        private string _sql = "Select customer_id, first_name, last_name, create_date from customer";

        public ActionResult Index()
        {
            ActiveQueryBuilderApi api = CreateApiInstance();

            SqlQuery query = new SqlQuery(_guid, _sql);
            List<QueryColumn> fields = api.GetQueryColumnsPost(query);

            return Json(fields);
        }
        
        private ActiveQueryBuilderApi CreateApiInstance()
        {
            return new ActiveQueryBuilderApi("http://webapiactivequerybuilder-test.cloudapp.net/");
        }
    }

    [Cors]
    public class TransformSqlController : Controller
    {
        private string _guid = "0079c7e1-1264-4ffc-9666-4ce111d29281";
        private string _sql = "Select customer_id, first_name, last_name, create_date from customer";

        public ActionResult Index(Transform transform)
        {
            transform.Guid = _guid;
            transform.Sql = _sql;

            ActiveQueryBuilderApi api = CreateApiInstance();
            TransformResult result = api.TransformSQLPost(transform);

            return GetDataMysql(result.Sql, result.Totals);
        }

        private ActiveQueryBuilderApi CreateApiInstance()
        {
            return new ActiveQueryBuilderApi("http://webapiactivequerybuilder-test.cloudapp.net/");
        }

        private ActionResult GetDataMysql(string sql, string totalsSql)
        {
            if (string.IsNullOrEmpty(sql))
                sql = _sql;

            MySqlConnectionStringBuilder builder = new MySqlConnectionStringBuilder
            {
                Server = "192.168.160.148",
                Database = "sakila",
                UserID = "admin",
                Password = "admin"
            };

            MySqlConnection connection = new MySqlConnection(builder.ToString());

            var result = new DataFromDataBase { Data = GetData(connection, sql) };

            if (!string.IsNullOrEmpty(totalsSql))
                result.Totals = GetData(connection, totalsSql).FirstOrDefault();

            return new JsonNetResult(result);
        }

        private List<dynamic> GetData(IDbConnection connection, string sql)
        {
            var cmd = connection.CreateCommand();
            cmd.CommandText = sql;
            DataTable data = new DataTable();

            cmd.Connection.Open();

            IDataReader reader = cmd.ExecuteReader();
            data.Load(reader);

            cmd.Connection.Close();

            return GetTableData(data);
        }

        private List<dynamic> GetTableData(DataTable dataTable)
        {
            var tableColumns = dataTable.Columns.Cast<DataColumn>().ToList();
            var data = dataTable.Rows.Cast<DataRow>()
                .Select<DataRow, dynamic>(dataRow =>
                {
                    IDictionary<string, object> dataRowObject = new ExpandoObject();
                    tableColumns.ForEach(column =>
                    {
                        dataRowObject[column.ColumnName] = dataRow[column.ColumnName];
                    });
                    return dataRowObject;
                }).ToList();

            return data;
        }
    }

    public class CorsAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            filterContext.HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            filterContext.HttpContext.Response.Headers.Add("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
            filterContext.HttpContext.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");

            if (HttpContext.Current.Request.HttpMethod == "OPTIONS")
                filterContext.Result = new HttpStatusCodeResult(200);
        }
    }

    public class DataFromDataBase
    {
        public object Data { get; set; }
        public object Totals { get; set; }
    }

    public class JsonNetResult : JsonResult
    {
        public JsonNetResult(object data)
        {
            Data = data;
        }
        public override void ExecuteResult(ControllerContext context)
        {
            var response = context.HttpContext.Response;

            response.ContentType = !string.IsNullOrEmpty(ContentType)
                ? ContentType
                : "application/json";

            var serializedObject = JsonConvert.SerializeObject(Data);

            response.Write(serializedObject);
        }
    }
}