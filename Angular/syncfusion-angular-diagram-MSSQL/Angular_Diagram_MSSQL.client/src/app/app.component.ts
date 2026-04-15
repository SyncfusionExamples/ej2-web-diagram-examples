
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { DiagramComponent, Diagram, NodeModel, ConnectorModel, LayoutModel, DataSourceModel, DiagramModule,
  HierarchicalTreeService, DataBindingService, DataBinding, HierarchicalTree, SnapSettingsModel, SnapConstraints } from '@syncfusion/ej2-angular-diagrams';
import { DataManager, Query } from '@syncfusion/ej2-data';

Diagram.Inject(DataBinding, HierarchicalTree);

const BASE_URL = "/api/layoutnodes";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [DiagramModule],
  templateUrl: "app.component.html",
  styleUrls: ["app.component.css"],
  providers: [HierarchicalTreeService, DataBindingService],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  @ViewChild('diagram') diagram?: DiagramComponent;
  public snapSettings: SnapSettingsModel = {
      // Display both Horizontal and Vertical gridlines
      constraints:  SnapConstraints.None
  };
  public items?: DataManager;
  public layout?: LayoutModel;
  public dataSourceSettings?: DataSourceModel;
 
  public nodeDefaults = (obj: NodeModel): NodeModel => {
    obj.width = 120;
    obj.height = 40;
    obj.shape = { type: 'Basic', shape: 'Rectangle' };
    obj.annotations = [{ content: (obj.data as { role: 'string' }).role }];
    obj.style = { fill: '#6BA5D7', strokeColor: 'white' };
    return obj;
  };

  public connDefaults = (connector: any): void => {
    connector.type = 'Orthogonal';
    connector.cornerRadius = 7;
    connector.targetDecorator = { shape: 'None' };
  };

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
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
        this.items = new DataManager(data as JSON[], new Query().take(5));
        // Force diagram refresh
        if (this.diagram) {
          this.layout = {
            //Sets layout type
            type: 'OrganizationalChart'
          }

          //Configures data source for Diagram
          this.dataSourceSettings = {
            id: 'id',
            parentId: 'parentId',
            dataSource: this.items
          }
        }
      })
      .catch((error) => {
        console.error('Error loading data:', error);
      });
  }
}
