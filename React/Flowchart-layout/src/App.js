import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from 'react';
import { Diagram, ConnectorEditing, DiagramComponent, Inject, FlowchartLayout, DataBinding, DiagramTools } from '@syncfusion/ej2-react-diagrams';
import { DataManager } from '@syncfusion/ej2-data';

Diagram.Inject(ConnectorEditing);

// Initializing the data source for the layout
const data = [
  {
    id: '1',
    name: 'Start',
    shape: 'Terminator',
    color: '#8E44CC',
  },
  {
    id: '2',
    name: 'Open Gmail site in browser',
    parentId: ['1'],
    shape: 'Rectangle',
    color: '#1759B7',
  },
  {
    id: '3',
    name: 'Existing \nor \n new user?',
    parentId: ['2'],
    shape: 'Decision',
    color: '#2F95D8',
  },
  {
    id: '4',
    name: 'Create an account',
    label: ['New'],
    parentId: ['3'],
    shape: 'Rectangle',
    color: '#1759B7',
  },
  {
    id: '5',
    name: 'Sign in',
    label: ['Existing'],
    parentId: ['3'],
    shape: 'Rectangle',
    color: '#1759B7',
  },
  {
    id: '6',
    name: 'Enter username \n and password',
    label: ['', 'No'],
    parentId: ['5', '7'],
    shape: 'Data',
    color: '#70AF16',
  },
  {
    id: '7',
    name: 'Authorized?',
    parentId: ['6'],
    shape: 'Decision',
    color: '#2F95D8',
  },
  {
    id: '8',
    name: 'Login successful!!',
    label: ['Yes'],
    parentId: ['7'],
    shape: 'Rectangle',
    color: '#1759B7',
  },
  {
    id: '9',
    name: 'Enter first name \n and last name',
    parentId: ['4'],
    shape: 'Data',
    color: '#70AF16',
  },
  {
    id: '10',
    name: 'Enter username \n and password',
    label: ['', 'Yes'],
    parentId: ['9', '11'],
    shape: 'Data',
    color: '#70AF16',
  },
  {
    id: '11',
    name: 'Username \n already \n exists?',
    parentId: ['10'],
    shape: 'Decision',
    color: '#2F95D8',
  },
  {
    id: '12',
    name: 'Registration Successful!!',
    label: ['No'],
    parentId: ['11'],
    shape: 'Process',
    color: '#1759B7',
  },
  {
    id: '13',
    name: 'Open inbox',
    parentId: ['8', '12'],
    shape: 'Process',
    color: '#1759B7',
  },
  {
    id: '14',
    name: 'End',
    parentId: ['13'],
    shape: 'Terminator',
    color: '#8E44CC',
  },
];


function FlowchartLayoutDiagram() {
    return (
        <div className='App'>
            <div className="control-section">
                <div className="control-wrapper">
                    <div className="content-wrapper" style={{ width: '100%', background: 'white' }}>
                        <DiagramComponent
                            id="diagram"
                            width={'100%'}
                            height={'750px'}
                            rulerSettings={{ showRulers: true }}
                            getNodeDefaults={getNodeDefaults}
                            getConnectorDefaults={getConnectorDefaults}
                            tool={DiagramTools.ZoomPan}
                            layout={{
                                type: 'Flowchart',
                                orientation: 'TopToBottom',
                                flowchartLayoutSettings: {
                                    yesBranchDirection: 'LeftInFlow',
                                    noBranchDirection: 'RightInFlow',
                                    yesBranchValues: ['Yes', 'True'],
                                    noBranchValues: ['No', 'False']
                                },
                                verticalSpacing: 50,
                                horizontalSpacing: 50
                            }}
                            dataSourceSettings={{
                                id: 'id',
                                parentId: 'parentId',
                                dataSource: new DataManager(data)
                            }}
                        >
                            <Inject services={[FlowchartLayout, DataBinding]} />
                        </DiagramComponent>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FlowchartLayoutDiagram;

function getNodeDefaults(node) {
    node.width = 150;
    node.height = 50;
    if (node.shape.shape === 'Decision') {
        node.width = 120;
        node.height = 100;
    }
    return node;
}

function getConnectorDefaults(connector) {
    connector.type = 'Orthogonal';
    if (connector.annotations && connector.annotations.length > 0) {
        connector.annotations[0].style.fill = 'white';
        connector.annotations[0].style.color = 'black';
    }
    return connector;
}

const root = createRoot(document.getElementById('root'));
root.render(<FlowchartLayoutDiagram />);
