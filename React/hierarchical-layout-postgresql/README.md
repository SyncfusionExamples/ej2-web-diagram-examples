# Organizational Chart Application

A full-stack application that displays an organizational chart using Syncfusion React Diagrams with data stored in a PostgreSQL database.

## Project Overview

This sample demonstrates how to build an organizational chart visualization using:
- **Frontend**: React + TypeScript + Vite + Syncfusion Diagrams
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL

The application fetches organizational hierarchy data from a PostgreSQL database and renders it as an interactive diagram using Syncfusion's React Diagram component.

## Project Structure

```
.
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/    # DiagramOrgchartLayout component
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript type definitions
│   └── package.json
└── server/          # Express backend API
    ├── src/
    │   ├── controllers/   # API controllers
    │   ├── routes/        # API routes
    │   ├── db/            # Database connection
    │   ├── data/          # Seed data
    │   ├── script/        # Database seeding script
    │   └── types/         # TypeScript type definitions
    └── package.json
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=org_chart_db
PORT=3000
```

### 3. Seed the Database

The seeding script will automatically create the database if it doesn't exist, create the necessary tables, and populate them with sample organizational data.

```bash
cd server
npm run seed
```

This will:
- Create the `org_chart_db` database (if it doesn't exist)
- Create the `org_chart_layout` table
- Insert sample organizational hierarchy data

### 4. Build the Project

#### Build Server

```bash
cd server
npm run build
```

This compiles the TypeScript code to JavaScript in the `dist` folder.

#### Build Client

```bash
cd client
npm run build
```

This creates an optimized production build in the `dist` folder.

## Running the Application


### Start the Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000` (or the PORT specified in your `.env` file).

### Start the Client

In a separate terminal:

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173` (Vite's default port).
