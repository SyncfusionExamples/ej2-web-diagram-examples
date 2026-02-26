import { Component } from '@angular/core';
import { DiagramOrgchartLayoutComponent } from './diagram-orgchart-layout/diagram-orgchart-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DiagramOrgchartLayoutComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>Syncfusion® Angular Diagram - Organizational Chart Layout</h1>
      </header>
      <main class="app-main">
        <app-diagram-orgchart-layout></app-diagram-orgchart-layout>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    
    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .app-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      text-align: center;
    }
    
    .app-main {
      padding: 20px;
    }
  `]
})
export class App {
  title = 'Syncfusion Angular Diagram - Organizational Chart';
}