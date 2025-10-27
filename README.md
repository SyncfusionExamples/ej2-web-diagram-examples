# Getting Started with EJ2 Diagram Samples

This repository demonstrates the usage of Syncfusion EJ2 Diagram components across multiple frameworks (ASP.NET Core, React, and Angular). Each example showcases different aspects of the diagram component's capabilities and implementation patterns.

## Prerequisites

* .NET SDK 6.0 or 8.0 (for ASP.NET Core)
* Node.js LTS and npm (for React/Angular)
* Modern web browser

## Getting Started

### Clone the repository

```sh
git clone <repo-url>
cd ej2-web-diagram-examples
```

Replace `<repo-url>` with the repository URL. Each sample is contained in its own directory with independent dependencies and configurations.

### ASP.NET Core Sample (Convert to PPTX)

The ASP.NET Core sample demonstrates diagram-to-PowerPoint conversion capabilities:

```powershell
cd ConvertDiagramToPPTX
dotnet run -p ConvertDiagramToPPTX.Net8.csproj
```

Access the application at https://localhost:5001 to explore the interactive diagram editor and try the PPTX export feature. The sample includes pre-configured diagram templates and export options.

### React Flowchart Sample

The React implementation showcases advanced flowchart layouts and customization:

```powershell
cd React/Flowchart-layout
npm install
npm start
```

View the flowchart demo at http://localhost:3000. Experiment with different layout options, node connections, and styling capabilities.

### Angular Sample

The Angular sample demonstrates TypeScript integration and component architecture:

```powershell
cd Angular/Flowchart-layout
npm install
npm start
```

Access the Angular implementation at http://localhost:4200 to explore component-based diagram development.

## Production Build

For React/Angular samples:

```bash
npm run build
```

## Documentation

* [React Diagram](https://ej2.syncfusion.com/react/documentation/diagram/getting-started/)
* [ASP.NET Core EJ2](https://ej2.syncfusion.com/aspnetcore/documentation/introduction)
* [Diagram Overview](https://ej2.syncfusion.com/aspnetcore/documentation/diagram/overview)
