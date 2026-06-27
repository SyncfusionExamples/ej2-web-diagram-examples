# Vue 3 + TypeScript + Vite — Collaborative Diagram Editing

This example demonstrates a simple Vue 3 + TypeScript + Vite app that shows how to use the [Vue Diagram](https://www.syncfusion.com/diagram-sdk/vue-diagram) component with collaborative editing.

What this app does:
- Tracks incremental diagram updates (add/move/connect) in the browser.
- Sends and receives those updates to/from a server using a realtime protocol (SignalR or WebSockets).
- Lets multiple users see changes live by opening the app in more than one browser window.

Prerequisites
- Node.js (16+) and npm or yarn

Quick setup
1. Install dependencies:

	```bash
	npm install
	# or
	yarn
	```

2. Start the dev server:

	```bash
	npm run dev
	# or
	yarn dev
	```

3. Run or connect a realtime server that supports broadcasting (SignalR or WebSocket). The app expects a server endpoint that relays incremental diagram changes between clients.

How to test collaborative editing
- Open the app in two or more browser windows (or devices).
- Perform actions (create shapes, move, connect). Changes should appear in the other windows in real time.

Notes
- This repository provides the client-side example. You will need a compatible server implementation to relay updates between clients (SignalR, WebSocket, etc.).