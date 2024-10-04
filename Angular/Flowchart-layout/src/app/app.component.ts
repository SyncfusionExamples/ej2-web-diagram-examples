import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  DiagramComponent,
  DiagramModule,
  DiagramTools,
} from '@syncfusion/ej2-angular-diagrams';
import {
  Diagram,
  NodeModel,
  ConnectorModel,
  FlowShapeModel,
  LayoutModel,
  RulerSettingsModel,
  FlowchartLayout,
  DataBinding,
} from '@syncfusion/ej2-diagrams';
import { DataManager } from '@syncfusion/ej2-data';
Diagram.Inject(FlowchartLayout, DataBinding);

/**
 * Default FlowShape sample
 */

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [DiagramModule],
})
export class AppComponent {
  @ViewChild('diagram')
  //Diagram Properties
  public diagram: DiagramComponent;
  constructor() {}
  public rulerSettings: RulerSettingsModel = { showRulers: true };

  //Initializes the data source for the layout
  public data = [
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
      name: 'Existing \nor \nnew user?',
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
      name: 'Enter username \nand password',
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
      name: 'Enter first name \nand last name',
      parentId: ['4'],
      shape: 'Data',
      color: '#70AF16',
    },
    {
      id: '10',
      name: 'Enter username \nand password',
      label: ['', 'Yes'],
      parentId: ['9', '11'],
      shape: 'Data',
      color: '#70AF16',
    },
    {
      id: '11',
      name: 'Username \nalready\n exists?',
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
  public layout: LayoutModel = {
    type: 'Flowchart',
    margin: { left: 10, right: 10, top: 10, bottom: 10 },
    flowchartLayoutSettings: {
      yesBranchDirection: 'RightInFlow',
      noBranchDirection: 'LeftInFlow',
      yesBranchValues: ['New', 'Yes'],
      noBranchValues: ['Existing', 'No'],
    },
    verticalSpacing: 50,
    horizontalSpacing: 50,
  };
  public tool: DiagramTools = DiagramTools.ZoomPan;
  public dataSourceSettings: object = {
    id: 'id',
    parentId: 'parentId',
    dataSource: new DataManager(this.data),
  };

  //Defines the default node properties
  public getNodeDefaults(node: NodeModel): NodeModel {
    node.width = 150;
    node.height = 50;
    if ((node.shape as FlowShapeModel).shape === 'Decision') {
      node.width = 120;
      node.height = 100;
    }
    return node;
  }

  //Defines the default connector properties
  public getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
    connector.type = 'Orthogonal';
    if (connector.annotations && connector.annotations.length > 0) {
      connector.annotations[0].style.fill = 'white';
      connector.annotations[0].style.color = 'black';
    }
    return connector;
  }
}
