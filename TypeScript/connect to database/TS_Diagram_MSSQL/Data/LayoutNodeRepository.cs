using Microsoft.Data.SqlClient;

namespace TS_Diagram_MSSQL.Data
{
    public class LayoutNodeRepository
    {
        private readonly string _connectionString;

        /// <summary>
        /// Initializes the repository with a connection string from configuration.
        /// </summary>
        public LayoutNodeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DiagramDb")!;
        }

        /// <summary>
        /// Creates a new SQL connection using the configured connection string.
        /// </summary>
        private SqlConnection GetConnection() => new SqlConnection(_connectionString);

        /// <summary>
        /// Returns all layout nodes ordered by Id.
        /// </summary>
        public async Task<List<LayoutNode>> GetLayoutNodesAsync()
        {
            var list = new List<LayoutNode>();
            const string sql =
                @"SELECT Id, ParentId, Role FROM dbo.LayoutNodes";

            await using var conn = GetConnection();
            await conn.OpenAsync();
            await using var cmd = new SqlCommand(sql, conn);
            await using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(
                    new LayoutNode
                    {
                        Id = reader["Id"] as string ?? string.Empty,
                        ParentId = reader["ParentId"] as string,
                        Role = reader["Role"] as string ?? string.Empty
                    }
                );
            }
            return list;
        }
    }
}
