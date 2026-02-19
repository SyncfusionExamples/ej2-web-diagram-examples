/**
 * DiagramEditor Component
 * Main diagram canvas with Syncfusion Diagram component
 * Handles diagram interactions and collaboration integration
 */

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import {
    DiagramComponent,
    Inject,
    UndoRedo,
    DiagramTools,
    NodeModel,
    ConnectorModel,
    ICollectionChangeEventArgs,
    ISelectionChangeEventArgs,
    ITextEditEventArgs,
    DiagramConstraints,
    IExportOptions,
    GridlinesModel, PrintAndExport, BpmnDiagrams,
    NodeConstraints
} from '@syncfusion/ej2-react-diagrams';
import { collaborationService } from '../collaboration/CollaborationService';
import type { ConnectorProperties, DiagramState, NodeProperties, SelectedItem } from '../types/diagramTypes';
import { initialNodes, initialConnectors } from '../data/initialDiagramData';


interface DiagramEditorProps {
    onSelectionChange?: (selected: SelectedItem) => void;
    onDiagramChange?: (state: DiagramState) => void;
    onTextEdit?: (args: ITextEditEventArgs) => void;
    onPositionChange?: (args: any) => void;
    onSizeChange?: (args: any) => void;
}



export interface DiagramEditorRef {
    getDiagram: () => DiagramComponent | null;
    clearDiagram: () => void;
    loadDiagram: (data: string) => void;
    saveDiagram: () => string;
    exportDiagram: (format: 'JPG' | 'PNG' | 'SVG') => void;
    print: () => void;
    updateNodeProperties: (properties: Partial<NodeProperties>) => void;
    updateConnectorProperties: (properties: Partial<ConnectorProperties>) => void;
    // New methods for toolbar functionality
    cut: () => void;
    copy: () => void;
    paste: () => void;
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
    setDrawingTool: (tool: 'Default' | 'Text' | 'Pan') => void;
    drawShape: (shape: 'Rectangle' | 'Ellipse' | 'Polygon') => void;
    drawConnector: (type: 'Straight' | 'Orthogonal' | 'Bezier') => void;
    group: () => void;
    ungroup: () => void;
    getSelectionCount: () => number;
    // Zoom operations
    zoomIn: () => void;
    zoomOut: () => void;
    fitToPage: () => void;
}
let interval: number[];
interval = [
    1, 9, 0.25, 9.75, 0.25,
    9.75, 0.25, 9.75, 0.25,
    9.75, 0.25, 9.75, 0.25,
    9.75, 0.25, 9.75, 0.25,
    9.75, 0.25, 9.75
];
let gridlines: GridlinesModel = {
    lineColor: "lightgray",
    lineIntervals: interval,
    snapIntervals: [20]
};
export const DiagramEditor = forwardRef<DiagramEditorRef, DiagramEditorProps>(
    ({ onSelectionChange, onDiagramChange, onTextEdit, onPositionChange, onSizeChange }, ref) => {
        const diagramRef = useRef<DiagramComponent>(null);
        const [isCollaborationActive, setIsCollaborationActive] = useState(false);
        const isLocalChange = useRef(false);
        const isInitialized = useRef(false);

        useImperativeHandle(ref, () => ({
            getDiagram: () => diagramRef.current,
            clearDiagram: handleClearDiagram,
            loadDiagram: handleLoadDiagram,
            saveDiagram: handleSaveDiagram,
            exportDiagram: handleExportDiagram,
            print: handlePrint,
            updateNodeProperties: handleUpdateNodeProperties,
            updateConnectorProperties: handleConnectorPropertyChange,
            // Clipboard operations
            cut: () => diagramRef.current?.cut(),
            copy: () => diagramRef.current?.copy(),
            paste: () => diagramRef.current?.paste(),
            // History operations
            undo: () => diagramRef.current?.undo(),
            redo: () => diagramRef.current?.redo(),
            canUndo: () => diagramRef.current?.historyManager?.canUndo ?? false,
            canRedo: () => diagramRef.current?.historyManager?.canRedo ?? false,
            // Tool selection
            setDrawingTool: (tool) => {
                if (!diagramRef.current) return;
                if (tool === 'Default') {
                    diagramRef.current.tool = DiagramTools.Default;
                } else if (tool === 'Text') {
                    diagramRef.current.tool = DiagramTools.DrawOnce;
                    diagramRef.current.drawingObject = { shape: { type: 'Text' } };
                } else if (tool === 'Pan') {
                    diagramRef.current.tool = DiagramTools.ZoomPan;
                }
            },
            // Shape drawing
            drawShape: (shape) => {
                if (!diagramRef.current) return;
                diagramRef.current.tool = DiagramTools.ContinuousDraw;
                diagramRef.current.drawingObject = {
                    shape: {
                        type: 'Basic',
                        shape: shape
                    }
                };
            },
            // Connector drawing
            drawConnector: (type) => {
                if (!diagramRef.current) return;
                diagramRef.current.tool = DiagramTools.ContinuousDraw;
                const connector: ConnectorModel = {
                    id: `connector_${Date.now()}`,
                    type: type
                };
                diagramRef.current.drawingObject = connector;
            },
            // Group operations
            group: () => diagramRef.current?.group(),
            ungroup: () => diagramRef.current?.unGroup(),
            getSelectionCount: () => {
                if (!diagramRef.current) return 0;
                const selectedNodes = diagramRef.current.selectedItems?.nodes?.length ?? 0;
                const selectedConnectors = diagramRef.current.selectedItems?.connectors?.length ?? 0;
                return selectedNodes + selectedConnectors;
            },
            // Zoom operations
            zoomIn: () => {
                if (!diagramRef.current) return;
                diagramRef.current.zoomTo({ type: 'ZoomIn', zoomFactor: 0.2 });
            },
            zoomOut: () => {
                if (!diagramRef.current) return;
                diagramRef.current.zoomTo({ type: 'ZoomOut', zoomFactor: 0.2 });
            },
            fitToPage: () => {
                if (!diagramRef.current) return;
                diagramRef.current.fitToPage({
                    mode: 'Page',
                    region: 'Content'
                });
            }
        }));

        // Initialize collaboration on mount
        useEffect(() => {
            const initCollaboration = async () => {
                try {
                    await collaborationService.connect();
                    setIsCollaborationActive(true);

                    // Subscribe to incoming diagram updates
                    const unsubscribe = collaborationService.onMessage((message) => {
                        if (message.type === 'DIAGRAM_UPDATE') {
                            // Apply updates from other clients
                            applyRemoteUpdate(message.payload.state);
                        } else if (message.type === 'STATE_SYNC') {
                            // Server sent its current state
                            if (message.payload.state.nodes && message.payload.state.nodes.length > 0) {
                                // Server has data, use it
                                applyRemoteUpdate(message.payload.state);
                                isInitialized.current = true;
                            } else {
                                // Server has no data, load initial diagram
                                loadInitialDiagram();
                            }
                        }
                    });

                    return () => {
                        unsubscribe();
                        collaborationService.disconnect();
                    };
                } catch (error) {

                    setIsCollaborationActive(false);
                    // Load initial diagram even if collaboration fails
                    loadInitialDiagram();
                }
            };

            initCollaboration();
        }, []);

        /**
         * Load the initial CI/CD Pipeline diagram
         */
        const loadInitialDiagram = () => {
            if (!diagramRef.current || isInitialized.current) return;

            isLocalChange.current = true;

            try {
                // Add initial nodes
                initialNodes.forEach(node => {
                    diagramRef.current?.add(node);
                });

                // Add initial connectors
                initialConnectors.forEach(connector => {
                    diagramRef.current?.add(connector);
                });

                isInitialized.current = true;

                // Center the diagram in the viewport
               
                    if (diagramRef.current) {
                        diagramRef.current.fitToPage();
                    }
                    
        
            
            } catch (error) {

                isLocalChange.current = false;
            }
        };

        /**
         * Apply remote diagram update from other clients
         */
        const applyRemoteUpdate = (state: DiagramState) => {
            if (!diagramRef.current) return;

            isLocalChange.current = true;

            try {
                // Load the updated diagram state
                diagramRef.current.loadDiagram(JSON.stringify(state));
            } catch (error) {

            } finally {
                isLocalChange.current = false;
            }
        };

        /**
         * Broadcast local changes to other clients
         */
        const broadcastChanges = () => {
            if (!diagramRef.current || isLocalChange.current || !isCollaborationActive) {
                return;
            }

            const state: DiagramState = {
                nodes: diagramRef.current.nodes as NodeModel[],
                connectors: diagramRef.current.connectors as ConnectorModel[],
                timestamp: Date.now()
            };

            collaborationService.sendDiagramUpdate(state);
            onDiagramChange?.(state);
        };

        /**
         * Handle collection change events (nodes/connectors added, removed, modified)
         */
        const handleCollectionChange = () => {
            broadcastChanges();
        };

        /**
         * Handle selection change events
         */
        const handleSelectionChange = (args: ISelectionChangeEventArgs) => {
            try {
                const values = Array.isArray(args.newValue) ? args.newValue : (args.newValue ? [args.newValue] : []);

                if (values.length === 0) {
                    onSelectionChange?.(null);
                    return;
                }

                if (values.length > 1) {
                    const nodes = values.filter((v: any) => v && v.offsetX !== undefined) as NodeModel[];
                    const connectors = values.filter((v: any) => v && (v.sourceID !== undefined || v.targetID !== undefined)) as any[];
                    const multiple = { type: 'multiple', nodes, connectors } as import('../types/diagramTypes').SelectedMultipleItem;
                    onSelectionChange?.(multiple);
                    return;
                }

                const item = values[0] as any;
                // Node detection: nodes have offsetX property
                if (item && item.offsetX !== undefined) {
                    const sel = { type: 'node', node: item } as import('../types/diagramTypes').SelectedNodeItem;
                    onSelectionChange?.(sel);
                    return;
                }

                // Connector detection: connectors commonly have sourceID/targetID
                if (item && (item.sourceID !== undefined || item.targetID !== undefined || item.sourcePoint !== undefined)) {
                    const sel = { type: 'connector', connector: item } as import('../types/diagramTypes').SelectedConnectorItem;
                    onSelectionChange?.(sel);
                    return;
                }

                // Fallback to null
                onSelectionChange?.(null);
            } catch (ex) {

                onSelectionChange?.(null);
            }
        };

        /**
         * Clear the diagram
         */
        const handleClearDiagram = () => {
            if (diagramRef.current) {
                diagramRef.current.clear();
                broadcastChanges();
            }
        };

        /**
         * Load diagram from JSON
         */
        const handleLoadDiagram = (data: string) => {
            if (diagramRef.current) {
                try {
                    isLocalChange.current = true;

                    // Clear existing diagram first
                    diagramRef.current.clear();

                    // Load the new diagram
                    diagramRef.current.loadDiagram(data);

                    isLocalChange.current = false;

                    // Broadcast the loaded diagram to other clients
                    setTimeout(() => {
                        broadcastChanges();
                    }, 100);
                } catch (error) {

                    isLocalChange.current = false;
                }
            }
        };

        /**
         * Save diagram as JSON
         */
        const handleSaveDiagram = (): string => {
            if (diagramRef.current) {
                try {
                    // Save the diagram as JSON string
                    const json = diagramRef.current.saveDiagram();

                    // Download the JSON file with the name "flowchart.json"
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'flowchart.json'; // Set filename like in Blazor
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);

                    return json;
                } catch (error) {

                    return '{}';
                }
            }
            return '{}';
        };

        /**
         * Export diagram to image format
         */
        const handleExportDiagram = (format: 'JPG' | 'PNG' | 'SVG') => {
            if (!diagramRef.current) return;

            const options: IExportOptions = {
                format,
                mode: 'Download',
                region: 'Content',
                fileName: `Diagram`
            };

            diagramRef.current.exportDiagram(options);
        };

        /**
         * Print the diagram
         */
        const handlePrint = () => {
            if (diagramRef.current) {
                const printOptions = {
                    region: 'Content',
                    fileName: `Diagram`
                } as any;
                diagramRef.current.print(printOptions);
            }
        };

        /**
         * Update properties of selected node
         */
        const handleUpdateNodeProperties = (properties: Partial<NodeProperties>) => {
            if (!diagramRef.current) return;

            const selectedItems = diagramRef.current.selectedItems;
            if (selectedItems.nodes && selectedItems.nodes.length > 0) {
                const node = selectedItems.nodes[0] as NodeModel;

                // Update node properties
                if (properties.offsetX !== undefined) node.offsetX = properties.offsetX;
                if (properties.offsetY !== undefined) node.offsetY = properties.offsetY;
                if (properties.width !== undefined) node.width = properties.width;
                if (properties.height !== undefined) node.height = properties.height;
                if (properties.aspectRatio !== undefined) {
                    var isAspect: boolean = true;
                    let aspectRatioBtn: any = (document.getElementById('aspectRatioBtn') as any).ej2_instances[0];
                    if (node.constraints & NodeConstraints.AspectRatio) {
                        aspectRatioBtn.iconCss = 'sf-icon-lock';
                        document.getElementById('aspectRatioBtn').classList.add('e-active');
                    } else {
                        aspectRatioBtn.iconCss = 'sf-icon-unlock';
                        document.getElementById('aspectRatioBtn').classList.remove('e-active');
                    }
                    if ((document.getElementById('aspectRatioBtn') as HTMLElement).classList.contains('e-active')) {
                        isAspect = true;
                        aspectRatioBtn.iconCss = 'sf-icon-lock'
                    }
                    else {
                        isAspect = false;
                        aspectRatioBtn.iconCss = 'sf-icon-unlock';
                    }
                    node.constraints = properties.constraints ^ NodeConstraints.AspectRatio;
                }

                // Update style properties
                if (properties.fillColor !== undefined || properties.strokeColor !== undefined ||
                    properties.strokeWidth !== undefined || properties.opacity !== undefined ||
                    properties.borderDashArray !== undefined) {
                    node.style = {
                        ...node.style,
                        fill: properties.fillColor ?? node.style?.fill,
                        strokeColor: properties.strokeColor ?? node.style?.strokeColor,
                        strokeWidth: properties.strokeWidth ?? node.style?.strokeWidth,
                        opacity: properties.opacity ?? node.style?.opacity,
                        strokeDashArray: properties.borderDashArray ?? node.style?.strokeDashArray
                    };
                }

                // Update text annotations - use direct property mutation for Syncfusion compatibility
                if (properties.text !== undefined || properties.fontSize !== undefined ||
                    properties.fontFamily !== undefined || properties.fontColor !== undefined ||
                    properties.textAlign !== undefined || properties.bold !== undefined ||
                    properties.italic !== undefined || properties.textOpacity !== undefined ||
                    properties.underline !== undefined) {
                    if (node.annotations && node.annotations.length > 0) {
                        // Allow callers to pass `annotationIndex` to target a specific annotation; default to 0
                        const annIndex = (properties as any).annotationIndex ?? 0;
                        const idx = Math.max(0, Math.min(annIndex, node.annotations.length - 1));
                        const annotation = node.annotations[idx];

                        // Ensure style object exists
                        if (!annotation.style) {
                            annotation.style = {};
                        }

                        // Update annotation content directly
                        if (properties.text !== undefined) {
                            annotation.content = properties.text;
                        }

                        // Update style properties directly (better for Syncfusion change detection)
                        if (properties.fontSize !== undefined) {
                            annotation.style.fontSize = properties.fontSize;
                        }
                        if (properties.fontFamily !== undefined) {
                            annotation.style.fontFamily = properties.fontFamily;
                        }
                        if (properties.fontColor !== undefined) {
                            annotation.style.color = properties.fontColor;
                        }
                        if (properties.textAlign !== undefined) {
                            annotation.style.textAlign = properties.textAlign;
                        }
                        if (properties.bold !== undefined) {
                            annotation.style.bold = properties.bold;
                        }
                        if (properties.italic !== undefined) {
                            annotation.style.italic = properties.italic;
                        }
                        if (properties.underline !== undefined) {
                            annotation.style.textDecoration = properties.underline ? 'Underline' : 'None';
                        }
                        if (properties.textOpacity !== undefined) {
                            annotation.style.opacity = properties.textOpacity / 100;
                        }

                    }
                }

                // Update the diagram
                diagramRef.current.dataBind();
                //diagramRef.current.refresh();
                broadcastChanges();
            }
        };
        /**
        * Update properties of selected connector
        */
        const handleConnectorPropertyChange = (properties: Partial<ConnectorProperties>) => {
            if (!diagramRef.current) return;

            const selectedItems = diagramRef.current.selectedItems;
            if (selectedItems.connectors && selectedItems.connectors.length > 0) {
                const connector = selectedItems.connectors[0] as ConnectorModel;

                // Update connector type
                if (properties.connectorType !== undefined) connector.type = properties.connectorType as any;

                // Update connector style properties
                if (properties.strokeColor !== undefined || properties.strokeWidth !== undefined || properties.strokeDashArray !== undefined || properties.opacity !== undefined) {
                    connector.style = {
                        ...connector.style,
                        strokeColor: properties.strokeColor ?? connector.style?.strokeColor,
                        strokeWidth: properties.strokeWidth ?? connector.style?.strokeWidth,
                        strokeDashArray: properties.strokeDashArray ?? connector.style?.strokeDashArray,
                        opacity: properties.opacity ?? connector.style?.opacity
                    };
                }

                // Update source decorator
                if (properties.sourceDecorator !== undefined || properties.startArrowSize !== undefined) {
                    connector.sourceDecorator = {
                        ...connector.sourceDecorator,
                        shape: properties.sourceDecorator ?? connector.sourceDecorator?.shape,
                        width: properties.startArrowSize ?? connector.sourceDecorator?.width
                    };
                }

                // Update target decorator
                if (properties.targetDecorator !== undefined || properties.endArrowSize !== undefined) {
                    connector.targetDecorator = {
                        ...connector.targetDecorator,
                        shape: properties.targetDecorator ?? connector.targetDecorator?.shape,
                        width: properties.endArrowSize ?? connector.targetDecorator?.width
                    };
                }

                // Update bridging
                if (properties.bridging !== undefined) {
                    connector.bridgeSpace = properties.bridging ? 10 : 0;
                }

                // Update annotation properties (text, font, colors, formatting)
                if (properties.text !== undefined || properties.fontSize !== undefined ||
                    properties.fontFamily !== undefined || properties.fontColor !== undefined ||
                    properties.textAlign !== undefined || properties.bold !== undefined ||
                    properties.italic !== undefined || properties.underline !== undefined ||
                    properties.textOpacity !== undefined) {

                    if (connector.annotations && connector.annotations.length > 0) {
                        // Update first annotation
                        const annotation = connector.annotations[0];

                        // Ensure style object exists
                        if (!annotation.style) {
                            annotation.style = {};
                        }

                        // Update annotation content
                        if (properties.text !== undefined) {
                            annotation.content = properties.text;
                        }

                        // Update style properties
                        if (properties.fontSize !== undefined) {
                            annotation.style.fontSize = properties.fontSize;
                        }
                        if (properties.fontFamily !== undefined) {
                            annotation.style.fontFamily = properties.fontFamily;
                        }
                        if (properties.fontColor !== undefined) {
                            annotation.style.color = properties.fontColor;
                        }
                        if (properties.textAlign !== undefined) {
                            annotation.style.textAlign = properties.textAlign;
                        }
                        if (properties.bold !== undefined) {
                            annotation.style.bold = properties.bold;
                        }
                        if (properties.italic !== undefined) {
                            annotation.style.italic = properties.italic;
                        }
                        if (properties.underline !== undefined) {
                            annotation.style.textDecoration = properties.underline ? 'Underline' : 'None';
                        }
                        if (properties.textOpacity !== undefined) {
                            annotation.style.opacity = properties.textOpacity;
                        }
                    }
                }

                diagramRef.current.dataBind();
                broadcastChanges();
            }
        };
        return (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* Collaboration status indicator */}


                <DiagramComponent
                    id="diagram"
                    ref={diagramRef}
                    width="100%"
                    height="100%"
                    constraints={
                        DiagramConstraints.Default |
                        DiagramConstraints.Bridging |
                        DiagramConstraints.UndoRedo
                    }
                    tool={DiagramTools.Default}
                    snapSettings={{
                        constraints: 1 | 2 | 4, // SnapToLines | SnapToObject | SnapToGrid
                        horizontalGridlines: gridlines,
                        verticalGridlines: gridlines
                    }}
                    scrollSettings={{
                        scrollLimit: 'Infinity',
                        canAutoScroll: true
                    }}
                    getNodeDefaults={(node: NodeModel) => {
                        // Special handling for TitleNode - make it transparent
                        if (node.id === 'TitleNode') {
                            node.width = 250,
                                node.style = {
                                    fill: 'transparent',
                                    strokeColor: 'transparent',
                                    strokeWidth: 0
                                };
                        } else if (node.shape?.type === 'Flow') {
                            // Blue styling for flow shapes
                            // node.height = 100;
                            node.width = 145;
                            node.style = {
                                fill: '#357BD2',
                                strokeColor: '#357BD2',
                                strokeWidth: 1
                            };
                            node.annotations = node.annotations || [{
                                style: {
                                    color: 'white',
                                    fill: 'transparent',
                                    fontSize: 14,
                                    bold: false
                                }
                            }];
                        }
                        return node;
                    }}
                    getConnectorDefaults={(connector: ConnectorModel) => {
                        connector.style = {
                            strokeColor: '#424242',
                            strokeWidth: 2
                        };
                        connector.targetDecorator = {
                            shape: 'Arrow',
                            style: {
                                fill: '#000000ff',
                                strokeColor: '#0f0f0fff'
                            }
                        };
                        return connector;
                    }}
                    historyChange={(args) => {
                        historyChange();
                    }}
                    collectionChange={handleCollectionChange}
                    selectionChange={handleSelectionChange}
                    textEdit={(args: ITextEditEventArgs) => {
                        if (onTextEdit) onTextEdit(args);
                        try {
                            // args.element is the node being edited, args.annotation is the annotation
                            if (args && (args as any).element && (args as any).annotation) {
                                const node = (args as any).element as NodeModel;
                                const annotation = (args as any).annotation;
                                const index = node.annotations ? node.annotations.findIndex((a: any) => a === annotation) : 0;
                                const sel = { type: 'annotation', nodeId: node.id as string, annotationIndex: Math.max(0, index), annotation } as import('../types/diagramTypes').SelectedAnnotationItem;
                                onSelectionChange?.(sel);
                            }
                        } catch (ex) {
                            // ignore
                        }
                    }}
                    positionChange={(args: any) => {
                        if (onPositionChange) onPositionChange(args);
                        // local broadcast so others see the move
                        broadcastChanges();
                    }}
                    sizeChange={(args: any) => {
                        if (onSizeChange) onSizeChange(args);
                        broadcastChanges();
                    }}
                >
                    <Inject services={[UndoRedo, PrintAndExport, BpmnDiagrams]} />
                </DiagramComponent>
            </div>
        );
    }
);

DiagramEditor.displayName = 'DiagramEditor';
export function historyChange() {
    let toolbarEditor = (document.getElementById('toolbarEditor') as any).ej2_instances[0]
    let diagram = (document.getElementById('diagram') as any).ej2_instances[0]
    const undoItem = toolbarEditor.items.find((item: { id: string; }) => item.id === 'undo');
    if (undoItem) {
        undoItem.disabled = diagram.historyManager.undoStack.length > 0 ? false : true;
    }
    const redoItem = toolbarEditor.items.find((item: { id: string; }) => item.id === 'redo');
    if (redoItem) {
        redoItem.disabled = diagram.historyManager.redoStack.length > 0 ? false : true;
    }
}