# Syncfusion React Diagram + Node.js + PostgreSQL - Organizational Layout

A full-stack application demonstrating organizational chart data visualization using Syncfusion EJ2 React Diagram component with a Node.js backend and PostgreSQL database.

## Overview

This project provides a complete solution for visualizing hierarchical organizational data as an interactive diagram. The application fetches data from a PostgreSQL database through a REST API built with Node.js and Express, then displays it using Syncfusion's React Diagram component with automatic organizational chart layout.

## Technology Stack

### Frontend
- **React 18+** with TypeScript
- **Vite** - Modern build tool
- **Syncfusion EJ2 React Diagrams** - Interactive diagram component
- **Material Theme** - Syncfusion Material design theme

### Backend
- **Node.js 18+** with TypeScript
- **Express** - Lightweight web framework for REST API
- **PostgreSQL** - Relational database for storing hierarchical data
- **pg** - PostgreSQL client for Node.js
- **CORS** - Middleware for cross-origin requests

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 12.x or higher ([Download](https://www.postgresql.org/download/))
- **npm** (comes with Node.js)

## Project Structure

```
project-root/
├── client/                           # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   └── DiagramOrgchartLayout.tsx
│   │   ├── services/
│   │   │   └── layoutService.ts
│   │   ├── types/
│   │   │   └── layout.types.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── tsconfig.json
│
├── server/                           # Node.js backend application
│   ├── src/
│   │   ├── db/
│   │   │   └── index.ts              # PostgreSQL connection pool
│   │   ├── routes/
│   │   │   └── layout.routes.ts
│   │   ├── controllers/
│   │   │   └── layout.controller.ts
│   │   ├── types/
│   │   │   └── layout.types.ts
│   │   ├── scripts/
│   │   │   └── seedLayout.ts
│   │   └── server.ts
│   ├── .env                          # Environment variables (not in version control)
│   ├── .env.example                  # Example environment variables
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## Setup Instructions

### Step 1: Create PostgreSQL Database

Before running the application, create the PostgreSQL database:

1. Open **pgAdmin 4** or **psql command line**
2. Execute the following SQL command:

```sql
CREATE DATABASE orgchart_db;
```

### Step 2: Install Backend Dependencies

Navigate to the server directory and install packages:

```powershell
cd server
npm install
```

This installs:
- **express** - Web framework
- **pg** - PostgreSQL client
- **cors** - Cross-origin middleware
- **dotenv** - Environment variable management
- **typescript** and **tsx** - TypeScript support

### Step 3: Configure Environment Variables

Create a `.env` file in the `server` directory with your PostgreSQL credentials:

```env
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=orgchart_db
PORT=5000
NODE_ENV=development
```

> **Important**: Replace `your_postgres_password` with your actual PostgreSQL password.

### Step 4: Seed the Database

From the `server` directory, run the seed script to create the table and insert sample data:

```powershell
npm run seed
```

Expected output:
```
Starting database seeding...
Table created successfully
Successfully seeded 12 nodes
Database seeding completed!
```

### Step 5: Install Frontend Dependencies

Open a new terminal, navigate to the client directory, and install packages:

```powershell
cd client
npm install
```

This installs:
- **@syncfusion/ej2-react-diagrams** - Diagram component
- **@syncfusion/ej2-data** - DataManager for data binding
- **@syncfusion/ej2-base** - Core utilities
- **react** and **react-dom** - React framework
- **vite** - Build tool

## Building and Running

### Start Backend Server

From the `server` directory:

```powershell
npm run dev
```

Expected output:
```
✓ Database connected successfully
✓ Server running on http://localhost:5000
✓ API endpoint: http://localhost:5000/api/layoutJS
```

The backend server is now running. Keep this terminal window open.

### Start Frontend Application

Open a **new terminal** and navigate to the `client` directory:

```powershell
npm run dev
```

Expected output:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Access the Application

Open your web browser and navigate to:

```
http://localhost:5173
```

You should see the organizational chart diagram rendered with data from PostgreSQL.

## Available npm Scripts

### Backend (server/)

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run seed` - Initialize database with sample data

### Frontend (client/)

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Common Troubleshooting

### Database Connection Error

**Symptom**: `Error: database "orgchart_db" does not exist`

**Solution**:
1. Verify PostgreSQL is running
2. Create the database using pgAdmin or psql:
   ```sql
   CREATE DATABASE orgchart_db;
   ```
3. Restart the backend server

### PostgreSQL Password Authentication Failed

**Symptom**: `Error: password authentication failed for user "postgres"`

**Solution**:
1. Verify the password in `server/.env` matches your PostgreSQL password
2. Update the password if needed:
   ```env
   DB_PASSWORD=correct_password
   ```
3. Restart the backend server

### CORS Blocking API Requests

**Symptom**: Browser console error: `Access to fetch has been blocked by CORS policy`

**Solution**:
1. Verify backend CORS configuration in `server/src/server.ts` includes your frontend port
2. Ensure both servers are running
3. Check that the API URL in `client/src/services/layoutService.ts` is correct: `http://localhost:5000/api/layoutJS`

### Empty Diagram Display

**Symptom**: Page loads but diagram shows no nodes

**Solution**:
1. Check if the seed script ran successfully
2. Verify API returns data:
   ```powershell
   Invoke-WebRequest -Uri http://localhost:5000/api/layoutJS
   ```
3. Open browser developer tools (F12) → Console tab and check for errors
4. Verify both backend and frontend servers are running

### Port Already in Use

**Symptom**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
1. Find and terminate the process using the port:
   ```powershell
   Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
   Stop-Process -Id <process_id> -Force
   ```
2. Or change the port in `server/.env`:
   ```env
   PORT=5001
   ```
   And update the API URL in `client/src/services/layoutService.ts`

---

**For detailed setup and implementation guide, refer to `NewUserGuide.md`**
