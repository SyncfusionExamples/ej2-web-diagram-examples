/**
 * SymbolPalette Component
 * Provides drag-and-drop shapes for the diagram
 */

import { useRef } from 'react';
import {
  SymbolPaletteComponent,
  NodeModel,
  ConnectorModel,
  SymbolInfo
} from '@syncfusion/ej2-react-diagrams';
// import { expandMode } from '@syncfusion/ej2-navigations';
// SymbolPaletteComponent.Inject(BpmnDiagrams);
export const SymbolPalette = () => {
  const paletteRef = useRef<SymbolPaletteComponent>(null);
  // const moreShapesClick = () => {

  // }
  // Define Flow Shapes - white/transparent fill with outlines in palette
  const flowShapes: NodeModel[] = [
    {
      id: 'Terminator',
      shape: { type: 'Flow', shape: 'Terminator' },

    },
    {
      id: 'Process',
      shape: { type: 'Flow', shape: 'Process' },

    },
    {
      id: 'Decision',
      shape: { type: 'Flow', shape: 'Decision' },

    },
    {
      id: 'Document',
      shape: { type: 'Flow', shape: 'Document' },

    },
    {
      id: 'PreDefinedProcess',
      shape: { type: 'Flow', shape: 'PreDefinedProcess' },

    },
    {
      id: 'Data',
      shape: { type: 'Flow', shape: 'Data' },

    },
    {
      id: 'DirectData',
      shape: { type: 'Flow', shape: 'DirectData' },

    },
    {
      id: 'Sort',
      shape: { type: 'Flow', shape: 'Sort' },

    },
    {
      id: 'MultiDocument',
      shape: { type: 'Flow', shape: 'MultiDocument' },

    },
    {
      id: 'Collate',
      shape: { type: 'Flow', shape: 'Collate' },

    },
    {
      id: 'Card',
      shape: { type: 'Flow', shape: 'Card' },

    },
    {
      id: 'Or',
      shape: { type: 'Flow', shape: 'Or' },

    }
  ];

  // Define Basic Shapes - white/transparent fill with outlines in palette
  const basicShapes: NodeModel[] = [
    {
      id: 'Rectangle',
      shape: { type: 'Basic', shape: 'Rectangle' },

    },
    {
      id: 'Ellipse',
      shape: { type: 'Basic', shape: 'Ellipse' },

    },
    {
      id: 'Triangle',
      shape: { type: 'Basic', shape: 'Triangle' },

    },
    {
      id: 'Hexagon',
      shape: { type: 'Basic', shape: 'Hexagon' },

    },
    {
      id: 'Pentagon',
      shape: { type: 'Basic', shape: 'Pentagon' },

    },
    {
      id: 'Cylinder',
      shape: { type: 'Basic', shape: 'Cylinder' },

    },
    {
      id: 'Plus',
      shape: { type: 'Basic', shape: 'Plus' },

    },
    {
      id: 'Star',
      shape: { type: 'Basic', shape: 'Star' },

    }
  ];

  // Define Connectors
  const connectors: ConnectorModel[] = [
    {
      id: 'Link1',
      type: 'Orthogonal',
      sourcePoint: { x: 0, y: 0 },
      targetPoint: { x: 50, y: 50 },


    },
    {
      id: 'Link2',
      type: 'Straight',
      sourcePoint: { x: 0, y: 0 },
      targetPoint: { x: 50, y: 50 },


    },
    {
      id: 'Link3',
      type: 'Bezier',
      sourcePoint: { x: 0, y: 0 },
      targetPoint: { x: 50, y: 50 },


    },
    {
      id: 'Link4',
      type: 'Orthogonal',
      sourcePoint: { x: 0, y: 0 },
      targetPoint: { x: 50, y: 50 },
      targetDecorator: { shape: 'None' },

    }
  ];

  // Define palettes
  const palettes = [
    {
      id: 'flow',
      expanded: true,
      symbols: flowShapes,
      title: 'Flow Shapes',
       iconCss: "e-diagram-icons1 e-diagram-flow",
    },
    {
      id: 'basic',
      expanded: false,
      symbols: basicShapes,
      title: 'Basic Shapes',
      iconCss: 'e-icons e-rectangle'
    },
    {
      id: 'connectors',
      expanded: false,
      symbols: connectors,
      title: 'Connectors',
      iconCss: "e-diagram-icons1 e-diagram-connector",
    }
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa', borderRight: '1px solid #e0e0e0' }}>
      <SymbolPaletteComponent
        id="symbolpalette"
        ref={paletteRef}
        expandMode="Multiple"
        palettes={palettes}
        width="100%"
        height="calc(100% - 30px)"
        symbolHeight={50}
        symbolWidth={50}
        symbolMargin={{ left: 8, right: 8, top: 8, bottom: 8 }}
        enableSearch={false}
        getNodeDefaults={(symbol: NodeModel): NodeModel => {
          // Apply white fill with dark outline for all shapes in palette
          symbol.width = 80;
          symbol.height = 80;
          symbol.style = {
            fill: 'white',
            strokeColor: '#0f0f0fff',
            strokeWidth: 2
          };
          return symbol;
        }}
        getConnectorDefaults={(symbol: ConnectorModel): ConnectorModel => {
          // Apply dark outline for all connectors in palette
          symbol.style = {
            strokeColor: '#0f0f0fff',
            strokeWidth: 2
          };
          symbol.targetDecorator = symbol.targetDecorator || {
            shape: 'Arrow',
            style: {
              fill: '#000000f1',
              strokeColor: '#070707ff'
            }
          };
          return symbol;
        }}
        getSymbolInfo={(): SymbolInfo => {
          return {
            fit: true
          };
        }}>
      </SymbolPaletteComponent>
    </div>
  );
};
