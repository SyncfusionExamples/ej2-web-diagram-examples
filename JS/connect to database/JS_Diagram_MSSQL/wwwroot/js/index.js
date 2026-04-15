ej.diagrams.Diagram.Inject(
    ej.diagrams.DataBinding,
    ej.diagrams.HierarchicalTree
);


var diagram = new ej.diagrams.Diagram({
    width: '100%',
    height: '550px',
    layout: { type: 'OrganizationalChart' },
    //Configures data source
    dataSourceSettings: {
        id: 'id',
        parentId: 'parentId',
        dataSource: new ej.data.DataManager({
            url: 'https://localhost:7254/api/layoutnodes',
            crossDomain: true,
        }),
       
    },
    getNodeDefaults: (obj) => {
        obj.annotations = [
            { content: obj.data.role }
        ];
        obj.style = {
            fill: 'None',
            strokeColor: 'none',
            strokeWidth: 2,
            bold: true,
            color: 'white',
        };
        obj.borderColor = 'black';
        obj.backgroundColor = 'darkcyan';
        obj.width = 150;
        obj.height = 75;
        obj.borderWidth = 1;
        obj.shape.margin = { left: 5, right: 5, top: 5, bottom: 5 };
        return obj;
    },
    getConnectorDefaults: (connector, diagram) => {
        connector.type = 'Orthogonal';
        return connector;
    },
});
diagram.appendTo('#diagram');