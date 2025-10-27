# Getting Started with EJ2 Diagram Samples (ASP.NET Core, React, and Angular)

This repository contains focused examples that demonstrate how to use the Syncfusion EJ2 Diagram component across multiple frameworks. The goal is to provide small, practical samples you can run and adapt:

- An ASP.NET Core MVC sample (ConvertDiagramToPPTX) that shows server-side hosting, rendering, and an export flow that converts diagrams into a downloadable PowerPoint (.pptx).
- A React (Create React App) Flowchart layout sample that demonstrates client-side diagram construction, layout algorithms, and interactivity.
- An optional Angular sample that illustrates the same diagram features in an Angular environment.

Each sample is runnable and intended as a starting point: inspect the code to see how nodes and connectors are created, experiment with layout algorithms, and try client- and server-side export flows.

Prerequisites

- .NET SDK 6.0 or 8.0 (for the ASP.NET Core sample)
- Node.js (LTS) and npm (for React and Angular samples)
- A modern web browser to view the demos

Run the ASP.NET Core MVC sample

Open PowerShell in this repository and run:

```powershell
cd ConvertDiagramToPPTX
# Run the .NET 8 project (or switch to the .NET 6 csproj if needed)
dotnet run -p ConvertDiagramToPPTX.Net8.csproj
```

The application will print a local HTTPS URL (commonly https://localhost:5001). Open that URL to see the diagram demo and try the Convert to PPTX action to download a PowerPoint file containing the diagram.

Run the React (CRA) Flowchart Layout sample

```powershell
cd React/Flowchart-layout
npm install
npm start
```

Open http://localhost:3000 in your browser to view the example. The React sample focuses on layout configuration (flowchart layout) and interactive diagram features.

Angular

If the Angular sample exists under `Angular/`, start it the same way:

```powershell
cd Angular/Flowchart-layout
npm install
npm start
```

Open the URL shown by the dev server (commonly http://localhost:4200).

Documentation and resources

- React Diagram docs: https://ej2.syncfusion.com/react/documentation/diagram/getting-started/
- ASP.NET Core EJ2 docs: https://ej2.syncfusion.com/aspnetcore/documentation/introduction
- Diagram overview: https://ej2.syncfusion.com/aspnetcore/documentation/diagram/overview

Troubleshooting tips

- Port in use: stop the conflicting process or run the app on a different port.
- Missing SDKs: install the required .NET SDK or Node.js version.
- npm install failures: remove `node_modules` and `package-lock.json`, then run `npm install` again.
- ASP.NET issues: confirm the correct .csproj is used and that CDN links in `Views/Shared/_Layout.cshtml` are reachable.

Notes

- If you plan to use EJ2 Diagram with Next.js, refer to the Syncfusion Next.js documentation for configuration guidance. The repository also includes a React sample that is easy to adapt to Next.js or other React-based frameworks.

If you want, I can add a short micro-sample that programmatically creates a diagram node and demonstrates export to PPTX — tell me which sample you prefer and I will implement it.

## Features

* Interactive diagram creation and editing
* Built-in shape library and customizable shapes
* Automatic layout algorithms (flowchart, hierarchical, etc.)
* Export options (PPTX export in the ASP.NET sample, plus image/SVG in client samples)
* Undo/redo and basic editing operations

## Clone the repository

To get a local copy of these examples, run:

```sh
git clone <repo-url>
cd ej2-web-diagram-examples
```

Replace <repo-url> with your fork or the upstream repository URL.

## Installing Packages

For the React and Angular samples, install dependencies inside each sample folder:

```powershell
cd React/Flowchart-layout
npm install
```

And for Angular (if present):

```powershell
cd Angular/Flowchart-layout
npm install
```

## Run the application (React / Angular)

For React (development):

```powershell
npm start
```

For Angular (development):

```powershell
npm start
```

The dev server will report the local URL (commonly http://localhost:3000 for React and http://localhost:4200 for Angular).

## Build for Production

To create a production build for a client sample (React):

```bash
npm run build
```

This produces optimized static assets you can serve from any static host.
