"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ej2_diagrams_1 = require("@syncfusion/ej2-diagrams");
var ej2_data_1 = require("@syncfusion/ej2-data");
ej2_diagrams_1.Diagram.Inject(ej2_diagrams_1.DataBinding, ej2_diagrams_1.HierarchicalTree);
var diagram = new ej2_diagrams_1.Diagram({
    width: '100%',
    height: '550px',
    //Uses layout to auto-arrange nodes on the Diagram page
    layout: {
        //set the type as Organizational Chart
        type: 'OrganizationalChart',
    }, //Configures data source for Diagram
    dataSourceSettings: {
        id: 'id',
        parentId: 'parentId',
        dataSource: new ej2_data_1.DataManager({
            url: 'https://localhost:7279/api/layoutnodes',
            crossDomain: true,
        }),
    }, //Sets the default properties for nodes and connectors
    getNodeDefaults: function (obj) {
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
        obj.width = 150;
        obj.height = 75;
        obj.borderWidth = 1;
        return obj;
    },
    getConnectorDefaults: function (connector, diagram) {
        connector.style = {
            strokeColor: '#6BA5D7',
            strokeWidth: 2,
        };
        connector.targetDecorator.style.fill = '#6BA5D7';
        connector.targetDecorator.style.strokeColor = '#6BA5D7';
        connector.type = 'Orthogonal';
        return connector;
    },
});
diagram.appendTo('#diagram');
//# sourceMappingURL=index.js.map