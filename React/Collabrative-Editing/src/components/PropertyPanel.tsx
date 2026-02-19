/**
 * PropertyPanel Component
 * Context-sensitive property editor for selected diagram elements
 */

import { useState, useEffect } from 'react';
import { NumericTextBoxComponent, SliderComponent } from '@syncfusion/ej2-react-inputs';
import { ColorPickerComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
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
  const [hasAnnotation, setHasAnnotation] = useState<boolean>(false);
  useEffect(() => {
    // Build properties object depending on selected item type
    if (!selectedItem || selectedItem.type !== 'node') {
      setProperties(null);
      setShowGradient(false);
      setHasAnnotation(false);
      return;
    }
    const node = selectedItem.node as any;
    const hasAnnotations = node.annotations && node.annotations.length > 0;
    setHasAnnotation(hasAnnotations);

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
        aspectRatio: selectedNode.constraints ? ((selectedNode.constraints as any)) !== 0 : false,
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
        underline: selectedNode.annotations?.[0]?.style?.textDecoration === 'Underline',
        textOpacity: selectedNode.annotations?.[0]?.style?.opacity !== undefined ? (selectedNode.style as any).opacity : 1,
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

    if (selectedItem.type === 'node') {
      const ann = selectedItem.node.annotation as any;
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


    <div style={styles.container} className='db-property-editor-container' >
      <div >
        <div className="db-node-behaviour-prop">
          <div className="row db-prop-header-text">
            Properties
          </div>
          <div className="db-prop-separator"></div>
          <div className="db-prop-text-style">
            Dimensions
          </div>
          <div className="db-prop-row">
            <div style={{ paddingLeft: '0px', marginRight: '15px' }}>
              <div className="db-text">
                <span>X</span>
              </div>
              <div className="db-text-input">
                <NumericTextBoxComponent
                  value={properties.offsetX}
                  format="n0"
                  step={10}
                  showSpinButton={true}
                  change={(e) => handlePropertyUpdate('offsetX', e.value)}
                  width="100%"
                />
              </div>
            </div>
            <div style={{ paddingLeft: '0px' }}>
              <div className="db-text">
                <span>Y</span>
              </div>
              <div className="db-text-input">
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

          </div>
          <div className="db-prop-row">
            <div style={{ paddingLeft: '0px', marginRight: '15px' }}>
              <div>
                <div className="db-text">
                  <span>W</span>
                </div>
                <div className="db-text-input">
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
              </div>
            </div>
            <div style={{ paddingLeft: '0px', marginRight: '15px' }}>
              <div>
                <div className="db-text">
                  <span>H</span>
                </div>
                <div className="db-text-input">
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
              </div>
            </div>
            <div style={{ paddingLeft: '0px' }}>
              <div>
                <div>
                  <ButtonComponent id='aspectRatioBtn' ref={aspectRatio => (aspectRatio = aspectRatio)}
                    cssClass={"e-aspectRatioBtn e-flat"} iconCss="sf-icon-unlock" isToggle={true}
                    onClick={() => handlePropertyUpdate('aspectRatio', properties.aspectRatio)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="db-prop-row">
            <div className="col-xs-6 db-col-left" style={{ marginRight: "3px" }}>
              <div>
                <div className="db-text">
                  <span>R</span>
                </div>
                <div className="db-text-input">
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
          </div>
          <div className="db-prop-separator"></div>
          <div className="db-prop-text-style">
            Insert
          </div>
          <div className="db-prop-row">
            <div>
              <ButtonComponent
                cssClass="e-outline"
                content="Insert Link"
                iconCss="e-icons e-link"

              />
            </div>
          </div>
          <div className="db-prop-separator"></div>
          <div id='nodeStyleProperties' className="db-node-style-prop">
            <div className="db-background-style">
              <div className="db-prop-text-style">
                Background Type
              </div>
              <div className="db-prop-row">
                <div className="col-xs-6 db-col-left">
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

                </div>
                <div className="db-col-left" style={{ marginLeft: "10px" }}>
                  <ColorPickerComponent
                    value={properties.fillColor}
                    change={(e) => handlePropertyUpdate('fillColor', e.currentValue.hex)}
                    mode="Palette"
                    showButtons={false}
                    cssClass="inline-color-picker"
                  />
                </div>
              </div>

              {showGradient && (
                <div id='gradientStyleId'>
                  <div className="db-prop-text-style">
                    Gradient Style
                  </div>
                  <div className="col-xs-6 db-prop-row">
                    <div className="db-col-left">
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
            <div className="db-border-style">
              <div className="db-prop-text-style">
                Border Type
              </div>
              <div className="db-prop-row">
                <div className="col-xs-6 db-col-left">
                  <DropDownListComponent
                    dataSource={borderTypes}
                    fields={{ text: 'text', value: 'value' }}
                    value={properties.borderDashArray}
                    change={(e) => handlePropertyUpdate('borderDashArray', e.value)}
                    width="60%"
                  />

                </div>
                <div className="db-col-left" style={{ marginLeft: "10px" }}>
                  <ColorPickerComponent
                    value={properties.strokeColor}
                    change={(e) => handlePropertyUpdate('strokeColor', e.currentValue.hex)}
                    mode="Palette"
                    showButtons={false}
                    cssClass="inline-color-picker"
                  />
                </div>
              </div>
              <div className="db-prop-text-style">
                Thickness
              </div>
              <div className="db-prop-row">
                <div className="col-xs-6 db-col-left">
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
              <div className="db-prop-row">
                <div className="db-prop-text-style" style={{ marginRight: "20px" }}>
                  <span className="db-prop-text-style">Opacity</span>
                </div>
                <div className="col-xs-12" style={{ paddingRight: "0px !important", paddingLeft: "0px !important", marginTop: "5px" }}>
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
                <div className="col-xs-2" style={{ marginTop: "5px", marginLeft: "17px", paddingLeft: "8px !important", paddingRight: "0px" }}>
                  <input
                    type="text"
                    value={Math.round((properties.opacity || 1) * 100)}
                    readOnly
                    style={styles.opacityText}
                  />
                </div>

              </div>
            </div>


          </div>
          {hasAnnotation && (
            <>
              <div id='textPropertyContainer' className="db-text-prop-container" >
                <div className="db-prop-separator"></div>
                <div className="db-prop-header-text">
                  Text
                </div>
                <div className="db-prop-row">
                  <div className="col-xs-6 db-col-left">
                    <DropDownListComponent
                      dataSource={fontFamilies}
                      fields={{ text: 'text', value: 'value' }}
                      value={properties.fontFamily || 'Arial'}
                      change={(e) => handlePropertyUpdate('fontFamily', e.value)}
                      width="100%"
                    />
                  </div>
                  <div className="col-xs-4 db-col-right" style={{ marginLeft: "10px" }}>
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

                <div className="db-prop-row">
                  <div className="col-xs-6 db-col-left" id="textPositionDiv" style={{ marginRight: "10px" }}>
                    <DropDownListComponent
                      dataSource={['Center', 'Top', 'Bottom', 'Left', 'Right']}
                      value="Center"
                      width="100%"
                    />
                  </div>
                  <div className="db-col-right" id="textColorDiv">
                    <ColorPickerComponent
                      value={properties.fontColor}
                      change={(e) => handlePropertyUpdate('fontColor', e.currentValue.hex)}
                      mode="Palette"
                      showButtons={false}
                    />
                  </div>
                </div>
                <div className="db-prop-row" id='toolbarTextStyleDiv' style={{ paddingTop: "10px", justifyContent: "space-between" }}>
                  <div style={{ marginLeft: "-8px" }}>
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
                </div>
                <div id='toolbarTextAlignmentDiv' style={{ marginRight: "-8px", marginLeft: "-8px", paddingTop: "10px", justifyContent: "space-between" }}>
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
                <div className="db-prop-row">
                  <div className="db-prop-text-style" style={{ marginRight: "20px" }}>
                    <span className="db-prop-text-style">Opacity</span>
                  </div>
                  <div className="col-xs-12" style={{ paddingRight: "0px !important", paddingLeft: "0px !important", marginTop: "5px" }}>
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
                  <div className="col-xs-2" style={{ marginTop: "5px", marginLeft: " 17px", paddingLeft: "8px !important", paddingRight: "0px" }}>
                    <input
                      type="text"
                      value={Math.round((properties.opacity || 1) * 100)}
                      readOnly
                      style={styles.opacityText}
                    />
                  </div>
                </div>

              </div>
            </>
          )}


        </div>

      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    overflow: 'auto'
  },
  content: {
    flex: 1,
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    padding: '16px',
    paddingRight: '20px',
    minHeight: 0
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
