using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.ComponentModel.DataAnnotations;
using System.Data;
using Syncfusion.EJ2.Base;

namespace MySQL_Diagram.Server.Controllers
{
    [ApiController]
    public class DiagramController : ControllerBase
    {
        string ConnectionString = @"Server=localhost;Port=3306;Database=diagramdb;Uid=root;Pwd=Chellausing@SQL;SslMode=none;";

        /// <summary>
        /// Retrieves the employee data from the database.
        /// </summary>
        /// <returns>Returns a list of employee fetched from the database.</returns>
        [HttpGet]
        [Route("api/[controller]")]
        public List<DiagramNode> GetDiagramData()
        {
            // Define the SQL query to retrieve all records from the employees table, ordered by Id.

            string queryStr = "SELECT Id, Name, ParentId FROM employees ORDER BY Id";

            // Create a MySqlConnection object using the connection string.
            MySqlConnection sqlConnection = new(ConnectionString);

            // Open the database connection to allow executing SQL commands.
            sqlConnection.Open();

            // Initialize the MySqlCommand object with the SQL query and the connection object.
            MySqlCommand SqlCommand = new(queryStr, sqlConnection);

            // Initialize the MySqlDataAdapter, which acts as a bridge between the database and DataTable.
            MySqlDataAdapter DataAdapter = new(SqlCommand);

            // Create an empty DataTable object to store the retrieved data.
            DataTable DataTable = new();

            // Using MySqlDataAdapter, process the query string and fill the data into the dataset.
            DataAdapter.Fill(DataTable);

            // Close the database connection after executing the query.
            sqlConnection.Close();

            //Cast the data fetched from MySqlDataAdapter to List.<T>
            List<DiagramNode> dataSource = (from DataRow Data in DataTable.Rows
                                        select new DiagramNode()
                                        {
                                            Id = Convert.ToInt32(Data["Id"]),
                                            Name = Data["Name"].ToString(),
                                            ParentId = Data["ParentId"] == DBNull.Value ? (int?)null : Convert.ToInt32(Data["ParentId"])
                                        }).ToList();

            return dataSource;
        }
    }
    public class DiagramNode
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public int? ParentId { get; set; }
    }
}