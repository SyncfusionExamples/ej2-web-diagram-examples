import {
    Diagram,
    ConnectorModel,
    DataBinding,
    HierarchicalTree,
    TextModel,
    NodeModel,
} from '@syncfusion/ej2-diagrams';
import { DataManager, Query } from '@syncfusion/ej2-data';
Diagram.Inject(DataBinding, HierarchicalTree);

let diagram: Diagram = new Diagram({
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
        dataSource: new DataManager({
            url: 'https://localhost:7279/api/layoutnodes',
            crossDomain: true,
        }),
    }, //Sets the default properties for nodes and connectors
    getNodeDefaults: (obj: NodeModel) => {
        obj.annotations = [
            { content: (obj.data as any).role }
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
    getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
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