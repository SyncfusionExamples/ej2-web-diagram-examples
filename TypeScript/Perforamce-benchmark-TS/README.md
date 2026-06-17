# EJ2 Diagram Performance Benchmark

A performance testing application for the [Syncfusion EJ2 Diagram](https://www.syncfusion.com/javascript-ui-controls/js-diagram) component, built with TypeScript. Measure rendering and interaction performance across multiple diagram layouts and scenarios.

## Prerequisites

- Node.js `v14.15.0` or higher
- npm

## Installation

Install dependencies:

```bash
npm install
```

## Usage

Start the development server:

```bash
npm run start
```

## Features

### Rendering Performance Tests

Test diagram rendering with various layouts and complexity:

- **Init** - Linear node/connector layout with configurable counts
- **Hierarchical Tree** - Top-to-bottom tree layout
- **Complex Tree** - Multi-parent hierarchical structure
- **Organizational Chart** - Standard org chart layout
- **Mind Map** - Radial mind map layout
- **Org Template** - Custom template-based org chart

### Interaction Performance Tests

Measure interactive operation responsiveness:

- **Drag** - Node drag and drop performance
- **Resize** - Node resizing responsiveness
- **Rotate** - Node rotation performance
- **Endpoint Drag** - Connector endpoint manipulation
- **Selection** - Multi-node selection (10/50 nodes)
- **Connector Types** - Switch between Straight/Orthogonal/Bezier

### Configuration Options

- **Node Count** - Number of nodes to render (10-100)
- **Connector Count** - Number of connectors (0-100)
- **Show Annotations** - Toggle node labels on/off

All performance metrics (rendering time, interaction duration) are displayed in real-time in the Live Performance Output log.

## Build

Create a production build:

```bash
npm run build
```

## Resources

- [EJ2 Diagram Documentation](https://ej2.syncfusion.com/documentation/diagram/getting-started/)
- [EJ2 Diagram Demos](https://ej2.syncfusion.com/demos/#/material/diagram/default-functionality.html)
- [Syncfusion JavaScript Controls](https://www.syncfusion.com/javascript-ui-controls)
