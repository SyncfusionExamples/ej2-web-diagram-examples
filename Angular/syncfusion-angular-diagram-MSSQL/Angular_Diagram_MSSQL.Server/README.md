# Server — Angular_Diagram_MSSQL.Server

Overview
- ASP.NET Core API exposing layout nodes to the Angular client.
- Endpoint used by client: GET /api/layoutnodes (see [`AppComponent` client usage](Angular_Diagram_MSSQL.client/src/app/app.component.ts)).

Important files
- Entry/host: [Program.cs](Angular_Diagram_MSSQL.Server/Program.cs)
- Controller: [`LayoutNodesController`](Angular_Diagram_MSSQL.Server/Controllers/LayoutNodesController.cs)
- Data model: [`LayoutNode`](Angular_Diagram_MSSQL.Server/Data/LayoutNode.cs)
- Repository: [`LayoutNodeRepository`](Angular_Diagram_MSSQL.Server/Data/LayoutNodeRepository.cs)
- DB script: [setup-database.sql](Angular_Diagram_MSSQL.Server/setup-database.sql)
- Configuration: [appsettings.json](Angular_Diagram_MSSQL.Server/appsettings.json)

Prerequisites
- .NET 8 SDK
- SQL Server instance accessible from the server

Setup & run
1. Create DB/tables: run [setup-database.sql](Angular_Diagram_MSSQL.Server/setup-database.sql).
2. Update connection string in [appsettings.json](Angular_Diagram_MSSQL.Server/appsettings.json).
3. Start server:
   - cd Angular_Diagram_MSSQL.Server
   - dotnet run
4. Verify API: GET http://localhost:<port>/api/layoutnodes (controller: [`LayoutNodesController`](Angular_Diagram_MSSQL.Server/Controllers/LayoutNodesController.cs)).

Notes
- Repository pattern is in [`LayoutNodeRepository`](Angular_Diagram_MSSQL.Server/Data/LayoutNodeRepository.cs).
- Inspect models in [`LayoutNode`](Angular_Diagram_MSSQL.Server/Data/LayoutNode.cs).