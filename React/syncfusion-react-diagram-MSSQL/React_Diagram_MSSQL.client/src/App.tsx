import React from 'react';
import { DiagramComponent, Inject, DataBinding, HierarchicalTree, SnapConstraints} from "@syncfusion/ej2-react-diagrams";
import { DataManager, Query } from '@syncfusion/ej2-data';
import type{ ConnectorModel, NodeModel, LayoutModel, DataSourceModel} from "@syncfusion/ej2-react-diagrams";
import './app.css';
import { CustomAdaptor } from './CustomAdaptor';

const BASE_URL = 'http://localhost:5239/api/layoutnodes';
let diagramInstance: DiagramComponent;
const dataManager = new DataManager({
  url: `${BASE_URL}`,
  insertUrl: `${BASE_URL}/insert`,
  updateUrl: `${BASE_URL}/update`,
  removeUrl: `${BASE_URL}/remove`,
  batchUrl: `${BASE_URL}/batch`,
  adaptor: new CustomAdaptor()
});

  let items: DataManager;
  let layout: LayoutModel;
  let dataSourceSettings: DataSourceModel;



 const loadData = () =>{
    fetch(BASE_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      items = new DataManager(data as JSON[], new Query().take(5));
      if (diagramInstance) {
        diagramInstance.layout = {
          //Sets layout type
          type: 'OrganizationalChart'
        }

        //Configures data source for Diagram
        diagramInstance.dataSourceSettings = {
          id: 'id',
          parentId: 'parentId',
          dataSource: items
        }
      }
    })
    .catch((error) => {
      console.error('Error loading data:', error);
    });
}
let snapSettings = {
    constraints: SnapConstraints.None,
};

const App: React.FC = () => {
  loadData();
  
  return (
    <div className="host">
    <DiagramComponent
        id="container"
        ref={(diagram) => (diagramInstance = diagram)}
        width={"100%"}
        height={"550px"}
        snapSettings={snapSettings}
        //Sets the default properties for nodes
        getNodeDefaults={(obj: NodeModel) => {
          obj.width = 120;
          obj.height = 40;
          obj.shape = { type: 'Basic', shape: 'Rectangle' };
          obj.annotations = [{ content: (obj.data as { role: 'string' }).role }];
          obj.style = { fill: '#6BA5D7', strokeColor: 'white' };
          return obj;
        }}

        //Sets the default properties for connectors
        getConnectorDefaults={(connector: ConnectorModel) => {
          connector.type = 'Orthogonal';
          connector.cornerRadius = 7;
          connector.targetDecorator = { shape: 'None' };
          return connector;
        }}
      >

        {/* Inject necessary services for the diagram */}
        <Inject services={[DataBinding, HierarchicalTree]} />
      </DiagramComponent>
    </div>
  );
};

export default App;
