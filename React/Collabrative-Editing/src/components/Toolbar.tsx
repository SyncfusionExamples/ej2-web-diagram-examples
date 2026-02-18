/**
 * Toolbar Component - Reorganized into Two Sections
 * 
 * LAYOUT STRUCTURE:
 * 1. Banner Container (Top): Title + Guest Info + Branding
 * 2. Primary Toolbar (Below Banner): Main editing tools and actions
 * 
 * STYLE CLEANUP:
 * - Removed heavy shadows and excessive padding
 * - Simplified button styles for clean, flat appearance
 * - Consistent spacing and alignment throughout
 */

import { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  ToolbarComponent,
  ItemsDirective,
  ItemDirective
} from '@syncfusion/ej2-react-navigations';
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons';
import type { ClickEventArgs } from '@syncfusion/ej2-navigations';
import type { MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import type { ToolbarAction } from '../types/diagramTypes';
import { Connector, ConnectorConstraints, NodeConstraints, NodeModel } from '@syncfusion/ej2-react-diagrams';

interface ToolbarProps {
  onAction: (action: ToolbarAction) => void;
  onExport: (format: 'JPG' | 'PNG' | 'SVG') => void;
  onDrawShape: (shape: 'Rectangle' | 'Ellipse' | 'Polygon') => void;
  onDrawConnector: (type: 'Straight' | 'Orthogonal' | 'Bezier') => void;
  onGroupAction: (action: 'Group' | 'Ungroup') => void;
  availableGuests?: number;
  isUndoEnabled?: boolean;
  isRedoEnabled?: boolean;
  isCutEnabled?: boolean;
  isCopyEnabled?: boolean;
  isPasteEnabled?: boolean;
  isGroupEnabled?: boolean;
}

export const Toolbar = forwardRef<ToolbarComponent | null, ToolbarProps>(({
  onAction,
  onExport,
  onDrawShape,
  onDrawConnector,
  onGroupAction,
  availableGuests = 1,
  isUndoEnabled = false,
  isRedoEnabled = false,
  isCutEnabled = false,
  isCopyEnabled = false,
  isPasteEnabled = true,
  isGroupEnabled = false
}: ToolbarProps,
ref
) => {
  const toolbarRef = useRef<ToolbarComponent>(null);
useImperativeHandle(ref, () => toolbarRef.current as ToolbarComponent, []);
  const handleClick = (args: ClickEventArgs) => {
    const action = args.item.id as ToolbarAction;
    onAction(action);
  };

  // Dropdown menu items
  const exportItems = [
    { text: 'JPG' },
    { text: 'PNG' },
    { text: 'SVG' }
  ];

  const shapeItems = [
    { text: 'Rectangle', iconCss: 'e-rectangle e-icons' },
    { text: 'Ellipse', iconCss: ' e-circle e-icons' },
    { text: 'Polygon', iconCss: 'e-line e-icons' }
  ];

  const connectorItems = [
    { text: 'Straight', iconCss: 'e-icons e-line' },
    { text: 'Orthogonal', iconCss: 'sf-diagram-icon-orthogonal' },
    { text: 'Bezier', iconCss: 'sf-diagram-icon-bezier' }
  ];

  const groupItems = [
    { iconCss: 'e-icons e-group-1', text: 'Group' },
    { iconCss: 'e-icons e-ungroup-1', text: 'Ungroup' }
  ];

  const handleExportSelect = (args: MenuEventArgs) => {
    const exportOptions: any = {
      format: args.item.text,
      mode: 'Download',
      region: 'PageSettings',
      fileName: 'Export',
      margin: { left: 0, top: 0, bottom: 0, right: 0 }
    };
    onExport(exportOptions);
  };

  const handleShapeSelect = (args: MenuEventArgs) => {
    const shape = args.item.text as 'Rectangle' | 'Ellipse' | 'Polygon';
    onDrawShape(shape);
  };

  const handleConnectorSelect = (args: MenuEventArgs) => {
    const type = args.item.text as 'Straight' | 'Orthogonal' | 'Bezier';
    onDrawConnector(type);
  };

  const handleGroupSelect = (args: MenuEventArgs) => {
    const action = args.item.text as 'Group' | 'Ungroup';
    onGroupAction(action);
  };

  return (
    <>
      {/* ============================================
          CONTAINER 1: BANNER (Top Section)
          Contains: Title, Guest Counter, Branding
          ============================================ */}
      <div style={styles.bannerContainer}>
        <div style={styles.bannerLeft}>
          <h1 style={styles.title}>Live Diagram Collaboration</h1>
        </div>

        <div style={styles.bannerRight}>
          <div style={styles.guestCounter}>
            <span style={styles.guestLabel}>Available Guests:</span>
            <span style={styles.guestCount}>{availableGuests}</span>
          </div>
          <div style={styles.branding}>
            <span style={styles.brandIcon}>⚡</span>
            <span style={styles.poweredBy}>Powered by </span>
            <span style={styles.brandName}>Syncfusion Diagram Component</span>
          </div>
        </div>
      </div>

      {/* ============================================
          CONTAINER 2: PRIMARY TOOLBAR
          Contains: Main editing tools and actions
          Split into logical groups:
          - File ops (New, Open, Save, Print, Export)
          - Clipboard (Cut, Copy, Paste)
          - History (Undo, Redo)
          - Drawing (Shapes, Connectors, Group)
          - Tools (Pointer, Text, Pan)
          - View (Zoom controls)
          ============================================ */}
      <div style={styles.primaryToolbarContainer}>
        <ToolbarComponent
          id="toolbarEditor"
          ref={toolbarRef}
          clicked={handleClick}
          height={40}
          cssClass="clean-toolbar"
          statelessTemplates={['directiveTemplates']}
        >
          <ItemsDirective>
            {/* === File Operations Group === */}
            <ItemDirective
              id="new"
              prefixIcon="e-icons e-circle-add"
              tooltipText="New Diagram"
            />
            <ItemDirective
              id="open"
              prefixIcon="e-icons e-folder-open"
              tooltipText="Open Diagram"
            />
            <ItemDirective
              id="save"
              prefixIcon="e-icons e-save"
              tooltipText="Save Diagram"
            />
            <ItemDirective
              id="print"
              prefixIcon="e-icons e-print"
              tooltipText="Print"
            />
            <ItemDirective
              template={() => (
                <DropDownButtonComponent
                  items={exportItems}
                  iconCss="e-icons e-export"
                  cssClass="custom-export-dropdown"
                  select={handleExportSelect}
                />
              )}
            />
            <ItemDirective type="Separator" />

            {/* === Clipboard Group === */}
            <ItemDirective
              id="cut"
              prefixIcon="e-icons e-cut"
              tooltipText="Cut"
              disabled={!isCutEnabled}
            />
            <ItemDirective
              id="copy"
              prefixIcon="e-icons e-copy"
              tooltipText="Copy"
              disabled={!isCopyEnabled}
            />
            <ItemDirective
              id="paste"
              prefixIcon="e-icons e-paste"
              tooltipText="Paste"
              disabled={!isPasteEnabled}
            />
            <ItemDirective type="Separator" />

            {/* === History Group === */}
            <ItemDirective
              id="undo"
              prefixIcon="e-icons e-undo"
              tooltipText="Undo"
              disabled={!isUndoEnabled}
            />
            <ItemDirective
              id="redo"
              prefixIcon="e-icons e-redo"
              tooltipText="Redo"
              disabled={!isRedoEnabled}
            />
            <ItemDirective type="Separator" />

            {/* === Drawing Tools Group === */}
            <ItemDirective
              template={() => (
                <DropDownButtonComponent
                  items={shapeItems}
                  iconCss="e-shapes e-icons"
                  cssClass="tb-item-middle"
                  select={handleShapeSelect}
                />
              )}
            />
            <ItemDirective
              template={() => (
                <DropDownButtonComponent
                  items={connectorItems}
                  cssClass="tb-item-middle"
                  iconCss="e-diagram-icons1 e-diagram-connector e-icons"
                  select={handleConnectorSelect}
                />
              )}
            />
            <ItemDirective
              template={() => (
                <DropDownButtonComponent
                  items={groupItems}
                  iconCss="e-icons e-group-1"

                  select={handleGroupSelect}
                  disabled={!isGroupEnabled}
                />
              )}
            />
            <ItemDirective type="Separator" />

            {/* === Selection Tools Group === */}
            <ItemDirective
              id="pointer"
              prefixIcon="e-icons e-mouse-pointer"
              tooltipText="Pointer Tool"
            />
            <ItemDirective
              id="text"
              prefixIcon="e-icons e-caption"
              tooltipText="Text Tool"
            />
            <ItemDirective
              id="pan"
              prefixIcon="e-icons e-pan"
              tooltipText="Pan Tool"
            />
            <ItemDirective type="Separator" />

            {/* === View Controls Group === */}
            <ItemDirective
              id="zoomIn"
              prefixIcon="e-icons e-zoom-in"
              tooltipText="Zoom In"
            />
            <ItemDirective
              id="zoomOut"
              prefixIcon="e-icons e-zoom-out"
              tooltipText="Zoom Out"
            />
            <ItemDirective
              id="fitToPage"
              prefixIcon="e-icons e-zoom-to-fit"
              tooltipText="Fit to Page"
            />
          </ItemsDirective>
        </ToolbarComponent>
      </div>
    </>
  );
});

/* ============================================
   CLEANED UP STYLES
   
   STYLE CHANGES MADE:
   - Removed heavy box-shadow from banner
   - Reduced padding for cleaner look
   - Simplified border styling (single 1px borders)
   - Removed unnecessary background colors
   - Consistent spacing using gap instead of margins
   - Flat button appearance (handled by Syncfusion)
   ============================================ */

const styles = {
  // === BANNER CONTAINER (Top Section) ===
  bannerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0078d4', // Blue banner like reference
    color: '#ffffff',
    padding: '8px 16px',
    height: '48px',
    borderBottom: '1px solid #005a9e'
  } as React.CSSProperties,

  bannerLeft: {
    display: 'flex',
    alignItems: 'center'
  } as React.CSSProperties,

  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
    whiteSpace: 'nowrap' as const
  } as React.CSSProperties,

  bannerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  } as React.CSSProperties,

  guestCounter: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '3px',
    border: '1px solid rgba(255, 255, 255, 0.25)'
  } as React.CSSProperties,

  guestLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: 500
  } as React.CSSProperties,

  guestCount: {
    fontSize: '13px',
    color: '#ffffff',
    fontWeight: 700
  } as React.CSSProperties,

  branding: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    whiteSpace: 'nowrap' as const
  } as React.CSSProperties,

  brandIcon: {
    fontSize: '12px'
  } as React.CSSProperties,

  poweredBy: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: 400
  } as React.CSSProperties,

  brandName: {
    color: '#ffffff',
    fontWeight: 600
  } as React.CSSProperties,

  // === PRIMARY TOOLBAR CONTAINER ===
  primaryToolbarContainer: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center'
  } as React.CSSProperties
};
