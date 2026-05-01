# Syncfusion Angular Diagram — MySQL Example

This project demonstrates how to load **Syncfusion Angular Diagram** layout data from a **MySQL database** via an ASP.NET Core backend.

## Contents
- Diagram_MySQL.Server/  — ASP.NET Core Web API (LINQ2DB)
- diagram_mysql.client/  — Angular client using @syncfusion/ej2-angular-diagrams
- Diagram_MySQL.Server/setup-database.sql — DB schema & seed

## Prerequisites
- MySQL server
- .NET SDK 10
- Node.js 18/20+ and npm
- Angular CLI
- (Optional) Visual Studio / VS Code

## Database: create and seed
Run the provided SQL in Windows PowerShell / CMD:
```bash
mysql -u root -p < "d:\web-diagram-examples\Angular\connecting-to-database\syncfusion-angular-diagram-MySQL\Diagram_MySQL.Server\setup-database.sql"
```
or

You can copy paste the contents of `Diagram_MySQL.Server\setup-database.sql` into MySQL Command Line Client for quick data creation.

This creates `diagramdb` and the `employees` table (Id, Name, ParentId).

## Backend: configure & run
1. Open `Diagram_MySQL.Server/appsettings.json` and set the `MySqlConn` connection string.
2. Restore and run:
```bash
   cd Diagram_MySQL.Server
   dotnet restore
   dotnet run
```
Default API used in examples:
GET http://localhost:5283/api/diagram/items
(Port may differ — check the console output when running `dotnet run`.)

## Frontend: install & run
1. Open client folder:
```bash
   cd diagram_mysql.client
```

2. Install dependencies:
```bash
   npm install
```
3. Run the Application
```bash
   ng serve
```
3. The Angular app uses a DataManager pointing to the backend `/api/diagram/items` and binds via Diagram `dataSourceSettings` (id = Id, parentId = ParentId).

## Key files
- setup-database.sql — schema + seed
- Diagram_MySQL.Server/Controllers/DiagramController.cs — returns [{ Id, ParentId, Name }]
- Diagram_MySQL.Server/Data/AppDataConnection.cs — LINQ2DB connection
- diagram_mysql.client/src/app/ — DiagramComponent with dataSourceSettings using DataManager

## Notes / Troubleshooting
- CORS: enable backend CORS for the client origin.
- Ensure connection string credentials and MySQL port are correct.
- Inspect network tab; endpoint must return JSON array of items with Id and ParentId.

## References
- [Diagram hierarchical layout with datasource](https://ej2.syncfusion.com/angular/documentation/diagram/hierarchical-layout#hierarchical-layout-with-datasource)

---