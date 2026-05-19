import {
  Diagram,
  DataBinding,
  HierarchicalTree,
  SnapConstraints,
} from "@syncfusion/ej2-diagrams";
import { DataManager } from "@syncfusion/ej2-data";

// Inject required feature services
Diagram.Inject(DataBinding, HierarchicalTree);

var dataManager = new DataManager({
  // Check your actual backend port from Properties/launchSettings.json in the ASP.NET project
  url: "http://localhost:5262/api/diagram/items",
});

var diagram = new Diagram({
  width: "100%",
  height: "600px",
  snapSettings: { constraints: SnapConstraints.None },
  // Use organizational chart layout
  layout: { type: "OrganizationalChart" },
  // Configure data source mapping
  dataSourceSettings: {
    //  Maps the database column (`Id`) to uniquely identify each node.
    id: "id",
    // Maps the database column (`ParentId`) to establish parent-child relationships.
    parentId: "parentId",
    // DataManager pointing to the API endpoint that returns employee data.
    dataSource: dataManager,
    // Callback function that customizes node appearance
    doBinding: (nodeModel, data) => {
      nodeModel.annotations = [{
        content: data.name,
        style: { color: '#FFFFFF' }
      }];
    }
  },
  // Defines default styling for all nodes
  getNodeDefaults: (node) => {
    node.width = 120;
    node.height = 40;
    node.style = { fill: '#1F3A8A', strokeColor: '#1E40AF' };
    return node;
  },
  // Defines default styling for connectors
  getConnectorDefaults: (connector) => {
    connector.type = 'Orthogonal';
    connector.cornerRadius = 7;
    connector.targetDecorator = { shape: 'None' };
    connector.style = {
      strokeColor: '#94A3B8',
      strokeWidth: 1.5
    };
    return connector;
  }
});

diagram.appendTo("#diagram");