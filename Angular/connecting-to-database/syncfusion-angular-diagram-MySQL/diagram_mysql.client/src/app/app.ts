import { Component, OnInit } from '@angular/core';
import {
  DiagramComponent, DiagramModule, DataBindingService,
  HierarchicalTreeService, LayoutModel, DataSourceModel, NodeModel,
  SnapSettingsModel,
  SnapConstraints
} from '@syncfusion/ej2-angular-diagrams';
import { DataManager } from '@syncfusion/ej2-data';

export interface Employee { id: number; name: string; parentId?: number | null; }

const BASE_URL = 'http://localhost:5296/api/diagram/items';

@Component({
  selector: 'app-root',
  imports: [DiagramModule],
  providers: [DataBindingService, HierarchicalTreeService],
  templateUrl: './app.html',
})
export class App implements OnInit {
  public layout: LayoutModel = {
    type: 'OrganizationalChart',
  }
  public dataSourceSettings?: DataSourceModel;

  ngOnInit(): void {
    const items = new DataManager({ url: BASE_URL });
    this.dataSourceSettings = {
      id: 'id',
      parentId: 'parentId',
      dataSource: items,
      doBinding: (nodeModel: NodeModel, data: Employee) => {
        nodeModel.annotations = [{
          content: data.name,
          style: { color: '#FFFFFF' }
        }];
      }
    };
  }

  public getNodeDefaults(obj: NodeModel): NodeModel {
    obj.width = 120;
    obj.height = 40;
    obj.style = { fill: '#1F3A8A', strokeColor: '#1E40AF' };
    return obj;
  };

  public getConnectorDefaults(connector: any): void {
    connector.type = 'Orthogonal';
    connector.cornerRadius = 7;
    connector.targetDecorator = { shape: 'None' };
    connector.style = {
      strokeColor: '#94A3B8',
      strokeWidth: 1.5
    };
  };

  public snapSettings: SnapSettingsModel = { constraints: SnapConstraints.None }
}