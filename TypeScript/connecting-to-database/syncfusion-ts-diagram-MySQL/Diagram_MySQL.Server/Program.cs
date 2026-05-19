using Diagram_MySQL.Server.Data;
using LinqToDB;
using LinqToDB.AspNet;
using LinqToDB.DataProvider.MySql;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddNewtonsoftJson();

// Configure CORS (Cross-Origin Resource Sharing) for development
// IMPORTANT: This allows the TypeScript frontend (http://localhost:5173) to make requests to this backend (http://localhost:5296)
// Without CORS, browsers block requests between different ports for security reasons
builder.Services.AddCors(options =>
{
    options.AddPolicy("cors", p => p
        .AllowAnyOrigin()      // Allow requests from any domain
        .AllowAnyHeader()      // Allow any HTTP headers
        .AllowAnyMethod()      // Allow GET, POST, PUT, DELETE, etc.
    );
});
// Register LINQ2DB with MySQL provider
builder.Services.AddLinqToDB(
    (sp, options) =>
        options.UseMySql(
            builder.Configuration.GetConnectionString("MySqlConn"),
            MySqlVersion.MySql80,
            MySqlProvider.MySqlConnector
        )
);
// Register AppDataConnection for dependency injection
builder.Services.AddScoped<AppDataConnection>();
var app = builder.Build();

// Apply CORS policy
app.UseCors("cors");

app.UseAuthorization();

app.MapControllers();

app.Run();