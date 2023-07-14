import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { SelectorConstraints, SelectorModel } from '@syncfusion/ej2-angular-diagrams';
import {
  Diagram, NodeModel, UndoRedo, ConnectorModel,
} from '@syncfusion/ej2-diagrams';
Diagram.Inject(UndoRedo);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  @ViewChild('diagram')
  //Diagram Properties
  public diagram: any;
  constructor() {​​​​​​​
    
}


public nodes: NodeModel[] = [
  {
    id: 'html1', width: 100, height: 100, offsetX: 100, offsetY: 100,
    shape: { type: 'HTML' }
},
{
    id: 'html2', width: 100, height: 100, offsetX: 100, offsetY: 300,
    shape: { type: 'HTML', }
},
{
    id: 'basic1', width: 100, height: 100, offsetX: 300, offsetY: 100,
    annotations: [{ id:'an1' }],
},
];
public selectedItems: SelectorModel = { 
 constraints: SelectorConstraints.All | SelectorConstraints.UserHandle, userHandles:[{}] 
};
public connectors: ConnectorModel[] = [
  { id: 'connector1', sourceID: 'html2', targetID: 'basic1',annotations: [{ id:'con_an1'}] },

];
}