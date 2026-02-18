/**
 * PropertyPanel Component
 * Context-sensitive property editor for selected diagram elements
 */

import { useState, useEffect } from 'react';
import { NumericTextBoxComponent, SliderComponent } from '@syncfusion/ej2-react-inputs';
import { ColorPickerComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import type { NodeModel } from '@syncfusion/ej2-react-diagrams';
import type { NodeProperties, SelectedItem } from '../types/diagramTypes';

interface PropertyPanelProps {
  selectedItem: SelectedItem;
  onPropertyChange: (properties: Partial<NodeProperties>) => void;
}

// Helper function to determine gradient direction from gradient object
const getGradientDirection = (gradient: any): string => {
  if (!gradient || gradient.type !== 'Linear') return 'BottomToTop';
  const { x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = gradient;

  if (y1 === 0 && y2 === 0) {
    return (x1 === 100 && x2 === 0) ? 'LeftToRight' : 'RightToLeft';
  } else {
    return (y1 === 100 && y2 === 0) ? 'TopToBottom' : 'BottomToTop';
  }
};

export const PropertyPanel = ({ selectedItem, onPropertyChange }: PropertyPanelProps) => {
  const [properties, setProperties] = useState<NodeProperties | null>(null);
  const [showGradient, setShowGradient] = useState(false);

  useEffect(() => {
    // Build properties object depending on selected item type
    if (!selectedItem) {
      setProperties(null);
      setShowGradient(false);
      return;
    }

    if (selectedItem.type === 'node') {
      const selectedNode = selectedItem.node;
      const rawTextAlign = selectedNode.annotations?.[0]?.style?.textAlign;
      const textAlignValue =
        rawTextAlign === 'Left' || rawTextAlign === 'Center' || rawTextAlign === 'Right'
          ? rawTextAlign
          : 'Center';

      const gradient = (selectedNode.style as any)?.gradient;
      const isGradient = gradient && gradient.stops && gradient.stops.length > 1;

      const nodeProps: NodeProperties = {
        id: selectedNode.id || '',
        offsetX: (selectedNode.offsetX as number) || 0,
        offsetY: (selectedNode.offsetY as number) || 0,
        width: (selectedNode.width as number) || 100,
        height: (selectedNode.height as number) || 100,
        rotateAngle: (selectedNode.rotateAngle as number) || 0,
        aspectRatio: selectedNode.constraints ? ((selectedNode.constraints as any) & 0x00000020) !== 0 : false,
        fillColor: (selectedNode.style as any)?.fill || '#6BA5D7',
        isGradient: isGradient || false,
        gradientColor: isGradient ? gradient.stops[1].color : '#FFFFFF',
        gradientDirection: isGradient ? getGradientDirection(gradient) : 'BottomToTop',
        strokeColor: (selectedNode.style as any)?.strokeColor || '#6BA5D7',
        strokeWidth: (selectedNode.style as any)?.strokeWidth || 1,
        opacity: (selectedNode.style as any)?.opacity !== undefined ? (selectedNode.style as any).opacity : 1,
        borderDashArray: (selectedNode.style as any)?.strokeDashArray || '',
        text: selectedNode.annotations?.[0]?.content || '',
        fontSize: selectedNode.annotations?.[0]?.style?.fontSize || 12,
        fontFamily: selectedNode.annotations?.[0]?.style?.fontFamily || 'Arial',
        fontColor: selectedNode.annotations?.[0]?.style?.color || '#000000',
        textAlign: textAlignValue as NodeProperties['textAlign'],
        bold: selectedNode.annotations?.[0]?.style?.bold || false,
        italic: selectedNode.annotations?.[0]?.style?.italic || false,
        underline: selectedNode.annotations?.[0]?.style?.textDecoration === 'Underline'
      };
      setProperties(nodeProps);
      setShowGradient(isGradient || false);
      return;
    }

    if (selectedItem.type === 'connector') {
      const c = selectedItem.connector as any;
      const connProps: NodeProperties = {
        id: c.id || '',
        strokeColor: c.style?.strokeColor || '#424242',
        strokeWidth: c.style?.strokeWidth || 2,
        opacity: c.style?.opacity !== undefined ? c.style.opacity : 1
      } as NodeProperties;
      setProperties(connProps);
      setShowGradient(false);
      return;
    }

    if (selectedItem.type === 'annotation') {
      const ann = selectedItem.annotation as any;
      const annProps: NodeProperties = {
        id: selectedItem.nodeId || '',
        text: ann.content || '',
        fontSize: ann.style?.fontSize || 12,
        fontFamily: ann.style?.fontFamily || 'Arial',
        fontColor: ann.style?.color || '#000000',
        textAlign: ann.style?.textAlign || 'Center'
      } as NodeProperties;
      setProperties(annProps);
      setShowGradient(false);
      return;
    }

    // multiple selection or unknown
    setProperties(null);
    setShowGradient(false);
  }, [selectedItem]);

  const handlePropertyUpdate = (key: keyof NodeProperties, value: any) => {
    if (properties) {
      const updatedProps = { ...properties, [key]: value };
      setProperties(updatedProps);
      onPropertyChange({ [key]: value });
    }
  };

  const fontFamilies = [
    { text: 'Arial', value: 'Arial' },
    { text: 'Verdana', value: 'Verdana' },
    { text: 'Times New Roman', value: 'Times New Roman' },
    { text: 'Courier New', value: 'Courier New' },
    { text: 'Georgia', value: 'Georgia' },
    { text: 'Comic Sans MS', value: 'Comic Sans MS' }
  ];

  const borderTypes = [
    { text: 'Solid', value: '' },
    { text: 'Dashed', value: '5 5' },
    { text: 'Dotted', value: '2 2' }
  ];



  if (!properties) {
    const title = selectedItem ? (selectedItem.type === 'multiple' ? 'Multiple items selected' : selectedItem.type === 'annotation' ? 'Annotation selected' : (selectedItem.type === 'connector' ? 'Connector selected' : 'No selection')) : 'No selection';
    const sub = selectedItem ? (selectedItem.type === 'multiple' ? 'Select a single item to edit its properties' : selectedItem.type === 'annotation' ? 'Edit the annotation text by selecting it or using the text editor' : selectedItem.type === 'connector' ? 'Select a connector to edit stroke and routing' : 'Select an item to edit its properties') : 'Select an item to edit its properties';

    return (
      <div style={styles.container}>
        <div style={styles.noSelection}>
          <h3 style={styles.noSelectionText}>{title}</h3>
          <p style={styles.noSelectionSubtext}>{sub}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.headerTitle}>Properties</h3>
      </div>

      <div style={styles.content}>
        {/* Dimensions - Matching Blazor Layout */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Dimensions</h4>
          {/* X and Y in first row */}
          <div style={styles.dimensionRow}>
            <div style={styles.dimensionItem}>
              <label style={styles.dimensionLabel}>X</label>
              <NumericTextBoxComponent
                value={properties.offsetX}
                format="n0"
                step={10}
                showSpinButton={true}
                change={(e) => handlePropertyUpdate('offsetX', e.value)}
                width="100%"
              />
            </div>
            <div style={styles.dimensionItem}>
              <label style={styles.dimensionLabel}>Y</label>
              <NumericTextBoxComponent
                value={properties.offsetY}
                format="n0"
                step={10}
                showSpinButton={true}
                change={(e) => handlePropertyUpdate('offsetY', e.value)}
                width="100%"
              />
            </div>
          </div>
          {/* W, H, and Aspect Ratio button in second row */}
          <div style={styles.dimensionRow}>
            <div style={styles.dimensionItem}>
              <label style={styles.dimensionLabel}>W</label>
              <NumericTextBoxComponent
                value={properties.width}
                format="n0"
                min={10}
                step={10}
                showSpinButton={true}
                change={(e) => handlePropertyUpdate('width', e.value)}
                width="100%"
              />
            </div>
            <div style={styles.dimensionItem}>
              <label style={styles.dimensionLabel}>H</label>
              <NumericTextBoxComponent
                value={properties.height}
                format="n0"
                min={10}
                step={10}
                showSpinButton={true}
                change={(e) => handlePropertyUpdate('height', e.value)}
                width="100%"
              />
            </div>
            <div style={styles.aspectRatioContainer}>
              <ButtonComponent
                cssClass={properties.aspectRatio ? 'e-flat' : 'e-flat'}
                iconCss={properties.aspectRatio ? 'e-icons e-lock' : 'e-icons e-unlock'}
                title={properties.aspectRatio ? 'Disable Aspect Ratio' : 'Enable Aspect Ratio'}
                onClick={() => handlePropertyUpdate('aspectRatio', !properties.aspectRatio)}
              />
            </div>
          </div>
          {/* R (Rotation) in third row */}
          <div style={styles.dimensionRow}>
            <div style={{ ...styles.dimensionItem, flex: '0 0 48%' }}>
              <label style={styles.dimensionLabel}>R</label>
              <NumericTextBoxComponent
                value={properties.rotateAngle}
                format="n0"
                min={0}
                max={360}
                step={15}
                showSpinButton={true}
                change={(e) => handlePropertyUpdate('rotateAngle', e.value)}
                width="100%"
              />
            </div>
          </div>
        </div>

        {/* Insert Section */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Insert</h4>
          <ButtonComponent
            cssClass="e-outline"
            content="Insert Link"
            iconCss="e-icons e-link"
            style={{ width: '100%' }}
          />
        </div>

        {/* Background Section */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Background Type</h4>
          <div style={styles.row}>
            <div style={styles.comboRow}>
              <DropDownListComponent
                dataSource={['Solid', 'Gradient']}
                value={properties.isGradient ? 'Gradient' : 'Solid'}
                change={(e) => {
                  const isGrad = e.value === 'Gradient';
                  setShowGradient(isGrad);
                  handlePropertyUpdate('isGradient', isGrad);
                }}
                width="60%"
              />
              <ColorPickerComponent
                value={properties.fillColor}
                change={(e) => handlePropertyUpdate('fillColor', e.currentValue.hex)}
                mode="Palette"
                showButtons={false}
                cssClass="inline-color-picker"
              />
            </div>
          </div>
          {/* Gradient Style Section - only shown when Gradient is selected */}
          {showGradient && (
            <div style={styles.gradientSection}>
              <h4 style={styles.sectionTitle}>Gradient Style</h4>
              <div style={styles.row}>
                <div style={styles.comboRow}>
                  <DropDownListComponent
                    dataSource={[
                      { text: 'Bottom to Top', value: 'BottomToTop' },
                      { text: 'Top to Bottom', value: 'TopToBottom' },
                      { text: 'Right to Left', value: 'RightToLeft' },
                      { text: 'Left to Right', value: 'LeftToRight' }
                    ]}
                    fields={{ text: 'text', value: 'value' }}
                    value={properties.gradientDirection}
                    change={(e) => handlePropertyUpdate('gradientDirection', e.value)}
                    width="60%"
                  />
                  <ColorPickerComponent
                    value={properties.gradientColor}
                    change={(e) => handlePropertyUpdate('gradientColor', e.currentValue.hex)}
                    mode="Palette"
                    showButtons={false}
                    cssClass="inline-color-picker"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Border Section */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Border Type</h4>
          <div style={styles.row}>
            <div style={styles.comboRow}>
              <DropDownListComponent
                dataSource={borderTypes}
                fields={{ text: 'text', value: 'value' }}
                value={properties.borderDashArray}
                change={(e) => handlePropertyUpdate('borderDashArray', e.value)}
                width="60%"
              />
              <ColorPickerComponent
                value={properties.strokeColor}
                change={(e) => handlePropertyUpdate('strokeColor', e.currentValue.hex)}
                mode="Palette"
                showButtons={false}
                cssClass="inline-color-picker"
              />
            </div>
          </div>
        </div>

        {/* Thickness Section */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Thickness</h4>
          <div style={styles.row}>
            <NumericTextBoxComponent
              value={properties.strokeWidth}
              format="n0"
              min={0}
              max={20}
              step={1}
              showSpinButton={true}
              change={(e) => handlePropertyUpdate('strokeWidth', e.value)}
              width="100%"
            />
          </div>
        </div>

        {/* Opacity Section */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Opacity</h4>
          <div style={styles.opacityRow}>
            <div style={{ flex: 1 }}>
              <SliderComponent
                value={(properties.opacity || 1) * 100}
                min={0}
                max={100}
                step={10}
                type="MinRange"
                showButtons={false}
                tooltip={{ isVisible: true, placement: 'Before', showOn: 'Hover' }}
                change={(e) => handlePropertyUpdate('opacity', (e.value || 100) / 100)}
                width="100%"
              />
            </div>
            <input
              type="text"
              value={Math.round((properties.opacity || 1) * 100)}
              readOnly
              style={styles.opacityText}
            />
          </div>
        </div>

        {/* Text Section */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Text</h4>
          {/* Row 1: Font dropdown and Size input */}
          <div style={styles.textRow}>
            <div style={{ flex: 1, marginRight: '5px' }}>
              <DropDownListComponent
                dataSource={fontFamilies}
                fields={{ text: 'text', value: 'value' }}
                value={properties.fontFamily|| 'Arial'}
                change={(e) => handlePropertyUpdate('fontFamily', e.value)}
                width="100%"
              />
            </div>
            <div style={{ width: '100px' }}>
              <NumericTextBoxComponent
                value={properties.fontSize}
                format="n2"
                min={8}
                max={72}
                step={2}
                showSpinButton={true}
                change={(e) => handlePropertyUpdate('fontSize', e.value)}
                width="100%"
              />
            </div>
          </div>
          {/* Row 2: Position dropdown and Color picker */}
          <div style={styles.textRow}>
            <div style={{ flex: 1, marginRight: '8px' }}>
              <DropDownListComponent
                dataSource={['Center', 'Top', 'Bottom', 'Left', 'Right']}
                value="Center"
                width="100%"
              />
            </div>
            <div>
              <ColorPickerComponent
                value={properties.fontColor}
                change={(e) => handlePropertyUpdate('fontColor', e.currentValue.hex)}
                mode="Palette"
                showButtons={false}
              />
            </div>
          </div>
          {/* Row 3: Format buttons (B, I, U) and Text Align buttons */}
          <div style={styles.textRow}>
            <div style={styles.buttonGroup}>
              <ButtonComponent
                cssClass={properties.bold ? 'e-flat e-small e-active' : 'e-flat e-small'}
                content="B"
                onClick={() => handlePropertyUpdate('bold', !properties.bold)}
                style={{ fontWeight: 'bold', minWidth: '32px' }}
              />
              <ButtonComponent
                cssClass={properties.italic ? 'e-flat e-small e-active' : 'e-flat e-small'}
                content="I"
                onClick={() => handlePropertyUpdate('italic', !properties.italic)}
                style={{ fontStyle: 'italic', minWidth: '32px' }}
              />
              <ButtonComponent
                cssClass={properties.underline ? 'e-flat e-small e-active' : 'e-flat e-small'}
                content="U"
                onClick={() => handlePropertyUpdate('underline', !properties.underline)}
                style={{ textDecoration: 'underline', minWidth: '32px' }}
              />
            </div>
            <div style={styles.buttonGroup}>
              <ButtonComponent
                cssClass={properties.textAlign === 'Left' ? 'e-flat e-small e-active' : 'e-flat e-small'}
                iconCss="e-icons e-align-left"
                onClick={() => handlePropertyUpdate('textAlign', 'Left')}
                style={{ minWidth: '32px' }}
              />
              <ButtonComponent
                cssClass={properties.textAlign === 'Center' ? 'e-flat e-small e-active' : 'e-flat e-small'}
                iconCss="e-icons e-align-center"
                onClick={() => handlePropertyUpdate('textAlign', 'Center')}
                style={{ minWidth: '32px' }}
              />
              <ButtonComponent
                cssClass={properties.textAlign === 'Right' ? 'e-flat e-small e-active' : 'e-flat e-small'}
                iconCss="e-icons e-align-right"
                onClick={() => handlePropertyUpdate('textAlign', 'Right')}
                style={{ minWidth: '32px' }}
              />
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.buttonGroup}>
              <ButtonComponent
                cssClass="e-flat e-small"
                iconCss="e-icons e-arrow-left"
                style={{ minWidth: '32px' }}
              />
              <ButtonComponent
                cssClass="e-flat e-small e-active"
                iconCss="e-icons e-align-justify"
                style={{ minWidth: '32px' }}
              />
              <ButtonComponent
                cssClass="e-flat e-small"
                iconCss="e-icons e-arrow-right"
                style={{ minWidth: '32px' }}
              />
            </div>
            <div style={styles.buttonGroup}>
              <ButtonComponent
                cssClass="e-flat e-small"
                iconCss="e-icons e-arrow-up"
                style={{ minWidth: '32px' }}
              />
              <ButtonComponent
                cssClass="e-flat e-small e-active"
                iconCss="e-icons e-sort-descending"
                style={{ minWidth: '32px' }}
              />
              <ButtonComponent
                cssClass="e-flat e-small"
                iconCss="e-icons e-arrow-down"
                style={{ minWidth: '32px' }}
              />
            </div>
          </div>
        </div>

        {/* Text Opacity Section */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Opacity</h4>
          <div style={styles.opacityRow}>
            <div style={{ flex: 1 }}>
              <SliderComponent
                value={100}
                min={0}
                max={100}
                step={10}
                type="MinRange"
                showButtons={false}
                tooltip={{ isVisible: true, placement: 'Before', showOn: 'Hover' }}
                change={(e) => handlePropertyUpdate('textOpacity', (e.value || 100) / 100)}
                width="100%"
              />
            </div>
            <input
              type="text"
              value={100}
              readOnly
              style={styles.opacityText}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    width: '350px',
    minWidth: '320px',
    height: '100%',
    backgroundColor: '#fff',
    borderLeft: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    position: 'relative' as const
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f5f5f5',
    flexShrink: 0
  },
  headerTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#333'
  },
  content: {
    flex: 1,
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    padding: '16px',
    paddingRight: '20px',
    minHeight: 0
  },
  section: {
    marginBottom: '10px'
  },
  sectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: 600,
    color: '#555',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '8px'
  },
  row: {
    marginBottom: '10px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#666'
  },
  textInput: {
    width: '100%',
    padding: '8px',
    fontSize: '13px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box' as const
  },
  buttonGroup: {
    display: 'flex',
    gap: '4px'
  },
  dimensionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '8px'
  },
  dimensionRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
    alignItems: 'flex-end'
  },
  dimensionItem: {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: '6px',
    flex: '1 1 0'
  },
  dimensionLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#666',
    minWidth: '12px'
  },
  aspectRatioContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    paddingBottom: '2px'
  },
  comboRow: {
    display: 'flex',
    gap: '3px',
    alignItems: 'center',
    paddingTop: '2px'
  },
  textRow: {
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
    marginBottom: '8px'
  },
  gradientSection: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #e0e0e0'
  },
  opacityRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  opacityText: {
    width: '50px',
    padding: '6px 8px',
    fontSize: '12px',
    border: '1px solid #ffffffff',
    textAlign: 'center' as const,
  },
  noSelection: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '20px',
    textAlign: 'center' as const
  },
  noSelectionText: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: 600,
    color: '#999'
  },
  noSelectionSubtext: {
    margin: 0,
    fontSize: '13px',
    color: '#bbb'
  }
};
