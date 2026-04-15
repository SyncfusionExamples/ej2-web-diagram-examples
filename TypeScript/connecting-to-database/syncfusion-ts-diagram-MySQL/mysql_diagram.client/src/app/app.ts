import { DataManager } from "@syncfusion/ej2-data";
import {
    Diagram,
    DataBinding,
    HierarchicalTree,
    SnapConstraints,
    NodeModel,
    ConnectorModel
} from "@syncfusion/ej2-diagrams";

Diagram.Inject(DataBinding, HierarchicalTree);

const dataManager = new DataManager({
    url: "http://localhost:5137/api/Diagram"
});

const diagram = new Diagram({
    width: "1000px",
    height: "600px",
    snapSettings: { constraints: SnapConstraints.None },
    layout: { type: "HierarchicalTree" },
    dataSourceSettings: {
        id: "id",
        parentId: "parentId",
        dataSource: dataManager,
        doBinding: (nodeModel: NodeModel, data: any) => {
            nodeModel.annotations = [{
                content: data.name,
                style: { color: "#FFFFFF" }
            }];
        }
    },
    getNodeDefaults: (node: NodeModel) => {
        node.width = 120;
        node.height = 40;
        node.style = { fill: "#1F3A8A", strokeColor: "#1E40AF" };
        return node;
    },
    getConnectorDefaults: (connector: ConnectorModel) => {
        connector.type = "Orthogonal";
        connector.cornerRadius = 7;
        connector.targetDecorator = { shape: "None" };
        connector.style = { strokeColor: "#94A3B8", strokeWidth: 1.5 };
        return connector;
    }
});

diagram.appendTo("#diagram");