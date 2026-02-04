# Syncfusion React Diagram + Node.js + PostgreSQL - Hierarchical Layout

A full-stack application demonstrating hierarchical data visualization using Syncfusion EJ2 React Diagram component with a Node.js backend and PostgreSQL database.

## Features

- 🎨 **Interactive Hierarchical Tree Layout** - Visual representation of hierarchical data
- 🔄 **Real-time Data Binding** - Fetch and display data from PostgreSQL database
- 💎 **Type-Safe** - Full TypeScript support for both frontend and backend
- 🎯 **Clean Architecture** - Organized folder structure with separation of concerns
- 🚀 **Modern Stack** - React 18, Node.js, Express, PostgreSQL

## Technology Stack

### Frontend
- **React 18+** with TypeScript
- **Vite** - Build tool
- **Syncfusion EJ2 React Diagrams** - Diagram component
- **Material Theme** - Pre-built Syncfusion theme

### Backend
- **Node.js 18+** with TypeScript
- **Express** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client
- **CORS** - Cross-origin resource sharing

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14.x or higher ([Download](https://www.postgresql.org/download/))
- **npm** (comes with Node.js)

## Project Structure

```
project-root/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── DiagramHierarchicalLayout.tsx
│   │   ├── services/
│   │   │   └── layoutService.ts
│   │   ├── types/
│   │   │   └── layout.types.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── index.css         # Syncfusion CSS imports
│   ├── package.json
│   └── tsconfig.json
│
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── data/
│   │   │   └── layoutSeed.json
│   │   ├── db/
│   │   │   └── index.ts      # Connection pool
│   │   ├── routes/
│   │   │   └── layout.routes.ts
│   │   ├── controllers/
│   │   │   └── layout.controller.ts
│   │   ├── types/
│   │   │   └── layout.types.ts
│   │   ├── scripts/
│   │   │   └── seedLayout.ts
│   │   └── server.ts
│   ├── .env                   # Environment variables (git-ignored)
│   ├── .env.example          # Example environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

## Installation

### 1. Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory (copy from `.env.example`):

```bash
cd ../server
copy .env.example .env   # Windows
# or
cp .env.example .env     # Mac/Linux
```

Edit the `.env` file with your PostgreSQL credentials:

```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=diagramlayout
PORT=5000
NODE_ENV=development
```

### 4. Setup PostgreSQL Database

1. **Create Database**:
   
   Open PostgreSQL command line (psql) or pgAdmin and run:
   ```sql
   CREATE DATABASE diagramlayout;
   ```

2. **Run Seed Script**:
   
   From the `server` directory:
   ```bash
   npm run seed
   ```
   
   This will:
   - Create the `hierarchicallayout` table
   - Insert sample data
   - Create necessary indexes

   You should see:
   ```
   Starting database seeding...
   Table created successfully
   Successfully seeded 12 nodes
   Database seeding completed!
   ```

## Running the Application

### Start Backend Server

From the `server` directory:

```bash
npm run dev
```

You should see:
```
✓ Database connected successfully
✓ Server running on http://localhost:5000
✓ API endpoint: http://localhost:5000/api/layoutJS
```

### Start Frontend

Open a new terminal and from the `client` directory:

```bash
npm run dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Access the Application

Open your browser and navigate to: **http://localhost:5173**

You should see the hierarchical diagram with nodes arranged in a tree layout.

## Available Scripts

### Backend (server/)

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed the database with sample data

### Frontend (client/)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

### GET /api/layoutJS

Returns hierarchical layout data.

**Response:**
```json
[
  {
    "id": "Diagram",
    "parentId": null,
    "label": "Diagram"
  },
  {
    "id": "Layout",
    "parentId": "Diagram",
    "label": "layout"
  }
  // ... more nodes
]
```

## Troubleshooting

### Backend Issues

#### Port 5000 Already in Use
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Mac/Linux
lsof -i :5000
kill -9 <process_id>
```

Or change the port in `server/.env`:
```env
PORT=5001
```
And update the API URL in `client/src/services/layoutService.ts`.

#### Database Connection Failed

1. Verify PostgreSQL is running:
   ```bash
   # Windows
   services.msc  # Look for PostgreSQL service
   
   # Mac
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Check credentials in `server/.env`

3. Ensure database exists:
   ```sql
   \l  -- List all databases in psql
   ```

### Frontend Issues

#### CORS Errors

Ensure the backend CORS configuration in `server/src/server.ts` matches your frontend URL:
```typescript
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

#### Diagram Not Rendering

1. Check browser console for errors
2. Verify Syncfusion CSS is imported in `src/index.css`
3. Ensure data is being fetched (check Network tab)
4. Verify backend is running and returning data

#### Empty Diagram

1. Check if seed script ran successfully
2. Verify API returns data: http://localhost:5000/api/layoutJS
3. Check browser console for errors

### Build Issues

#### TypeScript Errors

Run type checking:
```bash
# Backend
cd server
npx tsc --noEmit

# Frontend
cd client
npx tsc --noEmit
```

## Database Schema

### Table: hierarchicallayout

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key - unique node identifier |
| parentId | TEXT | Foreign key to parent node (nullable for root) |
| label | TEXT | Display label for the node |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `parentId` for performance

## Extension Ideas

- 🔧 **CRUD Operations** - Add, edit, delete nodes
- 🎨 **Custom Styling** - Node colors, shapes, sizes
- 💾 **Export** - Save diagram as image (PNG, SVG)
- 🔍 **Search** - Find and highlight nodes
- 📱 **Responsive Design** - Mobile-friendly layout
- 🔐 **Authentication** - User login and permissions
- 📊 **Analytics** - Track diagram interactions
- 🌙 **Dark Mode** - Theme switcher

## Dependencies

### Frontend Dependencies
```json
{
  "@syncfusion/ej2-react-diagrams": "^latest",
  "@syncfusion/ej2-data": "^latest",
  "@syncfusion/ej2-base": "^latest",
  "react": "^18.x",
  "react-dom": "^18.x"
}
```

### Backend Dependencies
```json
{
  "express": "^4.x",
  "pg": "^8.x",
  "cors": "^2.x",
  "dotenv": "^16.x"
}
```

## License

This project is a sample application for educational purposes.

## Support

For Syncfusion component support, visit:
- [Documentation](https://ej2.syncfusion.com/react/documentation/diagram/getting-started/)
- [API Reference](https://ej2.syncfusion.com/react/documentation/api/diagram/)
- [Support Forum](https://www.syncfusion.com/forums)

---

**Built with ❤️ using Syncfusion EJ2 React Diagrams**
