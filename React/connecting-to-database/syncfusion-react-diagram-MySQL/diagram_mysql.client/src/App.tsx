import React from "react";
import {
  DiagramComponent,
  Inject,
  DataBinding,
  HierarchicalTree,
  type NodeModel,
  type ConnectorModel,
  SnapConstraints,
} from "@syncfusion/ej2-react-diagrams";
import { DataManager } from "@syncfusion/ej2-data";

export interface Employee { id: number; name: string; parentId?: number | null; }

export default function App() {
  const dataManager = new DataManager({
    url: "http://localhost:5283/api/diagram/items",
  });

  return (
    <div>
      <DiagramComponent
        id="diagram"
        width={"100%"}
        height={"600px"}
        snapSettings={{ constraints: SnapConstraints.None }}
        // Use hierarchical tree layout
        layout={{ type: "HierarchicalTree" }}
        // Configure data source mapping
        dataSourceSettings={{
          id: "id",
          parentId: "parentId",
          dataSource: dataManager,
          doBinding: (nodeModel: NodeModel, data: Employee) => {
            nodeModel.annotations = [{
              content: data.name,
              style: { color: '#FFFFFF' }
            }];
          }
          // nameField for node label mapping
          // if the component uses node data name, use 'Name' in getNodeDefaults below
        }}
        getNodeDefaults={(node: NodeModel) => {
          node.width = 120;
          node.height = 40;
          node.style = { fill: '#1F3A8A', strokeColor: '#1E40AF' };
          return node;
        }}
        getConnectorDefaults={(connector: ConnectorModel) => {
          connector.type = 'Orthogonal';
          connector.cornerRadius = 7;
          connector.targetDecorator = { shape: 'None' };
          connector.style = {
            strokeColor: '#94A3B8',
            strokeWidth: 1.5
          };
        }}
      >
        <Inject services={[DataBinding, HierarchicalTree]} />
      </DiagramComponent>
    </div>
  );
}