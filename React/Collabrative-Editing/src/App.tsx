/**
 * Main App Component
 * Integrates all components: Toolbar, DiagramEditor, and SymbolPalette
 * Provides the main layout for the collaborative diagram editor
 */

import { useRef, useState, useEffect } from 'react';
import { DiagramEditor, DiagramEditorRef, historyChange } from './components/DiagramEditor';
import { Toolbar } from './components/Toolbar';
import { AdvancedSymbolPalette as SymbolPalette } from './components/AdvancedSymbolPalette';
import { PropertyPanel } from './components/PropertyPanel';
import { type NodeModel, type ConnectorModel, NodeConstraints, ConnectorConstraints, Connector } from '@syncfusion/ej2-react-diagrams';
import type { ToolbarAction, NodeProperties, ConnectorProperties, SelectedItem } from './types/diagramTypes';
import { ConnectorPropertyPanel } from './components/ConnectorPropertyPanel';
import './App.css';
// Selection type for property panel
type SelectionType = 'none' | 'node' | 'connector' | 'annotation' | 'multiple';

interface SelectionState {
  type: SelectionType;
  element: NodeModel | ConnectorModel | null;
  count: number;
}

function App() {
  const diagramRef = useRef<DiagramEditorRef>(null);
  const [selectedNode, setSelectedNode] = useState<NodeModel | null>(null);
  const [selectedConnector, setSelectedConnector] = useState<ConnectorModel | null>(null);

  // Enhanced selection state for dynamic property panel updates
  const [selectionState, setSelectionState] = useState<SelectionState>({
    type: 'none',
    element: null,
    count: 0
  });

  // Annotation selection state
  const [annotationInfo, setAnnotationInfo] = useState<{ node: NodeModel | null; index: number | null }>({ node: null, index: null });

  // Toolbar state
  const [toolbarState, setToolbarState] = useState({
    isUndoEnabled: false,
    isRedoEnabled: false,
    isCutEnabled: false,
    isCopyEnabled: false,
    isPasteEnabled: true,
    isGroupEnabled: true
  });

  /**
   * Handle toolbar actions
   */
  const handleToolbarAction = (action: ToolbarAction) => {
    const diagram = diagramRef.current;
    if (!diagram) return;
    //let action = action.toLowerCase();
    switch (action) {
      case 'new':
        historyChange();
        diagram.clearDiagram();
        // Reset toolbar state
        setToolbarState({
          isUndoEnabled: false,
          isRedoEnabled: false,
          isCutEnabled: false,
          isCopyEnabled: false,
          isPasteEnabled: true,
          isGroupEnabled: true
        });
        break;

      case 'open':
        handleOpenDiagram();
        break;

      case 'save':
        handleSaveDiagram();
        break;

      case 'print':
        btnPrintClick();
        break;

      case 'cut':
        diagram.cut();
        break;

      case 'copy':
        diagram.copy();
  
        break;

      case 'paste':
        diagram.paste();
        break;

      case 'select':
        diagram.setDrawingTool('Default');
        break;

      case 'text':
        diagram.setDrawingTool('Text');
        break;

      case 'undo':
        diagram.undo();
        updateToolbarState();
        break;

      case 'redo':
        diagram.redo();
        updateToolbarState();
        break;

      case 'pan':
        diagram.setDrawingTool('Pan');
        break;

      case 'pointer':
        diagram.setDrawingTool('Default');
        break;

      case 'zoomIn':
        diagram.zoomIn();
        break;

      case 'zoomOut':
        diagram.zoomOut();
        break;

      case 'fitToPage':
        diagram.fitToPage();
        break;

      default:

    }
  };

  /**
   * Handle export actions
   */
  const handleExport = (format: any) => {
    const diagram = diagramRef.current;
    if (!diagram) return;

    diagram.exportDiagram(format);
  };

  /**
   * Handle draw shape actions
   */
  const handleDrawShape = (shape: 'Rectangle' | 'Ellipse' | 'Polygon') => {
    const diagram = diagramRef.current;
    if (!diagram) return;

    diagram.drawShape(shape);
  };

  /**
   * Handle draw connector actions
   */
  const handleDrawConnector = (type: 'Straight' | 'Orthogonal' | 'Bezier') => {
    const diagram = diagramRef.current;
    if (!diagram) return;

    diagram.drawConnector(type);
  };

  /**
   * Handle group actions
   */
  const handleGroupAction = (action: 'Group' | 'Ungroup') => {
    const diagram = diagramRef.current;
    if (!diagram) return;

    if (action === 'Group') {
      diagram.group();
    } else {
      diagram.ungroup();
    }
    updateToolbarState();
  };

  /**
   * Update toolbar state based on diagram selection and history
   */
  const updateToolbarState = () => {
    const diagram = diagramRef.current;
    if (!diagram) return;

    const selectionCount = diagram.getSelectionCount();
    const canUndo = diagram.canUndo();
    const canRedo = diagram.canRedo();

    setToolbarState({
      isUndoEnabled: canUndo,
      isRedoEnabled: canRedo,
      isCutEnabled: selectionCount > 0,
      isCopyEnabled: selectionCount > 0,
      isPasteEnabled: true,
      isGroupEnabled: selectionCount >= 2  // Enable when 2+ items selected for grouping
    });
  };

  /**
   * Handle opening a diagram from file
   */
  const handleOpenDiagram = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = event.target?.result as string;
            if (diagramRef.current && data) {
              // Validate JSON before loading
              JSON.parse(data);
              diagramRef.current.loadDiagram(data);
              // Update toolbar state after loading
              setTimeout(() => updateToolbarState(), 100);
            }
          } catch (error) {
          
          }
        };

        reader.readAsText(file);
      }
    };
    input.click();
  };

  /**
   * Handle saving diagram to file
   * Note: The actual download is handled in DiagramEditor.saveDiagram()
   */
  const handleSaveDiagram = () => {
    if (diagramRef.current) {
      // DiagramEditor.saveDiagram() already handles the download
      diagramRef.current.saveDiagram();
    }
  };

  /**
   * Enhanced selection change handler - detects element type and updates property panel
   * This creates a dynamic, event-driven property panel that automatically refreshes
   */
  const handleSelectionChange = (selected?: SelectedItem | null) => {
    // If caller provided selection info (DiagramEditor), use it
    if (selected) {
      switch (selected.type) {
        case 'node':
          setSelectedNode(selected.node as NodeModel);
          enableItems()
          setSelectedConnector(null);
          setSelectionState({ type: 'node', element: selected.node as NodeModel, count: 1 });

          break;
        case 'connector':
          setSelectedNode(null);
          setSelectionState({ type: 'connector', element: selected.connector as ConnectorModel, count: 1 });
          setSelectedConnector(selected.connector as ConnectorModel);
          break;
        case 'annotation':
          // Find the node and set annotation info
          const diag = diagramRef.current?.getDiagram();
          const node = diag?.getObject((selected as any).nodeId) as NodeModel | undefined;
          setSelectedNode(node ?? null);
          setSelectedConnector(null);
          setSelectionState({ type: 'annotation', element: node ?? null, count: 1 });
          setAnnotationInfo({ node: node ?? null, index: (selected as any).annotationIndex ?? 0 });
          break;
        case 'multiple':
          setSelectedNode(null);
          setSelectedConnector(null);
          setSelectionState({ type: 'multiple', element: null, count: ((selected as any).nodes?.length || 0) + ((selected as any).connectors?.length || 0) });
          setAnnotationInfo({ node: null, index: null });
          break;
        default:
          setSelectedNode(null);
          setSelectedConnector(null);
          setSelectionState({ type: 'none', element: null, count: 0 });
          setAnnotationInfo({ node: null, index: null });
      }
      updateToolbarState();
      return;
    }

    // Fallback: read current diagram selection (used during polling or initial sync)
    const diagram = diagramRef.current?.getDiagram();
    if (!diagram || !diagram.selectedItems) {
      setSelectedNode(null);
      setSelectedConnector(null);
      setAnnotationInfo({ node: null, index: null });
      setSelectionState({ type: 'none', element: null, count: 0 });
      updateToolbarState();
      return;
    }

    const selectedNodes = diagram.selectedItems.nodes || [];
    const selectedConnectors = diagram.selectedItems.connectors || [];
    const totalSelected = selectedNodes.length + selectedConnectors.length;

    if (totalSelected > 1) {
      setSelectionState({ type: 'multiple', element: null, count: totalSelected });
      setSelectedNode(null);
      setSelectedConnector(null);
      setAnnotationInfo({ node: null, index: null });
      updateToolbarState();
      return;
    }

    if (selectedNodes.length === 1) {
      const selectedNode = selectedNodes[0] as NodeModel;
      setSelectedNode(selectedNode);
      setSelectedConnector(null);
      setSelectionState({ type: 'node', element: selectedNode, count: 1 });
      setAnnotationInfo({ node: null, index: null });
      updateToolbarState();
      return;
    }

    if (selectedConnectors.length === 1) {
      const selectedConnector = selectedConnectors[0] as ConnectorModel;
      setSelectedNode(null);
      setSelectedConnector(null);
      setSelectionState({ type: 'connector', element: selectedConnector, count: 1 });
      setAnnotationInfo({ node: null, index: null });
      updateToolbarState();
      return;
    }

    setSelectedNode(null);
    setSelectedConnector(null);
    setSelectionState({ type: 'none', element: null, count: 0 });
    setAnnotationInfo({ node: null, index: null });
    updateToolbarState();
  };

  /**
   * Monitor diagram selection changes in real-time
   * This ensures property panel stays in sync with diagram interactions
   */
  useEffect(() => {
    const diagram = diagramRef.current?.getDiagram();
    if (diagram) {
      // Force an initial update to sync state
      const checkSelection = () => {
        const selectedNodes = diagram.selectedItems?.nodes || [];
        const selectedConnectors = diagram.selectedItems?.connectors || [];

        if (selectedNodes.length === 1) {
          const node = selectedNodes[0] as NodeModel;
          setSelectedNode(node);
          setSelectionState({ type: 'node', element: node, count: 1 });
        } else if (selectedConnectors.length === 1) {
          const connector = selectedConnectors[0] as ConnectorModel;
          setSelectedNode(null);
          setSelectionState({ type: 'connector', element: connector, count: 1 });
        }
      };

      // Check selection periodically to catch any missed updates
      const interval = setInterval(checkSelection, 500);
      return () => clearInterval(interval);
    }
  }, []);
  // Function to handle the print button click and initiate the print process.
  const btnPrintClick = () => {
    const diagram = diagramRef.current?.getDiagram();
    if (diagram) {
      diagram.print({
        "region": 'Content',
      });
    }
  }
  const handleTextEditEvent = (args: any) => {
    // args.annotation and args.element are provided by DiagramComponent
    if (args && args.annotation && args.element) {
      const node = args.element as NodeModel;
      let annIndex = 0;
      if (node.annotations) {
        annIndex = node.annotations.findIndex((a: any) => a.content === args.annotation.content);
        if (annIndex < 0) annIndex = 0;
      }
      setAnnotationInfo({ node, index: annIndex });
    }
  };

  /**
   * Handle property changes from PropertyPanel
   */
  const handlePropertyChange = (properties: Partial<NodeProperties>) => {
    if (diagramRef.current) {
      diagramRef.current.updateNodeProperties(properties);
    }
  };

  /**
 * Handle property changes from ConnectorPropertyPanel
 */
  const handleConnectorPropertyChange = (properties: Partial<ConnectorProperties>) => {
    if (diagramRef.current) {
      diagramRef.current.updateConnectorProperties(properties);
    }
  };

  const getSelectedItemForPanel = (): SelectedItem => {
    if (selectionState.type === 'node' && selectedNode) {
      return { type: 'node', node: selectedNode } as any;
    }
    if (selectionState.type === 'connector' && selectionState.element) {
      return { type: 'connector', connector: selectionState.element as ConnectorModel } as any;
    }
    if (selectionState.type === 'annotation' && annotationInfo.node && annotationInfo.index !== null) {
      const node = annotationInfo.node as NodeModel;
      const annotation = node.annotations?.[annotationInfo.index as number] ?? null;
      return { type: 'annotation', nodeId: node.id as string, annotationIndex: annotationInfo.index as number, annotation } as any;
    }
    if (selectionState.type === 'multiple') {
      const diag = diagramRef.current?.getDiagram();
      const nodes = (diag?.selectedItems?.nodes ?? []) as NodeModel[];
      const connectors = (diag?.selectedItems?.connectors ?? []) as ConnectorModel[];
      return { type: 'multiple', nodes, connectors } as any;
    }
    return null;
  };

  const selectedItemForPanel = getSelectedItemForPanel();

  return (
    <div className="app-container">
      {/* Top Toolbar */}
      <div className="toolbar-region">
        <Toolbar
          onAction={handleToolbarAction}
          onExport={handleExport}
          onDrawShape={handleDrawShape}
          onDrawConnector={handleDrawConnector}
          onGroupAction={handleGroupAction}
          isUndoEnabled={toolbarState.isUndoEnabled}
          isRedoEnabled={toolbarState.isRedoEnabled}
          isCutEnabled={toolbarState.isCutEnabled}
          isCopyEnabled={toolbarState.isCopyEnabled}
          isPasteEnabled={toolbarState.isPasteEnabled}
          isGroupEnabled={toolbarState.isGroupEnabled}
        />
      </div>

      {/* Main Content Area */}
      <div className="content-region">
        {/* Left: Symbol Palette */}
        <div className="symbol-palette-region">

          <SymbolPalette />
        </div>

        {/* Center: Diagram Canvas */}
        <div className="diagram-region">
          <DiagramEditor
            ref={diagramRef}
            
            onSelectionChange={handleSelectionChange}
            onTextEdit={handleTextEditEvent}
            onPositionChange={() => {
              // keep selectedNode in sync on drag
              const diag = diagramRef.current?.getDiagram();
              if (diag && diag.selectedItems && diag.selectedItems.nodes && diag.selectedItems.nodes.length > 0) {
                setSelectedNode(diag.selectedItems.nodes[0] as NodeModel);
              }
            }}
            onSizeChange={() => {
              const diag = diagramRef.current?.getDiagram();
              if (diag && diag.selectedItems && diag.selectedItems.nodes && diag.selectedItems.nodes.length > 0) {
                setSelectedNode(diag.selectedItems.nodes[0] as NodeModel);
              }
            }}
          />
        </div>

        {/* Right: Property Panel */}
        {/* Right: Property Panel - Only visible when node is selected */}
        {selectionState.type === 'node' && selectedItemForPanel && (
          <div className="property-panel-region">
            <PropertyPanel
              selectedItem={selectedItemForPanel}
              onPropertyChange={handlePropertyChange}
            />
          </div>
        )}

        {/* Right: Connector Property Panel - Only visible when connector is selected */}
        {selectionState.type === 'connector' && selectedConnector && (
          <div className="property-panel-region">
            <ConnectorPropertyPanel
              selectedConnector={{ type: 'connector', connector: selectedConnector }}
              onPropertyChange={handleConnectorPropertyChange}
            />
          </div>
        )}
      </div>

      {/* Bottom Promotional Banner */}
      <div className="bottom-banner">
        <div className="banner-content">
          <div className="banner-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
          </div>
          <div className="banner-text">
            <span className="banner-message">
              Want interactive diagramming in your app? <strong>Try our Diagram Component</strong> — build, connect, and customize!
            </span>
          </div>
          <div className="banner-actions">
            <button className="banner-btn banner-btn-primary">
              Start Free Trial →
            </button>
            <button className="banner-btn banner-btn-secondary">
              Request Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

 function enableItems() {
        let isSelectedItemLocked: boolean;
        const itemIds = ['cut', 'copy'];
        itemIds.forEach(itemId => {
          let toolbarRef = (document.getElementById('toolbarEditor') as any).ej2_instances[0]
            const item = toolbarRef.items.find((item: { id: string; }) => item.id === itemId);
            if (item) {
                if (!isSelectedItemLocked) {
                    item.disabled = false;
                }
                else {
                    item.disabled = true;
                }
            }
        });
    }

