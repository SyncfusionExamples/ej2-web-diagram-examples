using LinqToDB;
using LinqToDB.Data;
using LinqToDB.DataProvider.MySql;
using Microsoft.Extensions.Configuration;
using Diagram_MySQL.Server.Models;

namespace Diagram_MySQL.Server.Data
{
    public sealed class AppDataConnection : DataConnection
    {
        public AppDataConnection(IConfiguration config)
            : base(new DataOptions().UseMySql(
                config.GetConnectionString("MySqlConn"),
                MySqlVersion.MySql80,
                MySqlProvider.MySqlConnector))
        {
            InlineParameters = true;
        }

        public ITable<Employee> Employees => this.GetTable<Employee>();
    }
}