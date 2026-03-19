
<template>
  <div class="app-wrapper">
    <!-- Menu Bar -->
    <div class="menu-bar">
      <div class="menu-left">
        <h1>Collaborative Editing</h1>
      </div>
      <div class="menu-right">
        <span class="user-count">Available Users: {{ currentUsers.length }}</span>
      </div>
    </div>

    <!-- Main Container -->
    <div class="main-container">
      <!-- Symbol Palette -->
      <div id="palette-container" class="palette-section">
        <ejs-symbol-palette
          ref="paletteRef"
          id="symbolpalette"
          :expandMode="expandMode"
          :palettes="palettes"
          :symbolWidth="symbolWidth"
          :symbolHeight="symbolHeight"
          :symbolMargin="symbolMargin"
          :enableSearch="true"
          :getNodeDefaults="getSymbolDefaults"
          :getSymbolInfo="getSymbolInfo"
        />
      </div>

      <!-- Diagram -->
      <div id="diagram-container" class="diagram-section">
        <ejs-diagram
          ref="diagramRef"
          id="diagram"
          :width="diagramWidth"
          :height="diagramHeight"
          :nodes="nodes"
          :connectors="connectors"
          :enableCollaborativeEditing="true"
          :snapSettings="snapSettings"
          :getNodeDefaults="getNodeDefaults"
          :getConnectorDefaults="getConnectorDefaults"
          :dragEnter="dragEnter"
          :historyChange="onHistoryChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide, reactive } from 'vue';
import {
  DiagramComponent as EjsDiagram,
  SymbolPaletteComponent as EjsSymbolPalette,
  DataBinding,
  UndoRedo,
  NodeModel,
  ConnectorModel,
  Node,
  SnapSettings, DiagramCollaboration
} from '@syncfusion/ej2-vue-diagrams';

import type { IHistoryChangeArgs, HistoryEntry } from '@syncfusion/ej2-diagrams';

import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
  type HubConnection,
  HubConnectionState
} from '@microsoft/signalr';

/* ============ Symbol Palette Setup ============ */
const symbolWidth = 60;
const symbolHeight = 60;
const expandMode = 'Multiple';
const symbolMargin = { left: 15, right: 15, top: 15, bottom: 15 };

// Get symbol defaults
const getSymbolDefaults = (symbol: NodeModel) => {
  symbol.style = { strokeColor: '#757575' };
  if (
    symbol.id === 'Terminator' ||
    symbol.id === 'Process' ||
    symbol.id === 'Delay'
  ) {
    symbol.width = 80;
    symbol.height = 40;
  } else if (
    symbol.id === 'Decision' ||
    symbol.id === 'Document' ||
    symbol.id === 'PreDefinedProcess' ||
    symbol.id === 'PaperTap' ||
    symbol.id === 'DirectData' ||
    symbol.id === 'MultiDocument' ||
    symbol.id === 'Data'
  ) {
    symbol.width = 50;
    symbol.height = 40;
  } else {
    symbol.width = 50;
    symbol.height = 50;
  }
  return symbol;
};

// Get symbol info
const getSymbolInfo = (symbol: NodeModel) => {
  return { fit: true };
};

// Helper functions for palette shapes
const getFlowShape = (id: string, shapeType: string) => ({
  id: id,
  shape: { type: 'Flow', shape: shapeType } as any
});

const getBasicShape = (id: string, shapeType: string) => ({
  id: id,
  shape: { type: 'Basic', shape: shapeType } as any
});

// Flow shapes for palette
const flowShapes: any[] = [
  getFlowShape('Terminator', 'Terminator'),
  getFlowShape('Process', 'Process'),
  getFlowShape('Decision', 'Decision'),
  getFlowShape('Document', 'Document'),
  getFlowShape('PreDefinedProcess', 'PreDefinedProcess'),
  getFlowShape('PaperTap', 'PaperTap'),
  getFlowShape('DirectData', 'DirectData'),
  getFlowShape('SequentialData', 'SequentialData'),
  getFlowShape('Sort', 'Sort'),
  getFlowShape('MultiDocument', 'MultiDocument'),
  getFlowShape('Collate', 'Collate'),
  getFlowShape('Or', 'Or'),
  getFlowShape('Extract', 'Extract'),
  getFlowShape('Merge', 'Merge'),
  getFlowShape('OffPageReference', 'OffPageReference'),
  getFlowShape('SequentialAccessStorage', 'SequentialAccessStorage'),
  getFlowShape('Annotation', 'Annotation'),
  getFlowShape('Annotation2', 'Annotation2'),
  getFlowShape('Data', 'Data'),
  getFlowShape('Card', 'Card'),
  getFlowShape('Delay', 'Delay')
];

// Basic shapes for palette
const basicShapes: any[] = [
  getBasicShape('Rectangle', 'Rectangle'),
  getBasicShape('Ellipse', 'Ellipse'),
  getBasicShape('Diamond', 'Diamond'),
  getBasicShape('Triangle', 'Triangle'),
  getBasicShape('Hexagon', 'Hexagon'),
  getBasicShape('Pentagon', 'Pentagon'),
  getBasicShape('Cylinder', 'Cylinder'),
  getBasicShape('Star', 'Star'),
  getBasicShape('Octagon', 'Octagon'),
  getBasicShape('Plus', 'Plus'),
  getBasicShape('Heptagon', 'Heptagon')
];

// Connector symbols for palette
const connectorSymbols: any[] = [
  {
    id: 'Link1',
    type: 'Orthogonal',
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 60, y: 60 },
    targetDecorator: {
      shape: 'Arrow',
      style: { strokeColor: '#757575', fill: '#757575' }
    },
    style: { strokeWidth: 1, strokeColor: '#757575' }
  },
  {
    id: 'link2',
    type: 'Orthogonal',
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 60, y: 60 },
    style: { strokeWidth: 1, strokeColor: '#757575' },
    targetDecorator: { shape: 'None' }
  },
  {
    id: 'Link3',
    type: 'Straight',
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 60, y: 60 },
    targetDecorator: {
      shape: 'Arrow',
      style: { strokeColor: '#757575', fill: '#757575' }
    },
    style: { strokeWidth: 1, strokeColor: '#757575' }
  },
  {
    id: 'link4',
    type: 'Straight',
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 60, y: 60 },
    style: { strokeWidth: 1, strokeColor: '#757575' },
    targetDecorator: { shape: 'None' }
  },
  {
    id: 'link5',
    type: 'Bezier',
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 60, y: 60 },
    style: { strokeWidth: 1, strokeColor: '#757575' },
    targetDecorator: { shape: 'None' }
  }
];

// Palettes configuration
const palettes = [
  { id: 'flow', expanded: true, symbols: flowShapes, title: 'Flow Shapes' },
  { id: 'basic', expanded: true, symbols: basicShapes, title: 'Basic Shapes' },
  { id: 'connectors', expanded: true, symbols: connectorSymbols, title: 'Connectors' }
];

/* ============ Diagram Setup ============ */
const diagramWidth = '100%';
const diagramHeight = '100%';

// Helper to create nodes
const createNode = (
  id: string,
  height: number,
  offsetX: number,
  offsetY: number,
  shape: string,
  annotationContent: string,
  annotationMargin?: any
) => ({
  id: id,
  height: height,
  offsetX: offsetX,
  offsetY: offsetY,
  shape: { type: 'Flow', shape: shape },
  annotations: [{ content: annotationContent, margin: annotationMargin }]
});

// Center X for positioning
const centerX = 550;

// Initialize nodes
const nodes: NodeModel[] = [
  createNode('NewIdea', 60, centerX - 50, 80, 'Terminator', 'Place Order'),
  createNode('Meeting', 60, centerX - 50, 160, 'Process', 'Start Transaction'),
  createNode(
    'BoardDecision',
    60,
    centerX - 50,
    240,
    'Process',
    'Verification'
  ),
  createNode(
    'Project',
    60,
    centerX - 50,
    330,
    'Decision',
    'Credit card valid?'
  ),
  createNode('End', 60, centerX - 50, 430, 'Decision', 'Funds available?'),
  createNode(
    'Payment_method',
    60,
    centerX - 50 + 230,
    330,
    'Process',
    'Enter payment method'
  ),
  createNode(
    'transaction_entered',
    60,
    centerX - 50,
    630,
    'Terminator',
    'Log transaction'
  ),
  createNode(
    'Reconcile_entries',
    60,
    centerX - 50 + 180,
    630,
    'Process',
    'Reconcile the entries'
  ),
  createNode(
    'transaction_completed',
    60,
    centerX - 50,
    530,
    'Process',
    'Complete Transaction'
  ),
  createNode(
    'Data',
    45,
    centerX - 50 - 190,
    530,
    'Data',
    'Send e-mail',
    { left: 25, right: 25 }
  ),
  createNode(
    'Database',
    70,
    centerX - 50 + 175,
    530,
    'DirectData',
    'Customer Database',
    { left: 25, right: 25 }
  )
];

// Initialize connectors
const connectors: ConnectorModel[] = [
  { id: 'connector1', sourceID: 'NewIdea', targetID: 'Meeting' },
  { id: 'connector2', sourceID: 'Meeting', targetID: 'BoardDecision' },
  { id: 'connector3', sourceID: 'BoardDecision', targetID: 'Project' },
  {
    id: 'connector4',
    sourceID: 'Project',
    annotations: [{ content: 'Yes', style: { fill: 'white' } }],
    targetID: 'End'
  },
  {
    id: 'connector5',
    sourceID: 'End',
    annotations: [{ content: 'Yes', style: { fill: 'white' } }],
    targetID: 'transaction_completed'
  },
  { id: 'connector6', sourceID: 'transaction_completed', targetID: 'transaction_entered' },
  { id: 'connector7', sourceID: 'transaction_completed', targetID: 'Data' },
  { id: 'connector8', sourceID: 'transaction_completed', targetID: 'Database' },
  {
    id: 'connector9',
    sourceID: 'Payment_method',
    targetID: 'Meeting',
    type: 'Orthogonal',
    segments: [{ direction: 'Top', type: 'Orthogonal', length: 120 }] as any
  },
  {
    id: 'connector10',
    sourceID: 'End',
    annotations: [{ content: 'No', style: { fill: 'white' } }],
    type: 'Orthogonal',
    targetID: 'Payment_method',
    segments: [{ direction: 'Right', type: 'Orthogonal', length: 100 }] as any
  },
  {
    id: 'connector11',
    sourceID: 'Project',
    annotations: [{ content: 'No', style: { fill: 'white' } }],
    targetID: 'Payment_method'
  },
  {
    id: 'connector12',
    style: { strokeDashArray: '2,2' },
    sourceID: 'transaction_entered',
    targetID: 'Reconcile_entries'
  }
];

// Snap settings
const snapSettings: SnapSettings = {
  horizontalGridlines: { lineColor: '#e0e0e0' },
  verticalGridlines: { lineColor: '#e0e0e0' },
  snapToObjects: true
} as any;

// Get default node properties
const getNodeDefaults = (node: NodeModel) => {
  if (node.width === undefined) {
    node.width = 145;
  }
  if ((node.shape as any).type !== 'Text') {
    node.style = { fill: '#357BD2', strokeColor: 'white' };
  }
  for (let i = 0; i < node.annotations!.length; i++) {
    node.annotations![i].style = {
      color: 'white',
      fill: 'transparent'
    };
  }
  return node;
};

// Get default connector properties
const getConnectorDefaults = (obj: ConnectorModel) => {
  if (obj.id && obj.id.toString().indexOf('connector') !== -1) {
    obj.targetDecorator = { shape: 'Arrow', width: 10, height: 10 };
  }
  return obj;
};

// Handle drag enter event
const dragEnter = (args: any) => {
  const obj = args.element;
  if (obj instanceof Node) {
    const objWidth = obj.width;
    const objHeight = obj.height;
    const ratio = 100 / obj.width;
    obj.width = 100;
    obj.height = obj.height * ratio;
    obj.offsetX = obj.offsetX + (obj.width - objWidth) / 2;
    obj.offsetY = obj.offsetY + (obj.height - objHeight) / 2;
    obj.style = { fill: '#357BD2', strokeColor: 'white' };
  }
};

// Provide required modules
provide('diagram', [DataBinding, UndoRedo, DiagramCollaboration]);

/* ============ SignalR Integration ============ */
const paletteRef = ref<InstanceType<typeof EjsSymbolPalette> | null>(null);
const diagramRef = ref<InstanceType<typeof EjsDiagram> | null>(null);
const currentUsers = ref<string[]>([]);

let hubConnection: HubConnection | null = null;
let clientVersion = 0;
let roomName = 'ej2_vue_group';

// Get diagram instance
function getDiagram(): any {
  const wrapper = diagramRef.value as any;
  return wrapper?.ej2Instance ?? wrapper?.ej2Instances ?? null;
}

// Receive data from other clients
function ReceiveData(data: any) {
  const diagram = getDiagram();
  if (diagram && diagram.setDiagramUpdates) {
    diagram.setDiagramUpdates(data);
  }
}

// Peer selection changed handler
function peerSelectionChanged(evt: any) {
  console.log('Peer selection changed:', evt);
}

// Handle history changes - broadcast to other clients
function onHistoryChange(args: IHistoryChangeArgs) {
  debugger;
  if (
    !hubConnection ||
    hubConnection.state !== HubConnectionState.Connected
  ) {
    console.log('SignalR not connected, skipping broadcast');
    return;
  }

  const diagram = getDiagram();
  const changes = diagram.getDiagramUpdates(args);

  if (changes && changes.length > 0) {
    hubConnection
      .send('BroadcastToOtherClients', changes, clientVersion, [], {}, roomName)
      .catch((err) => console.error('Broadcast failed:', err));
    console.log('Broadcasted changes to other clients:', changes.length, 'updates');
  }
}

// Start SignalR connection
async function startConnection(conn: HubConnection){
  try {
    await conn.start();
  } catch (err) {
    console.error('Failed to connect:', err);
    setTimeout(() => startConnection(conn), 3000);
  }
}

// OnConnectedAsync handler
async function OnConnectedAsync(connId: string) {
  if (connId) {
    try {
      await hubConnection!.send('JoinDiagram', roomName, 'diagram', null);
      console.log('Connected with ID:', connId);
    } catch (err) {
      console.error('Failed to join diagram:', err);
    }
  }
}

// Lifecycle: initialize SignalR and diagram
onMounted(async () => {
  // Create SignalR connection
  hubConnection = new HubConnectionBuilder()
    .withUrl("/diagramhub", {
        skipNegotiation: false,
        transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling
    })
    .withAutomaticReconnect([0, 1000, 5000, 30000])
    .configureLogging(LogLevel.Information)
    .build();


  // Register SignalR event handlers
  hubConnection.on('OnSaveDiagramState', async function (requestId: string) {
    const diagram = getDiagram();
    if (diagram) {
      const data = diagram.saveDiagram();
      try {
        await hubConnection!.invoke('ProvideDiagramState', requestId, data);
      } catch (err) {
        console.error('Failed to provide diagram state:', err);
      }
    }
  });

  hubConnection.on('LoadDiagramData', function (remoteData: any) {
    const diagram = getDiagram();
    if (remoteData && remoteData.data && diagram) {
      diagram.loadDiagram(remoteData.data);
    }
  });

  hubConnection.on('OnConnectedAsync', OnConnectedAsync);

  hubConnection.on('UserJoined', function (message: string) {
    const userIdNumber = parseInt(message, 10);
    const userMessage =
      'SF' + ('0000' + userIdNumber.toString()).slice(-4) + ' joined the diagram.';
    console.log(userMessage);
  });

  hubConnection.on('UserLeft', function (message: string) {
    const userIdNumber = parseInt(message, 10);
    const userMessage =
      'SF' + ('0000' + userIdNumber.toString()).slice(-4) + ' left the diagram.';
    console.log(userMessage);
  });

  hubConnection.on('ShowConflict', function () {
    console.log('You have conflicts in your page. Your changes could not be merged.');
  });

  hubConnection.on('UpdateVersion', function (serverVersion: number) {
    clientVersion = serverVersion;
  });

  hubConnection.on('ReceiveData', function (data: any, serverVersion: number, evt: any) {
    ReceiveData(data);
    clientVersion = serverVersion;
    peerSelectionChanged(evt);
  });

  hubConnection.on('CurrentUsers', function (users: string[]) {
    currentUsers.value = users;
    console.log('Current users:', users);
  });

  // Start connection
  await startConnection(hubConnection);
});

// Cleanup on unmount
onUnmounted(() => {
  if (hubConnection) {
    hubConnection.stop().catch((err) => console.error('Failed to stop connection:', err));
  }
});
</script>

<style>
@import "../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../node_modules/@syncfusion/ej2-navigations/styles/material.css";
@import "../node_modules/@syncfusion/ej2-buttons/styles/material.css";
@import "../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../node_modules/@syncfusion/ej2-popups/styles/material.css";
@import "../node_modules/@syncfusion/ej2-vue-diagrams/styles/material.css";

.app-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.menu-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #357BD2;
  color: #ffffff;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.menu-left h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.menu-right {
  display: flex;
  align-items: center;
}

.user-count {
  font-size: 14px;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.main-container {
  display: flex;
  flex: 1;
  width: 100%;
  background-color: #ffffff;
  color: #213547;
  overflow: hidden;
}

#palette-container {
  width: 230px;
  height: 100%;
  border-right: 1px solid #e0e0e0;
  background-color: #f5f5f5;
  overflow-y: auto;
  overflow-x: hidden;
}

#palette-container::-webkit-scrollbar {
  width: 8px;
}

#palette-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

#palette-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

#palette-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.palette-section {
  width: 100%;
  height: 100%;
}

.diagram-section {
  flex: 1;
  height: 100%;
  width: calc(100% - 230px);
  background-color: #ffffff;
  position: relative;
}

/* Syncfusion component overrides for light theme */
:deep(.e-diagram) {
  background-color: #ffffff;
}

:deep(.e-symbol-palette) {
  background-color: #f5f5f5;
}

:deep(.e-palette-header) {
  background-color: #f0f0f0;
  color: #213547;
  border-bottom: 1px solid #e0e0e0;
}

:deep(.e-palette-item) {
  background-color: #ffffff;
}

:deep(.e-palette-item:hover) {
  background-color: #f0f0f0;
}
</style>
