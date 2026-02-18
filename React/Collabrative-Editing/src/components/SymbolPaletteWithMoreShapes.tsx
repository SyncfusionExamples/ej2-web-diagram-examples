/**
 * Enhanced SymbolPalette Component with "More Shapes" Feature
 * Provides drag-and-drop shapes for the diagram with dynamic palette selection
 * 
 * Features:
 * - Multiple shape palettes (Flow, Basic, BPMN, Connectors, etc.)
 * - "More Shapes" button to open palette selector dialog
 * - Dynamic add/remove palettes based on user selection
 * - Persistent palette selection using React state
 */

import { useRef, useState } from 'react';
import {
    SymbolPaletteComponent,
    NodeModel,
    ConnectorModel,
    SymbolInfo,
} from '@syncfusion/ej2-react-diagrams';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { CheckBoxComponent, ChangeEventArgs } from '@syncfusion/ej2-react-buttons';

// Palette option definition
interface PaletteOption {
    id: string;
    title: string;
    iconCss: string;
    enabled: boolean;
}

export const SymbolPalette = () => {
    const paletteRef = useRef<SymbolPaletteComponent>(null);
    const dialogRef = useRef<DialogComponent>(null);

    // State for More Shapes dialog
    const [isMoreShapesOpen, setIsMoreShapesOpen] = useState(false);

    // State for available palette options (all possible palettes)
    const [paletteOptions, setPaletteOptions] = useState<PaletteOption[]>([
        { id: 'Flow Shapes', title: 'Flow Shapes', iconCss: 'e-icons e-flow-chart', enabled: true },
        { id: 'Basic Shapes', title: 'Basic Shapes', iconCss: 'e-icons e-rectangle', enabled: false },
        { id: 'Connector Shapes', title: 'Connectors', iconCss: 'e-icons e-line', enabled: true },
        { id: 'BPMN Shapes', title: 'BPMN Shapes', iconCss: 'e-icons e-flow', enabled: false },
    ]);

    // ====== PALETTE DEFINITIONS ======

    // Flow Shapes
    const createFlowShapes = (): NodeModel[] => [
        { id: 'Terminator', shape: { type: 'Flow', shape: 'Terminator' } },
        { id: 'Process', shape: { type: 'Flow', shape: 'Process' } },
        { id: 'Decision', shape: { type: 'Flow', shape: 'Decision' } },
        { id: 'Document', shape: { type: 'Flow', shape: 'Document' } },
        { id: 'PreDefinedProcess', shape: { type: 'Flow', shape: 'PreDefinedProcess' } },
        { id: 'DirectData', shape: { type: 'Flow', shape: 'DirectData' } },
        { id: 'Sort', shape: { type: 'Flow', shape: 'Sort' } },
        { id: 'InternalStorage', shape: { type: 'Flow', shape: 'InternalStorage' } },
        { id: 'SequentialData', shape: { type: 'Flow', shape: 'SequentialData' } },
        { id: 'PaperTap', shape: { type: 'Flow', shape: 'PaperTap' } },
        { id: 'MultiDocument', shape: { type: 'Flow', shape: 'MultiDocument' } },
        { id: 'Collate', shape: { type: 'Flow', shape: 'Collate' } },
        { id: 'SummingJunction', shape: { type: 'Flow', shape: 'SummingJunction' } },
        { id: 'Or', shape: { type: 'Flow', shape: 'Or' } },
        { id: 'Extract', shape: { type: 'Flow', shape: 'Extract' } }
    ];

    // Basic Shapes
    const createBasicShapes = (): NodeModel[] => [
        { id: 'Rectangle', shape: { type: 'Basic', shape: 'Rectangle' } },
        { id: 'Ellipse', shape: { type: 'Basic', shape: 'Ellipse' } },
        { id: 'Hexagon', shape: { type: 'Basic', shape: 'Hexagon' } },
        { id: 'Parallelogram', shape: { type: 'Basic', shape: 'Parallelogram' } },
        { id: 'Triangle', shape: { type: 'Basic', shape: 'Triangle' } },
        { id: 'Plus', shape: { type: 'Basic', shape: 'Plus' } },
        { id: 'Star', shape: { type: 'Basic', shape: 'Star' } },
        { id: 'Pentagon', shape: { type: 'Basic', shape: 'Pentagon' } },
        { id: 'Heptagon', shape: { type: 'Basic', shape: 'Heptagon' } },
        { id: 'Octagon', shape: { type: 'Basic', shape: 'Octagon' } },
        { id: 'Trapezoid', shape: { type: 'Basic', shape: 'Trapezoid' } },
        { id: 'Decagon', shape: { type: 'Basic', shape: 'Decagon' } },
        { id: 'RightTriangle', shape: { type: 'Basic', shape: 'RightTriangle' } },
        { id: 'Cylinder', shape: { type: 'Basic', shape: 'Cylinder' } },
        { id: 'Diamond', shape: { type: 'Basic', shape: 'Diamond' } }
    ];

    // Connectors
    const createConnectors = (): ConnectorModel[] => [
        {
            id: 'OrthogonalWithArrow',
            type: 'Orthogonal',
            sourcePoint: { x: 0, y: 0 },
            targetPoint: { x: 60, y: 60 },
            targetDecorator: { shape: 'Arrow' },
            style: { strokeWidth: 2 }
        },
        {
            id: 'Orthogonal',
            type: 'Orthogonal',
            sourcePoint: { x: 0, y: 0 },
            targetPoint: { x: 60, y: 60 },
            targetDecorator: { shape: 'None' },
            style: { strokeWidth: 2 }
        },
        {
            id: 'StraightWithArrow',
            type: 'Straight',
            sourcePoint: { x: 0, y: 0 },
            targetPoint: { x: 60, y: 60 },
            targetDecorator: { shape: 'Arrow' },
            style: { strokeWidth: 2 }
        },
        {
            id: 'Straight',
            type: 'Straight',
            sourcePoint: { x: 0, y: 0 },
            targetPoint: { x: 60, y: 60 },
            targetDecorator: { shape: 'None' },
            style: { strokeWidth: 2 }
        },
        {
            id: 'BezierWithArrow',
            type: 'Bezier',
            sourcePoint: { x: 0, y: 0 },
            targetPoint: { x: 60, y: 60 },
            targetDecorator: { shape: 'Arrow' },
            style: { strokeWidth: 2 }
        }
    ];

    // BPMN Shapes
    const createBPMNShapes = (): (NodeModel | ConnectorModel)[] => {
        const shapes: (NodeModel | ConnectorModel)[] = [];

        // BPMN Nodes
        shapes.push({
            id: 'Task',
            width: 80,
            height: 60,
            shape: { type: 'Bpmn', shape: 'Activity', activity: { activity: 'Task' } }
        });

        shapes.push({
            id: 'Gateway',
            width: 70,
            height: 70,
            shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'None' } }
        });

        shapes.push({
            id: 'StartEvent',
            width: 50,
            height: 50,
            shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Start', trigger: 'None' } }
        });

        shapes.push({
            id: 'IntermediateEvent',
            width: 50,
            height: 50,
            shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Intermediate', trigger: 'None' } }
        });

        shapes.push({
            id: 'EndEvent',
            width: 50,
            height: 50,
            shape: { type: 'Bpmn', shape: 'Event', event: { event: 'End', trigger: 'None' } }
        });

        shapes.push({
            id: 'DataObject',
            width: 50,
            height: 65,
            shape: { type: 'Bpmn', shape: 'DataObject', dataObject: { collection: false, type: 'None' } }
        });

        shapes.push({
            id: 'DataStore',
            width: 80,
            height: 60,
            shape: { type: 'Bpmn', shape: 'DataSource' }
        });

        shapes.push({
            id: 'Message',
            width: 70,
            height: 50,
            shape: { type: 'Bpmn', shape: 'Message' }
        });

        shapes.push({
            id: 'CollapsedSubProcess',
            width: 80,
            height: 60,
            shape: { type: 'Bpmn', shape: 'Activity', activity: { activity: 'SubProcess', subProcess: { collapsed: true } } }
        });

        shapes.push({
            id: 'TextAnnotation',
            width: 80,
            height: 60,
            shape: { type: 'Bpmn', shape: 'TextAnnotation' }
        });

        // BPMN Connectors
        shapes.push({
            id: 'SequenceFlow',
            type: 'Straight',
            sourcePoint: { x: 0, y: 0 },
            targetPoint: { x: 60, y: 60 },
            shape: { type: 'Bpmn', flow: 'Sequence' } as any,
            style: { strokeWidth: 2 }
        });

        shapes.push({
            id: 'Association',
            type: 'Straight',
            sourcePoint: { x: 0, y: 0 },
            targetPoint: { x: 60, y: 60 },
            shape: { type: 'Bpmn', flow: 'Association' } as any,
            style: { strokeWidth: 2, strokeDashArray: '5 5' }
        });

        shapes.push({
            id: 'MessageFlow',
            type: 'Straight',
            sourcePoint: { x: 0, y: 0 },
            targetPoint: { x: 60, y: 60 },
            shape: { type: 'Bpmn', flow: 'Message' } as any,
            style: { strokeWidth: 2, strokeDashArray: '5 5' },
            targetDecorator: { shape: 'Arrow', style: { fill: 'white', strokeColor: 'black' } }
        });

        return shapes;
    };

    // ====== GENERATE PALETTES BASED ON SELECTION ======

    const getActivePalettes = () => {
        const palettes: any[] = [];

        paletteOptions.forEach(option => {
            if (option.enabled) {
                switch (option.id) {
                    case 'Flow Shapes':
                        palettes.push({
                            id: 'flow',
                            expanded: true,
                            symbols: createFlowShapes(),
                            title: 'Flow Shapes',
                            iconCss: 'e-icons e-flow-chart'
                        });
                        break;
                    case 'Basic Shapes':
                        palettes.push({
                            id: 'basic',
                            expanded: true,
                            symbols: createBasicShapes(),
                            title: 'Basic Shapes',
                            iconCss: 'e-icons e-rectangle'
                        });
                        break;
                    case 'Connector Shapes':
                        palettes.push({
                            id: 'connectors',
                            expanded: true,
                            symbols: createConnectors(),
                            title: 'Connectors',
                            iconCss: 'e-icons e-line'
                        });
                        break;
                    case 'BPMN Shapes':
                        palettes.push({
                            id: 'bpmn',
                            expanded: true,
                            symbols: createBPMNShapes(),
                            title: 'BPMN Shapes',
                            iconCss: 'e-icons e-flow'
                        });
                        break;
                }
            }
        });

        return palettes;
    };

    // ====== EVENT HANDLERS ======

    const handleMoreShapesClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsMoreShapesOpen(true);
    };

    const handleDialogClose = () => {
        setIsMoreShapesOpen(false);
    };

    const handleCheckboxChange = (paletteId: string, args: ChangeEventArgs) => {
        setPaletteOptions(prevOptions =>
            prevOptions.map(option =>
                option.id === paletteId
                    ? { ...option, enabled: args.checked ?? false }
                    : option
            )
        );
    };

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa', borderRight: '1px solid #e0e0e0' }}>
            {/* Symbol Palette */}
            <SymbolPaletteComponent
                id="symbolpalette"
                ref={paletteRef}
                expandMode="Multiple"
                palettes={getActivePalettes()}
                width="100%"
                height="calc(100% - 40px)"
                symbolHeight={60}
                symbolWidth={60}
                symbolMargin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                enableSearch={false}
                getNodeDefaults={(symbol: NodeModel): NodeModel => {
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
                    return { fit: true };
                }}
            />

            {/* More Shapes Button */}
            <div style={{
                height: '40px',
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
            }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                onClick={handleMoreShapesClick}
            >
                <a href="#" style={{
                    fontSize: '13px',
                    color: '#007bff',
                    textDecoration: 'none',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
                    onClick={handleMoreShapesClick}
                >
                    <span className="e-icons e-add-icon" style={{ fontSize: '14px' }}></span>
                    More Shapes
                </a>
            </div>

            {/* More Shapes Dialog */}
            <DialogComponent
                id="moreShapesDialog"
                ref={dialogRef}
                header="Select Shape Palettes"
                visible={isMoreShapesOpen}
                showCloseIcon={true}
                width="400px"
                height="auto"
                isModal={true}
                close={handleDialogClose}
                target="body"
                cssClass="more-shapes-dialog"
                animationSettings={{ effect: 'FadeZoom' }}
            >
                <div style={{ padding: '20px' }}>
                    <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
                        Select the shape palettes you want to display:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {paletteOptions.map(option => (
                            <div key={option.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '4px',
                                border: '1px solid #e0e0e0'
                            }}>
                                <CheckBoxComponent
                                    label={option.title}
                                    checked={option.enabled}
                                    change={(args) => handleCheckboxChange(option.id, args)}
                                    cssClass="e-custom-checkbox"
                                />
                                <span className={option.iconCss} style={{
                                    marginLeft: 'auto',
                                    fontSize: '18px',
                                    color: '#007bff'
                                }}></span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <button
                            className="e-btn e-primary"
                            onClick={handleDialogClose}
                            style={{
                                padding: '8px 24px',
                                fontSize: '14px',
                                fontWeight: 600,
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: '#007bff',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            Done
                        </button>
                    </div>
                </div>
            </DialogComponent>
        </div>
    );
};
