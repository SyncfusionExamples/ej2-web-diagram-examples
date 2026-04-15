# Client — Angular_Diagram_MSSQL.client

Overview
- Angular app demonstrating Syncfusion Diagram bound to server data via DataManager.
- Main component: [`AppComponent`](Angular_Diagram_MSSQL.client/src/app/app.component.ts).
- Template: [app.component.html](Angular_Diagram_MSSQL.client/src/app/app.component.html).

Key files
- Component: [`AppComponent`](Angular_Diagram_MSSQL.client/src/app/app.component.ts)
- Template: [Angular_Diagram_MSSQL.client/src/app/app.component.html](Angular_Diagram_MSSQL.client/src/app/app.component.html)
- Config: [package.json](Angular_Diagram_MSSQL.client/package.json), [angular.json](Angular_Diagram_MSSQL.client/angular.json)
- Proxy (if used): [proxy.conf.js](Angular_Diagram_MSSQL.client/src/proxy.conf.js)

How it fetches data
- The client uses the constant [`BASE_URL`](Angular_Diagram_MSSQL.client/src/app/app.component.ts) set to "/api/layoutnodes" and fetches nodes on init. Data flows into a Syncfusion DataManager and is bound via [dataSourceSettings] in the component.

Run locally
1. Install deps:
   - cd Angular_Diagram_MSSQL.client
   - npm install
2. Start dev server:
   - npm run start
   - Navigate to http://localhost:4200
3. Build:
   - npm run build

Testing
- Unit tests via Karma/Jasmine: npm run test

Notes
- Ensure server is running and accessible at the API path used by [`AppComponent`](Angular_Diagram_MSSQL.client/src/app/app.component.ts).