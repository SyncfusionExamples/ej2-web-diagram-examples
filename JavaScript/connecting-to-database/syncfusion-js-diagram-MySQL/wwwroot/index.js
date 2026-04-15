ej.diagrams.Diagram.Inject(ej.diagrams.DataBinding, ej.diagrams.HierarchicalTree);

const dataManager = new ej.data.DataManager({
    url: "http://localhost:5137/api/Diagram"
});

var diagram = new ej.diagrams.Diagram({
    width: '1000px',
    height: '600px',
    snapSettings: { constraints: ej.diagrams.SnapConstraints.None },
    layout: { type: 'HierarchicalTree' },
    dataSourceSettings: {
        id: "id",
        parentId: "parentId",
        dataSource: dataManager,
        doBinding: (nodeModel, data) => {
            nodeModel.annotations = [{
                content: data.name,
                style: { color: "#FFFFFF" }
            }];
        }
    },
    getNodeDefaults: (node) => {
        node.width = 120;
        node.height = 40;
        node.style = { fill: "#1F3A8A", strokeColor: "#1E40AF" };
        return node;
    },
    getConnectorDefaults: (connector) => {
        connector.type = "Orthogonal";
        connector.cornerRadius = 7;
        connector.targetDecorator = { shape: "None" };
        connector.style = { strokeColor: "#94A3B8", strokeWidth: 1.5 };
        return connector;
    }
});
diagram.appendTo('#diagram');