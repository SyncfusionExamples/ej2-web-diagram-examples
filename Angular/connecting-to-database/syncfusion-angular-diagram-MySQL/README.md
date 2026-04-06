# Syncfusion Angular Diagram – MySQL DataSource Demo

This project demonstrates how to load **Syncfusion Angular Diagram** layout data from a **MySQL database** using a backend API.

> ✅ Diagram data is loaded via `dataSourceSettings`  
> ✅ MySQL → API → Angular flow

***

## Prerequisites

Make sure the following are installed:

*   **Node.js**
*   **Angular CLI**
*   **MySQL Server**
*   **.NET 10**

***


## Database Setup

1.  Create a MySQL database:

```sql
CREATE DATABASE diagramdb;
```

2.  Create a table for diagram layout data:

```sql
CREATE TABLE diagram_data (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  parentId INT
);
```

3.  Insert sample data:

```sql
INSERT INTO diagram_data (id, name, parentId) VALUES
(1, 'CEO', NULL),
(2, 'Manager', 1),
(3, 'Developer', 2);
```
> You can simply copy paste the contents of `Diagram_MySQL.Server\setup-database.sql` into MySQL Command Line Client for quick data creation.

***

## Frontend Setup (Angular)

1.  Navigate to frontend folder, Install Syncfusion Diagram and necessary angular packages:

```bash
cd diagram_mysql.client
npm install
```

***

## Backend Setup (ASP.NET Core)

1.  Navigate to backend folder:

```bash
cd Diagram_MySQL.Server
```

2.  Update MySQL credentials in `appsettings.json`:

```json
  "ConnectionStrings": {
  "MySqlConn": "Server=localhost;Port=3306;Database=diagramdb;User Id=root;Password=12345678;"
},
```

3.  Start the backend server:

```bash
dotnet build
dotnet run
```

✅ Client App will get automatically hosted.

***

## How Data Is Loaded into the Diagram

*   Angular service calls the backend API
*   API fetches records from MySQL
*   Diagram uses `dataSourceSettings` to automatically load the layout diagram from data:

```ts
dataSourceSettings = {
  id: 'id',
  parentId: 'parentId',
  dataSource: diagramData
};
```

***

## Reference

🔗 Syncfusion Angular Diagram Documentations:-
- [Hierarchical layout with datasource](https://ej2.syncfusion.com/angular/documentation/diagram/automatic-layout/hierarchical-layout#hierarchical-layout-with-datasource)

***