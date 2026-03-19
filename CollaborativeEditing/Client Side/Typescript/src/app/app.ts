// Syncfusion EJ2 Diagram - Collaborative Editing Sample (TypeScript)
import { Diagram, NodeModel, ConnectorModel, SymbolPalette, PaletteModel, IHistoryChangeArgs, Node, Connector, SnapSettingsModel, SymbolInfo, FlowShapeModel, BasicShapeModel, UndoRedo, DiagramCollaboration } from '@syncfusion/ej2-diagrams';
import * as signalR from '@microsoft/signalr';

let diagram: Diagram;
let palette: SymbolPalette;
let hubConnection: signalR.HubConnection;
Diagram.Inject(UndoRedo, DiagramCollaboration);
// SignalR Configuration
const roomName = "ej2_typescript_group";

async function startConnection(conn: signalR.HubConnection): Promise<void> {
    try {
        await conn.start();
    } catch (err) {
        console.error("Failed to connect:", err);
        setTimeout(() => startConnection(conn), 3000);
    }
}

async function OnConnectedAsync(connId: string): Promise<void> {
    if (connId) {
        await hubConnection.send("JoinDiagram", roomName, "diagram", null);
        console.log("Connected with ID:", connId);
    }
}

function ReceiveData(data: string[]): void {
    if (diagram && (diagram as Diagram).setDiagramUpdates) {
        (diagram as Diagram).setDiagramUpdates(data);
    }
}

let clientVersion = 0;

// Initialize SignalR Hub Connection
hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("/diagramhub", {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
    })
    .withAutomaticReconnect([0, 1000, 5000, 30000])
    .configureLogging(signalR.LogLevel.Information)
    .build();


hubConnection.on("OnSaveDiagramState", async function(requestId: string) {
    let data = (diagram as any).saveDiagram();
    await hubConnection.invoke("ProvideDiagramState", requestId, data);
});

hubConnection.on("LoadDiagramData", function(remoteData: any) {
    if (remoteData && remoteData.data) {
        (diagram as any).loadDiagram(remoteData.data);
    }
});

hubConnection.on("OnConnectedAsync", OnConnectedAsync);

hubConnection.on("UserJoined", function(message: string) {
    const userIdNumber = parseInt(message, 10);
    const userMessage = "SF" + ('0000' + userIdNumber.toString()).slice(-4) + " joined the diagram.";
    console.log(userMessage);
});

hubConnection.on("UserLeft", function(message: string) {
    const userIdNumber = parseInt(message, 10);
    const userMessage = "SF" + ('0000' + userIdNumber.toString()).slice(-4) + " left the diagram.";
    console.log(userMessage);
});

hubConnection.on("ShowConflict", function() {
    console.log('You have conflicts in your page. Your changes could not be merged.');
});

hubConnection.on("UpdateVersion", function(serverVersion: number) {
    clientVersion = serverVersion;
});

hubConnection.on("ReceiveData", function(data: any, serverVersion: number, evt: any) {
    ReceiveData(data);
    clientVersion = serverVersion;
});

hubConnection.on("CurrentUsers", function(users: string[]) {
    updateUserCount(users);
});

// Update user count on menu bar
function updateUserCount(users: string[]): void {
    const userCountElement = document.getElementById('user-count');
    if (userCountElement) {
        userCountElement.textContent = `Available users: ${users.length}`;
        console.log('Current users:', users);
    }
}

// Initialize on page load with proper timing
window.addEventListener('DOMContentLoaded', function() {
    // Initialize palette first 
    initializeSymbolPalette();
    //initialize diagram 
    initializeDiagram();
    startConnection(hubConnection);
});

// Get centerX for positioning
const centerX = 550;

// Function to create a node with given properties
function createNode(
    id: string,
    height: number,
    offsetX: number,
    offsetY: number,
    shape: string,
    annotationContent: string,
    annotationMargin?: { left: number; right: number }
): NodeModel {
    return {
        id: id,
        height: height,
        offsetX: offsetX,
        offsetY: offsetY,
        shape: {type: 'Flow', shape: shape} as FlowShapeModel,
        annotations: [{ content: annotationContent, margin: annotationMargin }]
    };
}

// Initializing the nodes for the diagram
const nodes: NodeModel[] = [
    createNode('NewIdea', 60, centerX - 50, 80, 'Terminator', 'Place Order'),
    createNode('Meeting', 60, centerX - 50, 160, 'Process', 'Start Transaction'),
    createNode('BoardDecision', 60, centerX - 50, 240, 'Process', 'Verification'),
    createNode('Project', 60, centerX - 50, 330, 'Decision', 'Credit card valid?'),
    createNode('End', 60, centerX - 50, 430, 'Decision', 'Funds available?'),
    createNode('Payment_method', 60, centerX - 50 + 230, 330, 'Process', 'Enter payment method'),
    createNode('transaction_entered', 60, centerX - 50, 630, 'Terminator', 'Log transaction'),
    createNode('Reconcile_entries', 60, centerX - 50 + 180, 630, 'Process', 'Reconcile the entries'),
    createNode('transaction_completed', 60, centerX - 50, 530, 'Process', 'Complete Transaction'),
    createNode('Data', 45, centerX - 50 - 190, 530, 'Data', 'Send e-mail', { left: 25, right: 25 }),
    createNode('Database', 70, centerX - 50 + 175, 530, 'DirectData', 'Customer Database', { left: 25, right: 25 })
];

// Initializes the connector for the diagram
const connectors: ConnectorModel[] = [
    { id: 'connector1', sourceID: 'NewIdea', targetID: 'Meeting' },
    { id: 'connector2', sourceID: 'Meeting', targetID: 'BoardDecision' },
    { id: 'connector3', sourceID: 'BoardDecision', targetID: 'Project' },
    { id: 'connector4', sourceID: 'Project', annotations: [{ content: 'Yes', style: { fill: 'white' } }], targetID: 'End' },
    { id: 'connector5', sourceID: 'End', annotations: [{ content: 'Yes', style: { fill: 'white' } }], targetID: 'transaction_completed' },
    { id: 'connector6', sourceID: 'transaction_completed', targetID: 'transaction_entered' },
    { id: 'connector7', sourceID: 'transaction_completed', targetID: 'Data' },
    { id: 'connector8', sourceID: 'transaction_completed', targetID: 'Database' },
    { id: 'connector9', sourceID: 'Payment_method', targetID: 'Meeting', type: 'Orthogonal', segments: [{ direction: 'Top', type: 'Orthogonal', length: 120 }] },
    { id: 'connector10', sourceID: 'End', annotations: [{ content: 'No', style: { fill: 'white' } }], type: 'Orthogonal', targetID: 'Payment_method', segments: [{ direction: 'Right', type: 'Orthogonal', length: 100 }] },
    { id: 'connector11', sourceID: 'Project', annotations: [{ content: 'No', style: { fill: 'white' } }], targetID: 'Payment_method' },
    { id: 'connector12', style: { strokeDashArray: '2,2' }, sourceID: 'transaction_entered', targetID: 'Reconcile_entries' }
];

// Handle history changes - send updates to other clients
function onHistoryChange(args: IHistoryChangeArgs): void {
    if (!hubConnection || hubConnection.state !== signalR.HubConnectionState.Connected) {
        console.log('SignalR not connected, skipping broadcast');
        return;
    }
    let changes = (diagram as any).getDiagramUpdates(args);

    if (changes && changes.length > 0) {
        hubConnection.send('BroadcastToOtherClients', changes, clientVersion, [], {}, roomName);
        console.log('Broadcasted changes to other clients:', changes.length, 'updates');
    }
}

// Initialize Diagram
function initializeDiagram(): void {
    diagram = new Diagram({
        width: '100%',
        height: '100%',
        nodes: nodes,
        connectors: connectors,
        enableCollaborativeEditing: true,
        snapSettings: {
            horizontalGridlines: { lineColor: '#e0e0e0' },
            verticalGridlines: { lineColor: '#e0e0e0' },
            snapToObjects: true
        } as SnapSettingsModel,
        getNodeDefaults: getNodeDefaults,
        getConnectorDefaults: getConnectorDefaults,
        dragEnter: dragEnter,
        historyChange: onHistoryChange
    });

    diagram.appendTo('#diagram-container');
}

// Get default node properties
function getNodeDefaults(node: NodeModel): NodeModel {
    if (node.width === undefined) {
        node.width = 145;
    }
    if ((node.shape as any).type !== 'Text') {
        node.style = { fill: '#357BD2', strokeColor: 'white' };
    }
    if(node.annotations){
    for (let i = 0; i < node.annotations.length; i++) {
        node.annotations[i].style = {
            color: 'white',
            fill: 'transparent'
        };
    }
}
    return node;
}

// Get default connector properties
function getConnectorDefaults(obj: ConnectorModel): ConnectorModel {
    if (obj.id?.indexOf('connector') !== -1) {
        obj.targetDecorator = { shape: 'Arrow', width: 10, height: 10 };
    }
    return obj;
}

// Handle drag enter event
function dragEnter(args: { element: Node | Connector }): void {
    let obj = args.element;
    if (obj instanceof Node) {
        let objWidth = obj.width;
        let objHeight = obj.height;
        let ratio = 100 / obj.width;
        obj.width = 100;
        obj.height *= ratio;
        obj.offsetX += (obj.width - objWidth) / 2;
        obj.offsetY += (obj.height - objHeight) / 2;
        obj.style = { fill: '#357BD2', strokeColor: 'white' };
    }
}

// Get symbol defaults
function getSymbolDefaults(symbol: any): void {
    symbol.style = { strokeColor: '#757575' };
    if (symbol.id === 'Terminator' || symbol.id === 'Process' || symbol.id === 'Delay') {
        symbol.width = 80;
        symbol.height = 40;
    } else if (symbol.id === 'Decision' || symbol.id === 'Document' || symbol.id === 'PreDefinedProcess' ||
        symbol.id === 'PaperTap' || symbol.id === 'DirectData' || symbol.id === 'MultiDocument' || symbol.id === 'Data') {
        symbol.width = 50;
        symbol.height = 40;
    } else {
        symbol.width = 50;
        symbol.height = 50;
    }
}

// Get symbol info
function getSymbolInfo(symbol: any): SymbolInfo {
    return { fit: true };
}

// Get flow shape
function getFlowShape(id: string, shapeType: string) : NodeModel {
    return { id: id, shape: { type: 'Flow', shape: shapeType } as FlowShapeModel };
}

// Get basic shape
function getBasicShape(id: string, shapeType: string) : NodeModel {
    return { id: id, shape: { type: 'Basic', shape: shapeType } as BasicShapeModel };
}

// Initialize Symbol Palette
function initializeSymbolPalette(): void {
    // Initialize flow shapes for symbol palette
    const flowShapes: NodeModel[] = [
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

    // Initialize connector symbols for symbol palette
    const connectorSymbols: ConnectorModel[] = [
        {
            id: 'Link1',
            type: 'Orthogonal',
            sourcePoint: { x: 0, y: 0 },
            targetPoint: { x: 60, y: 60 },
            targetDecorator: { shape: 'Arrow', style: { strokeColor: '#757575', fill: '#757575' } },
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
            targetDecorator: { shape: 'Arrow', style: { strokeColor: '#757575', fill: '#757575' } },
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

    // Initialize basic shapes for symbol palette
    const basicShapes: NodeModel[] = [
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

    const palettes: PaletteModel[] = [
        { id: 'flow', expanded: true, symbols: flowShapes, title: 'Flow Shapes' },
        { id: 'basic', expanded: true, symbols: basicShapes, title: 'Basic Shapes' },
        { id: 'connectors', expanded: true, symbols: connectorSymbols, title: 'Connectors' }
    ];

    // Create and render symbol palette
    const paletteContainer = document.getElementById('palette-container') as HTMLElement;

    palette = new SymbolPalette({
        expandMode: 'Multiple',
        palettes: palettes,
        width: paletteContainer.offsetWidth || 230,
        height: paletteContainer.offsetHeight || '100%',
        symbolHeight: 60,
        symbolWidth: 60,
        symbolMargin: { left: 15, right: 15, top: 15, bottom: 15 },
        enableSearch: true,
        getNodeDefaults: getSymbolDefaults,
        getSymbolInfo: getSymbolInfo
    });

    palette.appendTo('#palette-container');
}

