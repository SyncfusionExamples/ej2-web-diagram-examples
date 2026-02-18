# Collaborative Diagram Editor

A real-time collaborative diagram editor built with **React + TypeScript + Syncfusion Diagram** components. Multiple users can edit the same diagram simultaneously with WebSocket-powered real-time synchronization.

## 🎯 Features

### Diagram Editor
- **Symbol Palette**: Pre-built flow shapes, basic shapes, and connectors
- **Drag & Drop**: Add shapes to the canvas by dragging from the palette
- **Interactive Canvas**: Move, resize, rotate nodes and create connections
- **Property Panel**: Edit node properties (position, size, colors, text, etc.)

### Toolbar Operations
- **File Operations**: New, Open, Save, Print
- **Export**: Download as JPG, PNG, or SVG
- **View Tools**: Fit to page, Zoom in/out
- **Drawing Tools**: Pointer, Text, Connector, Pan
- **Edit Operations**: Undo, Redo

### Collaboration
- **Real-time Sync**: Changes are instantly broadcast to all connected clients
- **WebSocket Communication**: Low-latency state synchronization
- **Connection Status**: Visual indicator showing collaboration status
- **Multi-user Support**: Multiple users can edit simultaneously

## 📌 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Syncfusion React Diagram, Toolbar, Inputs, Buttons
- **Collaboration**: WebSocket (ws library)
- **Backend**: Node.js + Express + WebSocket Server
- **Styling**: CSS3 + Bootstrap 5.3 Theme

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn** or **pnpm**

### Installation

1. **Clone or navigate to the project directory**:
   ```powershell
   cd d:\13_02_2026_CollabSample
   ```

2. **Install frontend dependencies**:
   ```powershell
   npm install
   ```

3. **Install server dependencies**:
   ```powershell
   cd server
   npm install
   cd ..
   ```

### Running the Application

You need to run **two separate terminals**:

#### Terminal 1: Start the WebSocket Server

```powershell
cd server
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════╗
║   Collaborative Diagram Editor Server                 ║
╠═══════════════════════════════════════════════════════╣
║   HTTP Server:      http://localhost:8080             ║
║   WebSocket Server: ws://localhost:8080               ║
║                                                       ║
║   Endpoints:                                          ║
║   - GET  /health              Health check            ║
║   - GET  /api/diagram         Get current state       ║
║   - POST /api/diagram/reset   Reset diagram           ║
╚═══════════════════════════════════════════════════════╝
```

#### Terminal 2: Start the React App

```powershell
npm run dev
```

The app will start at: **http://localhost:3000**

### Testing Collaboration

1. Open **http://localhost:3000** in your browser
2. Open the **same URL in another browser window** (or incognito mode)
3. Make changes in one window (add shapes, move nodes, change colors)
4. Watch the changes appear in real-time in the other window! 🎉

## 📁 Project Structure

```
d:\13_02_2026_CollabSample\
├── src/
│   ├── components/
│   │   ├── DiagramEditor.tsx      # Main diagram canvas with collaboration
│   │   ├── Toolbar.tsx            # Top toolbar with commands
│   │   ├── SymbolPalette.tsx      # Left panel with draggable shapes
│   │   └── PropertyPanel.tsx      # Right panel for editing properties
│   ├── collaboration/
│   │   └── CollaborationService.ts # WebSocket client service
│   ├── types/
│   │   └── diagramTypes.ts        # TypeScript type definitions
│   ├── App.tsx                    # Main app component (layout)
│   ├── App.css                    # App-specific styles
│   ├── index.css                  # Global styles & Syncfusion themes
│   └── main.tsx                   # React entry point
├── server/
│   ├── server.js                  # WebSocket server
│   └── package.json               # Server dependencies
├── package.json                   # Frontend dependencies
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
├── index.html                     # HTML template
└── README.md                      # This file
```

## 🎨 Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         TOOLBAR                             │
│  [New] [Open] [Save] [Print] | [JPG] [PNG] [SVG] |         │
│  [Fit] [+] [-] | [Select] [Text] [Connect] [Pan] |         │
│  [Undo] [Redo]                                              │
├──────────┬──────────────────────────────────┬───────────────┤
│  SYMBOL  │                                  │   PROPERTY    │
│  PALETTE │        DIAGRAM CANVAS            │    PANEL      │
│          │                                  │               │
│ ┌─────┐  │  [Collaborative Diagram Area]   │  Position:    │
│ │Flow │  │                                  │  X: 100       │
│ │Shape│  │  🟢 Connected                   │  Y: 100       │
│ └─────┘  │                                  │               │
│ ┌─────┐  │  [Add shapes by dragging from   │  Size:        │
│ │Basic│  │   symbol palette]               │  W: 120       │
│ │Shape│  │                                  │  H: 60        │
│ └─────┘  │  [Select nodes to edit          │               │
│          │   properties in right panel]    │  Appearance:  │
│ ┌─────┐  │                                  │  Fill: 🎨     │
│ │Conn-│  │                                  │  Border: 🎨   │
│ │ector│  │                                  │               │
│ └─────┘  │                                  │  Text: ___    │
│          │                                  │  Font: Arial  │
└──────────┴──────────────────────────────────┴───────────────┘
```

## 🧩 Component Details

### DiagramEditor Component
- **Purpose**: Main diagram canvas with Syncfusion DiagramComponent
- **Features**:
  - Drag & drop nodes from symbol palette
  - Select, move, resize, rotate nodes
  - Create connectors between nodes
  - Undo/Redo support
  - Real-time collaboration via WebSocket
  - Connection status indicator

### Toolbar Component
- **Purpose**: Command bar for diagram operations
- **Sections**:
  - **File**: New, Open, Save, Print
  - **Export**: JPG, PNG, SVG
  - **View**: Fit to page, Zoom in/out
  - **Tools**: Pointer, Text, Connector, Pan
  - **Edit**: Undo, Redo

### SymbolPalette Component
- **Purpose**: Provides draggable shapes
- **Categories**:
  - **Flow Shapes**: Terminator, Process, Decision, Document, Data, etc.
  - **Basic Shapes**: Rectangle, Ellipse, Triangle, Hexagon, Pentagon, Cylinder
  - **Connectors**: Orthogonal, Straight, Bezier

### PropertyPanel Component
- **Purpose**: Context-sensitive property editor
- **Sections**:
  - **Position & Dimensions**: X, Y, Width, Height
  - **Appearance**: Fill color, Border color, Border type, Thickness, Opacity
  - **Text**: Content, Font family, Font size, Color, Alignment, Bold, Italic

## 🤝 Collaboration Architecture

### Client-Server Model

```
┌────────────┐                    ┌────────────┐
│  Client 1  │◄──────────────────►│            │
│  (Browser) │                    │  WebSocket │
└────────────┘                    │   Server   │
                                  │  (Node.js) │
┌────────────┐                    │            │
│  Client 2  │◄──────────────────►│            │
│  (Browser) │                    └────────────┘
└────────────┘
```

### Message Flow

1. **User makes a change** (adds node, moves shape, edits property)
2. **DiagramEditor** detects the change via event handlers
3. **CollaborationService** sends update to WebSocket server
4. **Server** broadcasts the change to all other connected clients
5. **Other clients** receive the update and apply it to their diagrams

### Message Types

- `REQUEST_STATE`: Client requests current diagram state
- `STATE_SYNC`: Server sends full diagram state to client
- `DIAGRAM_UPDATE`: Client sends or receives diagram changes
- `NODE_ADDED/UPDATED/DELETED`: Specific node operations
- `CONNECTOR_ADDED/UPDATED/DELETED`: Specific connector operations

## 🔧 Configuration

### Change WebSocket Server URL

Edit `src/collaboration/CollaborationService.ts`:

```typescript
constructor(serverUrl: string = 'ws://localhost:8080') {
  // Change to your server URL
  this.serverUrl = serverUrl;
}
```

### Change Server Port

Edit `server/server.js`:

```javascript
const PORT = 8080; // Change to your desired port
```

### Syncfusion License

For production use, you need a Syncfusion license. Get a **free 30-day trial** at:
https://www.syncfusion.com/account/manage-trials/downloads

Update `src/main.tsx`:

```typescript
registerLicense('YOUR_LICENSE_KEY_HERE');
```

Without a license, the app will show a trial banner but will work fully.

## 📝 Available Scripts

### Frontend

```powershell
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run preview  # Preview production build
```

### Server

```powershell
cd server
npm start        # Start WebSocket server (ws://localhost:8080)
npm run dev      # Same as start
```

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"

**Solution**: Make sure the WebSocket server is running:
```powershell
cd server
npm start
```

### Issue: "Module not found" errors

**Solution**: Install dependencies:
```powershell
npm install
cd server
npm install
```

### Issue: Changes not syncing between browsers

**Solution**:
1. Check that both clients show "🟢 Connected" indicator
2. Verify server is running and shows "Client connected" messages
3. Check browser console for WebSocket errors

### Issue: TypeScript errors

**Solution**: These are expected before installing dependencies. Run:
```powershell
npm install
```

## 📚 Learn More

### Syncfusion Documentation
- [React Diagram Component](https://ej2.syncfusion.com/react/documentation/diagram/getting-started)
- [Symbol Palette](https://ej2.syncfusion.com/react/documentation/diagram/symbol-palette)
- [React Toolbar](https://ej2.syncfusion.com/react/documentation/toolbar/getting-started)

### WebSocket
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [ws Library (Node.js)](https://github.com/websockets/ws)

## 🎯 Next Steps

### Enhancements You Can Add

1. **User Avatars**: Show who's currently editing
2. **Cursor Tracking**: Display other users' cursors
3. **Chat Feature**: Add real-time chat
4. **Conflict Resolution**: Handle simultaneous edits better
5. **Persistence**: Save diagrams to database
6. **Authentication**: Add user login
7. **Room System**: Support multiple diagram rooms
8. **Version History**: Track diagram changes over time

## 📄 License

MIT License - Feel free to use this project as a starting point for your own applications!

## 🙏 Acknowledgments

- **Syncfusion** for the excellent React Diagram components
- **Vite** for blazing-fast development experience
- **React** team for the amazing framework

---

**Happy Collaborative Diagramming! 🎨✨**

For issues or questions, create an issue in the repository.
