# Angular_Diagram_MSSQL

Repository purpose
- Demo application showing an Angular UI using Syncfusion Diagram bound to layout node data stored in Microsoft SQL Server, served by an ASP.NET Core Web API.

Repository layout
- Angular_Diagram_MSSQL.client/ — Angular frontend (Syncfusion Diagram).
- Angular_Diagram_MSSQL.Server/ — ASP.NET Core 8 Web API, data access and DB setup script.

Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm
- SQL Server (2017+) reachable from the server app
- Recommended: Git, optional Syncfusion license if using paid features

Quick start (local)
1. Database
   - Create the database and table(s): run Angular_Diagram_MSSQL.Server/setup-database.sql on your SQL Server.
   - Confirm DB user and permissions.

2. Server configuration
   - Update the connection string in Angular_Diagram_MSSQL.Server/appsettings.json or use environment variables (recommended for production).
   - cd Angular_Diagram_MSSQL.Server
   - dotnet restore
   - dotnet run
   - Note: server port is shown in console (or defined in Properties/launchSettings.json).

3. Client configuration and run
   - cd Angular_Diagram_MSSQL.client
   - npm ci
   - npm run start
   - Open http://localhost:4200 (Angular dev server). Ensure the API and client origins align or use the client proxy.

Production build
- Client: cd Angular_Diagram_MSSQL.client && npm run build
- Serve the built assets from a static host or integrate with the ASP.NET Core app's static web assets.
- Server: deploy with dotnet publish and set connection strings via secure configuration (environment variables, secret store).

Notes & troubleshooting
- If API calls fail: verify server is running, review CORS settings, check client proxy (client/src/proxy.conf.js or spa.proxy.json in server output).
- Ensure SQL user has appropriate privileges and the connection string is correct.
- Check logs in server console and browser devtools network tab for errors.

Further reading
- See sub-folder READMEs for detailed server- and client-specific instructions and development notes.