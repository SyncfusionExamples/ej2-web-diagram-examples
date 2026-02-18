/**
 * Initial Diagram Data - CI/CD Pipeline
 * Converted from Blazor C# to EJ2 React Diagram format
 */

import { NodeModel, ConnectorModel, OrthogonalSegmentModel } from '@syncfusion/ej2-react-diagrams';

// Layout positions
const centerX = 200;   // center column
const leftX = 20;      // left column
const rightX = 400;    // right column

// Vertical offset to move the diagram down to make room for the title
const offsetY = 70;

// Y coordinates (top to bottom) + offset
const startY = 20 + offsetY;       // Start
const commitY = 110 + offsetY;     // Commit
const decisionY1 = 190 + offsetY;  // Decision 1
const testReportY = 270 + offsetY; // Test Report
const rateY = 290 + offsetY;       // Rate-limit
const decisionY2 = 380 + offsetY;  // Decision 2
const deployY = 470 + offsetY;     // Deploy center
const endY = 560 + offsetY;        // End

// Helper orthogonal segments for connector routing
const goDown75: OrthogonalSegmentModel = {
  type: 'Orthogonal',
  length: 75,
  direction: 'Bottom'
};

const goDown100: OrthogonalSegmentModel = {
  type: 'Orthogonal',
  length: 100,
  direction: 'Bottom'
};

const goRight150: OrthogonalSegmentModel = {
  type: 'Orthogonal',
  length: 150,
  direction: 'Right'
};

const goLeft140: OrthogonalSegmentModel = {
  type: 'Orthogonal',
  length: 140,
  direction: 'Left'
};

/**
 * Helper function to create a flow node
 */
function createFlowNode(
  id: string,
  offsetX: number,
  offsetY: number,
  shape: 'Terminator' | 'Process' | 'Decision' | 'Document',
  label: string
): NodeModel {
  return {
    id,
    offsetX,
    offsetY,
    width: 100,
    height: 60,
    shape: {
      type: 'Flow',
      shape: shape
    },
    style: {
      fill: '#357BD2',
      strokeColor: '#357BD2'
    },
    annotations: [
      {
        content: label,
        style: {
          color: 'white',
          fill: 'transparent',
          fontSize: 12,
          bold: false
        }
      }
    ]
  };
}

/**
 * Helper function to create a connector
 */
function createConnector(
  id: string,
  sourceID: string,
  targetID: string,
  label?: string,
  segments?: OrthogonalSegmentModel[]
): ConnectorModel {
  const connector: ConnectorModel = {
    id,
    sourceID,
    targetID,
    type: 'Orthogonal',
    style: {
      strokeColor: '#424242',
      strokeWidth: 2
    },
    targetDecorator: {
      shape: 'Arrow',
      style: {
        fill: '#424242',
        strokeColor: '#424242'
      }
    }
  };

  // Add label if provided
  if (label) {
    connector.annotations = [
      {
        content: label,
        style: {
          fill: 'white',
          color: '#424242',
          fontSize: 12
        }
      }
    ];
  }

  // Add segments if provided
  if (segments && segments.length > 0) {
    connector.segments = segments;
  }

  return connector;
}

/**
 * Initial Nodes for CI/CD Pipeline
 */
export const initialNodes: NodeModel[] = [
  // Title Node (text shape)
  {
    id: 'TitleNode',
    offsetX: centerX,
    offsetY: 30,
    width: 250,
    height: 40,
    shape: {
      type: 'Text',
      content: 'CI / CD Pipeline'
    },
    style: {
      fontSize: 20,
      bold: true,
      fill: 'transparent',
      strokeColor: 'transparent',
      color: '#000000'
    },
    constraints: 0 // No selection, resize, etc.
  },

  // Flow Nodes
  createFlowNode('start', centerX, startY, 'Terminator', 'Start'),
  createFlowNode('commit', centerX, commitY, 'Process', 'Commit (VCS)'),
  createFlowNode('gate1', centerX, decisionY1, 'Decision', 'Tests pass?'),
  createFlowNode('build', rightX, decisionY1, 'Process', 'Build'),
  createFlowNode('report', leftX, testReportY, 'Document', 'Test Report'),
  createFlowNode('rate', centerX, rateY, 'Process', 'Rate-limit'),
  createFlowNode('gate2', centerX, decisionY2, 'Decision', 'Tests pass?'),
  createFlowNode('deployR', rightX, decisionY2, 'Process', 'Deploy'),
  createFlowNode('deploy', centerX, deployY, 'Process', 'Deploy'),
  createFlowNode('end', centerX, endY, 'Terminator', 'End')
];

/**
 * Initial Connectors for CI/CD Pipeline
 */
export const initialConnectors: ConnectorModel[] = [
  // Main flow
  createConnector('conn1', 'start', 'commit'),
  createConnector('conn2', 'commit', 'gate1'),

  // gate1 branches
  createConnector('conn3', 'gate1', 'build', 'No'),
  createConnector('conn4', 'gate1', 'report', 'Yes', [goLeft140]),

  // report → gate2 (loop)
  createConnector('conn5', 'report', 'gate2', undefined, [goDown100]),

  // center flow: gate1 → rate-limit → gate2
  createConnector('conn6', 'gate1', 'rate'),
  createConnector('conn7', 'rate', 'gate2'),

  // gate2 branches
  createConnector('conn8', 'gate2', 'deployR', 'No', [goRight150]),
  createConnector('conn9', 'gate2', 'deploy', 'Yes', [goDown75]),

  // Deploy center → End
  createConnector('conn10', 'deploy', 'end')
];
