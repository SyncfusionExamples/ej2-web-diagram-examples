// import { createRoot } from 'react-dom/client';
import * as React from "react";
import {
  DiagramComponent, SymbolPaletteComponent,
   Node, DiagramTools,
  BpmnDiagrams, UndoRedo, Inject,
} from "@syncfusion/ej2-react-diagrams";
import{ImportAndExportVisio}from "@syncfusion/ej2-diagrams";
// import { updateSampleSection } from "../common/sample-base";
// import "./font-icons.css";
import { ItemDirective, ItemsDirective, ToolbarComponent } from "@syncfusion/ej2-react-navigations";
import { DropDownButtonComponent } from "@syncfusion/ej2-react-splitbuttons";
import { UploaderComponent } from "@syncfusion/ej2-react-inputs";
import { ToastComponent } from '@syncfusion/ej2-react-notifications';

/**
 * Visio Import/Export
 */

// Helper method to create a process node
function createNode(id, content, offsetY, shape = 'Process',
  offsetX = 400, width = 100, height = 50, ports) {
  const node = {
    id,
    shape: { type: 'Flow', shape },
    style: { fill: '#357BD2', strokeColor: 'white' },
    annotations: [{ content, style: { color: 'white' } }],
    offsetX,
    offsetY,
    width,
    height,
    ...(ports && { ports }),
  };

  return node;
}

// Helper method to create a connector
function createConnector(id, sourceID, targetID,
  annotation, sourcePortID, targetPortID) {
  return {
    id,
    sourceID,
    targetID,
    type: 'Orthogonal',
    ...(annotation && {
      annotations: [{
        content: annotation,
        alignment: annotation === 'Yes' ? 'After' : 'Before',
        displacement: annotation === 'Yes' ? { x: 5, y: 0 } : { x: 5, y: 5 },
      }],
    }),
    ...(sourcePortID && { sourcePortID }),
    ...(targetPortID && { targetPortID }),
  };
}

// Define the nodes using helper method
const nodes = [
  createNode('start', 'Start', 80, 'Terminator'),
  createNode('draft', 'Draft', 180, 'Process', 400, 100, 50, [
      { id: 'rightport', offset: { x: 1, y: 0.5 } },
  ]),
  createNode('approvedDecision', 'Approved?', 280, 'Decision', 400, 120, 60),
  createNode('revise', 'Revise', 280, 'Process', 600, 100, 50, [
      { id: 'rightport', offset: { x: 1, y: 0.5 } },
  ]),
  createNode('copyedit', 'Copyedit', 400),
  createNode('proof', 'Proof', 500),
  createNode('finalrevise', 'Revise', 600),
  createNode('finalize', 'Finalize', 700),
  createNode('publish', 'Publish', 800, 'Terminator')
];

// Define the connectors using helper method
const connectors = [
  createConnector('connector1', 'start', 'draft'),
  createConnector('connector2', 'draft', 'approvedDecision'),
  createConnector('connector3', 'approvedDecision', 'copyedit', 'Yes'),
  createConnector('connector4', 'approvedDecision', 'revise', 'No'),
  createConnector('connector5', 'revise', 'draft', undefined, 'rightport', 'rightport'),
  createConnector('connector6', 'copyedit', 'proof'),
  createConnector('connector7', 'proof', 'finalrevise'),
  createConnector('connector8', 'finalrevise', 'finalize'),
  createConnector('connector9', 'finalize', 'publish'),
];

// Define the palette nodes for "Flow Shapes"
const flowShapes = [
  { id: 'Process', shape: { type: 'Flow', shape: 'Process' } },
  { id: 'Decision', shape: { type: 'Flow', shape: 'Decision' } },
  { id: 'Document', shape: { type: 'Flow', shape: 'Document' } },
  { id: 'Terminator', shape: { type: 'Flow', shape: 'Terminator' } },
  { id: 'PredefinedProcess', shape: { type: 'Flow', shape: 'PreDefinedProcess' } },
  { id: 'Data', shape: { type: 'Flow', shape: 'Data' } },
  { id: 'DirectData', shape: { type: 'Flow', shape: 'DirectData' } },
  { id: 'InternalStorage', shape: { type: 'Flow', shape: 'InternalStorage' } },
  { id: 'ManualInput', shape: { type: 'Flow', shape: 'ManualInput' } },
  { id: 'ManualOperation', shape: { type: 'Flow', shape: 'ManualOperation' } },
];

// Define the palette nodes for "Basic Shapes"
const basicShapes = [
  { id: 'Rectangle', shape: { type: 'Basic', shape: 'Rectangle' } },
  { id: 'Ellipse', shape: { type: 'Basic', shape: 'Ellipse' } },
  { id: 'Hexagon', shape: { type: 'Basic', shape: 'Hexagon' } },
  { id: 'Parallelogram', shape: { type: 'Basic', shape: 'Parallelogram' } },
  { id: 'Pentagon', shape: { type: 'Basic', shape: 'Pentagon' } },
  { id: 'Heptagon', shape: { type: 'Basic', shape: 'Heptagon' } },
  { id: 'Octagon', shape: { type: 'Basic', shape: 'Octagon' } },
  { id: 'Triangle', shape: { type: 'Basic', shape: 'Triangle' } },
  { id: 'Star', shape: { type: 'Basic', shape: 'Star' } },
  { id: 'Plus', shape: { type: 'Basic', shape: 'Plus' } },
];

// Define the palette connectors for "Connectors"
const paletteConnectors = [
  {
    id: 'Link1', type: 'Orthogonal',
    targetDecorator: { shape: 'Arrow', style: { strokeColor: '#757575', fill: '#757575' } },
  },
  {
    id: 'Link2', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 60, y: 60 },
    targetDecorator: { shape: 'None' }
  },
  {
    id: 'Link3', type: 'Straight', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 60, y: 60 },
    targetDecorator: { shape: 'Arrow', style: { strokeColor: '#757575', fill: '#757575' } },
  },
  {
    id: 'Link4', type: 'Straight', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 60, y: 60 },
    targetDecorator: { shape: 'None' }
  },
  {
    id: 'Link5', type: 'Bezier', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 60, y: 60 },
    targetDecorator: { shape: 'None' }
  },
];

let selectedItems;
let diagramInstance;
let toolbarEditor;
let toastInstance;

let connectorData = [
  { text: 'Straight', iconCss: 'e-icons e-line' },
  { text: 'Orthogonal', iconCss: 'sf-diagram-icon-orthogonal' },
  { text: 'Bezier', iconCss: 'sf-diagram-icon-bezier' }
]
let shapeData = [
  { text: 'Rectangle', iconCss: 'e-rectangle e-icons' },
  { text: 'Ellipse', iconCss: ' e-circle e-icons' },
]

function VisioImportExport() {
  const connector = () => {
    return (<div><DropDownButtonComponent
      items={connectorData}
      cssClass="tb-item-middle"
      iconCss="e-diagram-icons1 e-diagram-connector e-icons"

      select={onConnectorSelect}></DropDownButtonComponent ></div>);
  };
  const shapes = () => {
    return (<div><DropDownButtonComponent
      items={shapeData}
      cssClass="tb-item-middle"
      iconCss="e-shapes e-icons"
      select={onShapesSelect}></DropDownButtonComponent ></div>);
  };

  React.useEffect(() => {
    // updateSampleSection();
    rendereComplete();
  }, [])
  function rendereComplete() {
    addEvents();
    setCreated(true);
    diagramInstance.fitToPage();
  }

  //To handle toolbar click
  function toolbarClick(args) {
    let item = args.item.tooltipText;
    switch (item) {
      case 'Undo':
        diagramInstance.undo();
        break;
      case 'Redo':
        diagramInstance.redo();
        break;
      case 'Cut':
        diagramInstance.cut();
        updateToolbarItems(["Paste"], false);
        break;
      case 'Copy':
        diagramInstance.copy();
        updateToolbarItems(["Paste"], false);
        break;
      case 'Paste':
        diagramInstance.paste();
        break;
      case 'Delete':
        diagramInstance.remove();
        break;
      case 'New Diagram':
        diagramInstance.clear();
        historyChange();
        break;
      case 'Export as Visio (.vsdx)':
        diagramInstance.exportToVisio();
        break;
      case 'Import Visio (.vsdx)':
        document
          .getElementsByClassName('e-file-select-wrap')[0]
          .querySelector('button')
          .click();
        break;
    }
    diagramInstance.dataBind();
  }

  //To handle selection of drawing connectors.
  function onConnectorSelect(args) {
    diagramInstance.clearSelection();
    diagramInstance.drawingObject = { type: args.item.text } ;
    diagramInstance.tool = DiagramTools.DrawOnce;
    diagramInstance.dataBind();
  }

  //To handle selection of drawing shapes.
  function onShapesSelect(args) {
    diagramInstance.clearSelection();
    diagramInstance.drawingObject = {
      shape: { shape: args.item.text },
      style: { fill: '#357BD2', strokeColor: 'white' }
    };
    diagramInstance.tool = DiagramTools.DrawOnce;
    diagramInstance.dataBind();
  }



  // Enable or disable specific toolbar items
  function updateToolbarItems(itemIds, disabled) {
    itemIds.forEach((itemId) => {
      const item = toolbarEditor.items.find((item) => item.id === itemId);
      if (item) {
        item.disabled = disabled;
      }
    });
  }

  let isMobile;
  function addEvents() {
    isMobile = window.matchMedia('(max-width:550px)').matches;
    if (isMobile) {
      let paletteIcon = document.getElementById('palette-icon');
      if (paletteIcon) {
        paletteIcon.addEventListener('click', openPalette, false);
      }
    }
  }

  function openPalette() {
    let paletteSpace = document.getElementById('palette-space');
    isMobile = window.matchMedia('(max-width:550px)').matches;
    if (isMobile) {
      if (!paletteSpace.classList.contains('sb-mobile-palette-open')) {
        paletteSpace.classList.add('sb-mobile-palette-open');
      } else {
        paletteSpace.classList.remove('sb-mobile-palette-open');
      }
    }
  }

  let asyncSettings = {
    saveUrl: 'https://services.syncfusion.com/react/production/api/FileUploader/Save',
    removeUrl: 'https://services.syncfusion.com/react/production/api/FileUploader/Remove'
  };

  //set up uploaded file
  async function onUploadSuccess(args) {
    let fileObj = args.file;
    let rawFile = fileObj.rawFile ;
    await diagramInstance.importFromVisio(rawFile);
    diagramInstance.width = '100%';
    diagramInstance.height = '700px';
  }


  //To enable and disable undo/redo button.
  function historyChange() {
    updateToolbarItems(["Undo"], diagramInstance.historyManager.undoStack.length === 0);
    updateToolbarItems(["Redo"], diagramInstance.historyManager.redoStack.length === 0);
  }
  function diagramImporting(args) {
    toastInstance.timeOut = 0;
    toastInstance.showCloseButton = false;
    if (args.status === "started") {
      toastInstance.hide();
      toastInstance.timeOut = 1000;
      toastInstance.title = 'Importing Diagram';
      toastInstance.content = 'The Visio diagram is being imported. Please wait...';
      toastInstance.cssClass = 'e-toast-info';
      toastInstance.show();
    }
    else if (args.status === "completed") {
      toastInstance.showCloseButton = true;
      toastInstance.timeOut = 3000;
      toastInstance.title = 'Import Complete';
      toastInstance.content = 'The Visio diagram has been imported successfully.';
      toastInstance.cssClass = 'e-toast-success';
      toastInstance.show();
    }
    else if (args.status === "failed") {
      toastInstance.showCloseButton = true;
      toastInstance.timeOut = 3000;
      toastInstance.title = 'Import Failed';
      toastInstance.content = 'There was an error importing the Visio diagram.';
      toastInstance.cssClass = 'e-toast-danger';
      toastInstance.show();
    }
  }

  function diagramExporting(args) {
    toastInstance.timeOut = 0;
    toastInstance.showCloseButton = false;
    if (args.status === "started") {
      toastInstance.hide();
      toastInstance.timeOut = 1000;
      toastInstance.title = 'Exporting Diagram';
      toastInstance.content = 'The diagram is being exported to Visio format. Please wait...';
      toastInstance.cssClass = 'e-toast-info';
      toastInstance.show();
    }
    else if (args.status === "completed") {
      toastInstance.showCloseButton = true;
      toastInstance.timeOut = 3000;
      toastInstance.title = 'Export Complete';
      toastInstance.content = 'The diagram has been exported to Visio format successfully.';
      toastInstance.cssClass = 'e-toast-success';
      toastInstance.show();
    }
    else if (args.status === "failed") {
      toastInstance.showCloseButton = true;
      toastInstance.timeOut = 3000;
      toastInstance.title = 'Export Failed';
      toastInstance.content = 'There was an error exporting the diagram to Visio format.';
      toastInstance.cssClass = 'e-toast-danger';
      toastInstance.show();
    }
  }

  const [diagramCreated, setCreated] = React.useState(false);
  return (
    <div className="control-pane">
      <div className="control-section visio-import-container" style={{ width: "100%", opacity: diagramCreated ? 1 : 0 }}>
        <div style={{ display: 'none' }}>
          <UploaderComponent
            id="fileUpload"
            type="file"
            showFileList={false}
            asyncSettings={asyncSettings}
            success={onUploadSuccess}
            multiple={false}
            allowedExtensions={".vsdx"}
          ></UploaderComponent>
        </div>
        <div className="db-toolbar-container">
          <ToolbarComponent
            ref={(toolbar) => (toolbarEditor = toolbar)}
            id="toolbar_diagram"
            clicked={toolbarClick}
            overflowMode={'Scrollable'}
            width={'100%'}
          >
            <ItemsDirective>
              <ItemDirective prefixIcon='e-icons e-circle-add' tooltipText='New Diagram' align="Left" id="New_Diagram" />
              <ItemDirective prefixIcon='e-icons e-import' tooltipText='Import Visio (.vsdx)' align="Left" id="Import" />
              <ItemDirective prefixIcon='e-icons e-export' tooltipText='Export as Visio (.vsdx)' align="Left" id="Export" />
              <ItemDirective type='Separator' />
              <ItemDirective type="Input" tooltipText='Draw Connectors' align="Left" id="Draw_con" template={connector} />
              <ItemDirective type="Input" tooltipText='Draw Shapes' align="Left" id="Draw_shapes" template={shapes} />
              <ItemDirective type='Separator' />
              <ItemDirective disabled={true} prefixIcon='e-cut e-icons' tooltipText='Cut'
                cssClass='tb-item-middle tb-item-lock-category'
                align="Left" id="Cut" />
              <ItemDirective disabled={true} prefixIcon='e-copy e-icons' tooltipText='Copy'
                cssClass='tb-item-middle tb-item-lock-category'
                align="Left" id="Copy" />
              <ItemDirective disabled={true} prefixIcon='e-icons e-paste' tooltipText='Paste' cssClass='tb-item-middle tb-item-lock-category'
                align="Left" id="Paste" />
              <ItemDirective type='Separator' />
              <ItemDirective disabled={true} prefixIcon='e-icons e-undo' tooltipText='Undo'
                align="Left" id="Undo" />
              <ItemDirective disabled={true} prefixIcon='e-icons e-redo' tooltipText='Redo'
                align="Left" id="Redo" />
              <ItemDirective type='Separator' />
              <ItemDirective disabled={true} prefixIcon='e-trash e-icons' tooltipText='Delete'
                cssClass='tb-item-middle tb-item-lock-category'
                align="Left" id="Delete" />
            </ItemsDirective>
          </ToolbarComponent>
        </div>
        <div className="sb-mobile-palette-bar">
          <div id="palette-icon" style={{ float: "right" }} className="e-ddb-icons1 e-toggle-palette"></div>
        </div>
        <div
          id="palette-space" className="sb-mobile-palette"
        >
          <SymbolPaletteComponent
            id="symbolpalette"
            expandMode="Multiple"
            palettes={[
              {
                id: 'flowShapesPalette',
                expanded: true,
                symbols: flowShapes,
                title: 'Flow Shapes',
                iconCss: 'e-ddb-icons e-flow'
              },
              {
                id: 'basicShapesPalette',
                expanded: false,
                symbols: basicShapes,
                title: 'Basic Shapes',
                iconCss: 'e-ddb-icons e-basic'
              },
              {
                id: 'connectorsPalette',
                expanded: false,
                symbols: paletteConnectors,
                title: 'Connectors',
                iconCss: 'e-ddb-icons e-diagram-connector'
              },
            ]}
            width={"100%"}
            height={"700px"}
            symbolHeight={50}
            symbolWidth={50}
            symbolMargin={{ left: 15, right: 15, top: 15, bottom: 15 }}
            getNodeDefaults={(symbol) => {
              symbol.style = { fill: '#357BD2', strokeColor: 'white' };
              symbol.width = 40;
              symbol.height = 40;
            }}
            getConnectorDefaults={(connector) => {
              connector.sourcePoint = { x: 0, y: 0 };
              connector.targetPoint = { x: 60, y: 60 };
              connector.style = { strokeWidth: 1, strokeColor: '#757575' };
            }}

          />
        </div>
        <div
          id="diagram-space" className="sb-mobile-diagram"
        >
          <DiagramComponent
            id="diagram"
            ref={(diagram) => diagramInstance = diagram}
            width={"100%"}
            height={"700px"}
            nodes={nodes}
            connectors={connectors}
            // diagramImporting={diagramImporting}
            // diagramExporting={diagramExporting}
            historyChange={historyChange}
            selectionChange={(args) => {
              if (args.state === 'Changed') {
                selectedItems = diagramInstance.selectedItems.nodes;
                selectedItems = selectedItems.concat(
                  (diagramInstance.selectedItems ).connectors
                );

                if (selectedItems.length === 0) {
                  updateToolbarItems(['Cut', 'Copy', 'Delete'], true);
                }
                else {
                  updateToolbarItems(['Cut', 'Copy', 'Delete'], false);
                }
              }
            }}
            //Sets the Node style for DragEnter element.
            dragEnter={(args) => {
              let obj = args.element;
              if (obj instanceof Node) {
                let objWidth = obj.width;
                let objHeight = obj.height;
                // Define the target width and height
                const targetWidth = 100;
                const targetHeight = 50;
                // Calculate the difference in dimensions
                const deltaWidth = targetWidth - objWidth;
                const deltaHeight = targetHeight - objHeight;
                // Update the node's dimensions
                obj.width = targetWidth;
                obj.height = targetHeight;
                // Adjust the offset to center the node upon dragEnter
                obj.offsetX += deltaWidth / 2;
                obj.offsetY += deltaHeight / 2;
              }
            }}
          >
            <Inject services={[BpmnDiagrams, UndoRedo,ImportAndExportVisio]} />
          </DiagramComponent>
        </div>
        <ToastComponent
          ref={(toast) => toastInstance = toast}
          id="toast"
          position={{ X: "Right", Y: "Bottom" }}>
        </ToastComponent>
      </div>
  
    </div>
  );
}
export default VisioImportExport;

