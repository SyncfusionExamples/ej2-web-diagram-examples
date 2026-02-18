/**
 * ConnectorPropertyPanel Component
 * Context-sensitive property editor for selected diagram connectors
 * 
 * Features:
 * - Connector-level properties: type, stroke, thickness, bridging, opacity, decorators
 * - Annotation properties (conditionally shown only if annotations exist)
 * - Real-time two-way data binding with diagram
 */

import { useState, useEffect } from 'react';
import { NumericTextBoxComponent, SliderComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import type { ConnectorProperties, SelectedConnectorItem } from '../types/diagramTypes';

interface ConnectorPropertyPanelProps {
  selectedConnector: SelectedConnectorItem;
  onPropertyChange: (properties: Partial<ConnectorProperties>) => void;
}

export const ConnectorPropertyPanel = ({ selectedConnector, onPropertyChange }: ConnectorPropertyPanelProps) => {
  const [properties, setProperties] = useState<ConnectorProperties | null>(null);
  const [sourceDecoratorType, setSourceDecoratorType] = useState<string>('None');
  const [targetDecoratorType, setTargetDecoratorType] = useState<string>('Arrow');
  const [hasAnnotation, setHasAnnotation] = useState<boolean>(false);

  useEffect(() => {
    // Check if selected item is a connector
    if (!selectedConnector || selectedConnector.type !== 'connector') {
      setProperties(null);
      setHasAnnotation(false);
      return;
    }

    const connector = selectedConnector.connector as any;

    // Determine decorator types from decorator shape
    const sourceDecType = connector.sourceDecorator?.shape || 'None';
    const targetDecType = connector.targetDecorator?.shape || 'None';
    
    setSourceDecoratorType(sourceDecType);
    setTargetDecoratorType(targetDecType);

    // Check if connector has annotations
    const hasAnnotations = connector.annotations && connector.annotations.length > 0;
    setHasAnnotation(hasAnnotations);

    // Build connector properties from the connector object
    const connProps: ConnectorProperties = {
      id: connector.id || '',
      connectorType: connector.type || 'Straight',
      strokeColor: connector.style?.strokeColor || '#424242',
      strokeWidth: connector.style?.strokeWidth || 2,
      strokeDashArray: connector.style?.strokeDashArray || '',
      startArrowSize: connector.sourceDecorator?.width || 0,
      endArrowSize: connector.targetDecorator?.width || 10,
      bridging: connector.bridgeSpace !== undefined ? connector.bridgeSpace > 0 : false,
      opacity: connector.style?.opacity !== undefined ? connector.style.opacity : 1,
      text: connector.annotations?.[0]?.content || '',
      fontSize: connector.annotations?.[0]?.style?.fontSize || 12,
      fontFamily: connector.annotations?.[0]?.style?.fontFamily || 'Arial',
      fontColor: connector.annotations?.[0]?.style?.color || '#000000',
      textAlign: connector.annotations?.[0]?.style?.textAlign || 'Center',
      bold: connector.annotations?.[0]?.style?.bold || false,
      italic: connector.annotations?.[0]?.style?.italic || false,
      underline: connector.annotations?.[0]?.style?.textDecoration === 'Underline',
      textOpacity: connector.annotations?.[0]?.style?.opacity !== undefined 
        ? connector.annotations[0].style.opacity 
        : 1
    };

    setProperties(connProps);
  }, [selectedConnector]);

  const handlePropertyUpdate = (key: keyof ConnectorProperties, value: any) => {
    if (properties) {
      const updatedProps = { ...properties, [key]: value };
      setProperties(updatedProps);
      onPropertyChange({ [key]: value });
    }
  };

  // Handle source/target decorator type changes
  const handleDecoratorTypeChange = (position: 'source' | 'target', type: string) => {
    if (position === 'source') {
      setSourceDecoratorType(type);
      onPropertyChange({ 
        sourceDecorator: type as 'None' | 'Arrow' | 'Circle' | 'Diamond' | 'OpenArrow' | 'Square' | 'DoubleArrow',
        startArrowSize: type === 'None' ? 0 : (properties?.startArrowSize || 10)
      });
    } else {
      setTargetDecoratorType(type);
      onPropertyChange({ 
        targetDecorator: type as 'None' | 'Arrow' | 'Circle' | 'Diamond' | 'OpenArrow' | 'Square' | 'DoubleArrow',
        endArrowSize: type === 'None' ? 0 : (properties?.endArrowSize || 10)
      });
    }
  };

  // Configuration data
  const connectorTypes = [
    { text: 'Straight', value: 'Straight' },
    { text: 'Orthogonal', value: 'Orthogonal' },
    { text: 'Bezier', value: 'Bezier' },
  ];

  const strokeStyles = [
    { text: '—————', value: '' },
    { text: '- - - - -', value: '5 5' },
    { text: '. . . . .', value: '2 2' }
  ];

  // Decorator shape options (matching your screenshot)
  const decoratorTypes = [
    { text: 'None', value: 'None' },
    { text: 'Arrow', value: 'Arrow' },
    { text: 'Circle', value: 'Circle' },
    { text: 'Diamond', value: 'Diamond' },
    { text: 'OpenArrow', value: 'OpenArrow' },
    { text: 'Square', value: 'Square' },
    { text: 'DoubleArrow', value: 'DoubleArrow' }
  ];

  const fontFamilies = [
    { text: 'Arial', value: 'Arial' },
    { text: 'Times New Roman', value: 'Times New Roman' },
    { text: 'Courier New', value: 'Courier New' },
    { text: 'Verdana', value: 'Verdana' },
    { text: 'Georgia', value: 'Georgia' }
  ];

  const textAlignments = [
    { text: 'Left', value: 'Left' },
    { text: 'Center', value: 'Center' },
    { text: 'Right', value: 'Right' }
  ];

  if (!properties) {
    return (
      <div style={styles.container}>
        <div style={styles.noSelection}>
          <h3 style={styles.noSelectionText}>No connector selected</h3>
          <p style={styles.noSelectionSubtext}>Select a connector to edit its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div id="connector-property-panel-container" style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.headerTitle}>Connector Properties</h3>
      </div>

      <div style={styles.content}>
        {/* ==================== CONNECTOR-LEVEL PROPERTIES ==================== */}

        {/* Connector Type */}
        <div style={styles.propertyGroup}>
          <label style={styles.propertyLabel}>Connector Type</label>
          <div style={styles.propertyRow}>
            <DropDownListComponent
              dataSource={connectorTypes}
              fields={{ text: 'text', value: 'value' }}
              value={properties.connectorType || 'Straight'}
              change={(e) => handlePropertyUpdate('connectorType', e.value)}
              width="100%"
            />
          </div>
        </div>

        {/* Stroke Style and Thickness */}
        <div style={styles.twoRowSection}>
          <div style={styles.propertyGroup}>
            <label style={styles.propertyLabel}>Stroke Style</label>
            <DropDownListComponent
              dataSource={strokeStyles}
              fields={{ text: 'text', value: 'value' }}
              value={properties.strokeDashArray || ''}
              change={(e) => handlePropertyUpdate('strokeDashArray', e.value)}
              width="100%"
            />
          </div>
          <div style={styles.propertyGroup}>
            <label style={styles.propertyLabel}>Thickness</label>
            <NumericTextBoxComponent
              value={properties.strokeWidth || 2}
              format="n2"
              min={1}
              max={20}
              step={0.5}
              showSpinButton={true}
              change={(e) => handlePropertyUpdate('strokeWidth', e.value)}
              width="100%"
            />
          </div>
        </div>

        {/* Source Decorator */}
        <div style={styles.propertyGroup}>
          <label style={styles.propertyLabel}>Source Decorator</label>
          <DropDownListComponent
            dataSource={decoratorTypes}
            fields={{ text: 'text', value: 'value' }}
            value={sourceDecoratorType || 'None'}
            change={(e) => handleDecoratorTypeChange('source', e.value)}
            width="100%"
          />
        </div>

        {/* Target Decorator */}
        <div style={styles.propertyGroup}>
          <label style={styles.propertyLabel}>Target Decorator</label>
          <DropDownListComponent
            dataSource={decoratorTypes}
            fields={{ text: 'text', value: 'value' }}
            value={targetDecoratorType || 'Arrow'}
            change={(e) => handleDecoratorTypeChange('target', e.value)}
            width="100%"
          />
        </div>

        {/* Bridging */}
        <div style={styles.propertyGroup}>
          <CheckBoxComponent
            label="Bridging"
            checked={properties.bridging || false}
            change={(e) => handlePropertyUpdate('bridging', e.checked)}
          />
        </div>

        {/* Opacity */}
        <div style={styles.propertyGroup}>
          <label style={styles.propertyLabel}>Opacity</label>
          <div style={styles.sliderContainer}>
            <SliderComponent
              value={(properties.opacity || 1) * 100}
              min={0}
              max={100}
              step={5}
              type="MinRange"
              showButtons={false}
              tooltip={{ isVisible: false }}
              change={(e) => handlePropertyUpdate('opacity', (e.value || 100) / 100)}
              width="100%"
            />
            <span style={styles.opacityValue}>{Math.round((properties.opacity || 1) * 100)}</span>
          </div>
        </div>

        {/* ==================== ANNOTATION PROPERTIES (CONDITIONAL) ==================== */}
        {hasAnnotation && (
          <>
            <div style={styles.sectionDivider}>
              <span style={styles.sectionTitle}>Text</span>
            </div>

            {/* Font Family and Size */}
            <div style={styles.twoRowSection}>
              <div style={styles.propertyGroup}>
                <label style={styles.propertyLabel}>Font</label>
                <DropDownListComponent
                  dataSource={fontFamilies}
                  fields={{ text: 'text', value: 'value' }}
                  value={properties.fontFamily || 'Arial'}
                  change={(e) => handlePropertyUpdate('fontFamily', e.value)}
                  width="100%"
                />
              </div>
              <div style={styles.propertyGroup}>
                <label style={styles.propertyLabel}>Size</label>
                <NumericTextBoxComponent
                  value={properties.fontSize || 12}
                  format="n0"
                  min={8}
                  max={72}
                  step={2}
                  showSpinButton={true}
                  change={(e) => handlePropertyUpdate('fontSize', e.value)}
                  width="100%"
                />
              </div>
            </div>

            {/* Font Color */}
            <div style={styles.propertyGroup}>
              <label style={styles.propertyLabel}>Font Color</label>
              <input
                type="color"
                value={properties.fontColor || '#000000'}
                onChange={(e) => handlePropertyUpdate('fontColor', e.target.value)}
                style={styles.colorInput}
              />
            </div>

            {/* Bold, Italic, Underline */}
            <div style={styles.formatButtonsGroup}>
              <button
                style={{
                  ...styles.formatButton,
                  ...(properties.bold ? styles.formatButtonActive : {})
                }}
                onClick={() => handlePropertyUpdate('bold', !properties.bold)}
                title="Bold"
              >
                B
              </button>
              <button
                style={{
                  ...styles.formatButton,
                  ...(properties.italic ? styles.formatButtonActive : {})
                }}
                onClick={() => handlePropertyUpdate('italic', !properties.italic)}
                title="Italic"
              >
                I
              </button>
              <button
                style={{
                  ...styles.formatButton,
                  ...(properties.underline ? styles.formatButtonActive : {})
                }}
                onClick={() => handlePropertyUpdate('underline', !properties.underline)}
                title="Underline"
              >
                U
              </button>
            </div>

            {/* Text Alignment */}
            <div style={styles.propertyGroup}>
              <label style={styles.propertyLabel}>Alignment</label>
              <DropDownListComponent
                dataSource={textAlignments}
                fields={{ text: 'text', value: 'value' }}
                value={properties.textAlign || 'Center'}
                change={(e) => handlePropertyUpdate('textAlign', e.value)}
                width="100%"
              />
            </div>

            {/* Text Opacity */}
            <div style={styles.propertyGroup}>
              <label style={styles.propertyLabel}>Text Opacity</label>
              <div style={styles.sliderContainer}>
                <SliderComponent
                  value={(properties.textOpacity || 1) * 100}
                  min={0}
                  max={100}
                  step={5}
                  type="MinRange"
                  showButtons={false}
                  tooltip={{ isVisible: false }}
                  change={(e) => handlePropertyUpdate('textOpacity', (e.value || 100) / 100)}
                  width="100%"
                />
                <span style={styles.opacityValue}>{Math.round((properties.textOpacity || 1) * 100)}</span>
              </div>
            </div>
          </>
        )}
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
    position: 'relative' as const,
    fontFamily: 'Segoe UI, sans-serif'
  },
  header: {
    padding: '12px 15px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f5f5f5',
    flexShrink: 0 as const,
    minHeight: '45px',
    display: 'flex',
    alignItems: 'center' as const
  },
  headerTitle: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 600,
    color: '#333'
  },
  content: {
    flex: 1,
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    padding: '0'
  },
  propertyGroup: {
    borderBottom: '1px solid #f0f0f0',
    padding: '10px 15px',
    backgroundColor: '#ffffff'
  },
  twoRowSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0'
  },
  sectionDivider: {
    padding: '12px 15px 8px 15px',
    backgroundColor: '#f9f9f9',
    borderBottom: '1px solid #e0e0e0',
    borderTop: '1px solid #e0e0e0',
    marginTop: '8px'
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  propertyLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#555555',
    marginBottom: '6px',
    display: 'block'
  },
  propertyRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    width: '100%'
  },
  colorInput: {
    width: '100%',
    height: '32px',
    border: '1px solid #d0d0d0',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '2px'
  },
  formatButtonsGroup: {
    borderBottom: '1px solid #f0f0f0',
    padding: '10px 15px',
    backgroundColor: '#ffffff',
    display: 'flex',
    gap: '6px'
  },
  formatButton: {
    padding: '6px 10px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    border: '1px solid #d0d0d0',
    borderRadius: '4px',
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
    flex: 1,
    transition: 'all 0.2s ease'
  },
  formatButtonActive: {
    backgroundColor: '#e8e8e8',
    borderColor: '#999',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
  },
  sliderContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginTop: '6px'
  },
  opacityValue: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#555555',
    minWidth: '35px',
    textAlign: 'right' as const
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
