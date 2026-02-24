import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  DiagramModule, 
  HierarchicalTree, 
  DataBinding, 
  NodeModel, 
  ConnectorModel, 
  Diagram 
} from '@syncfusion/ej2-angular-diagrams';
import { DataManager } from '@syncfusion/ej2-data';
import { LayoutService } from '../../services/layout.service';
import { LayoutNode } from '../../types/layout.types';

// Inject required diagram modules
Diagram.Inject(DataBinding, HierarchicalTree);

@Component({
  selector: 'app-diagram-orgchart-layout',
  standalone: true,
  imports: [CommonModule, DiagramModule],
  template: `
    <div class="diagram-container">
      <!-- Show loading message while fetching data -->
      <div *ngIf="loading" class="loading">
        <p>Loading diagram...</p>
      </div>
      
      <!-- Show error message if fetch failed -->
      <div *ngIf="error" class="error">
        <h3>Error Loading Diagram</h3>
        <p>{{ error }}</p>
      </div>
      
      <!-- Render diagram once data is loaded -->
      <ejs-diagram
        *ngIf="!loading && !error && data.length > 0"
        id="diagram"
        width="100%"
        height="700px"
        [dataSourceSettings]="dataSourceSettings"
        [layout]="layout"
        [getNodeDefaults]="getNodeDefaults"
        [getConnectorDefaults]="getConnectorDefaults"
      >
      </ejs-diagram>
    </div>
  `,
  styles: [`
    .diagram-container {
      width: 100%;
      height: 100%;
    }
    
    .loading, .error {
      text-align: center;
      padding: 40px;
      font-size: 16px;
    }
    
    .error {
      color: #d32f2f;
      background-color: #ffebee;
      border-radius: 4px;
      margin: 20px;
    }
    
    .error h3 {
      margin-bottom: 10px;
      font-size: 20px;
    }
    
    .loading {
      color: #1976d2;
    }
  `]
})
export class DiagramOrgchartLayoutComponent implements OnInit {
  // State management for data, loading, and error states
  data: LayoutNode[] = [];
  loading = true;
  error: string | null = null;
  
  dataSourceSettings: any;
  layout: any;

  constructor(private layoutService: LayoutService) {
    // Layout algorithm configuration
    this.layout = {
      type: 'OrganizationalChart',  // Use org chart layout
      horizontalSpacing: 50,        // Horizontal gap between nodes
      verticalSpacing: 50           // Vertical gap between levels
    };
  }

  // Fetch data when component initializes
  ngOnInit(): void {
    this.loading = true;
    // Call service layer to fetch data from backend using Observable pattern
    this.layoutService.fetchLayoutData().subscribe({
      next: (layoutData: LayoutNode[]) => {
        this.data = layoutData;
        
        // Data binding configuration
        this.dataSourceSettings = {
          id: 'id',                           // Field name for unique identifier
          parentId: 'parent_id',              // Field name for parent reference
          dataSource: new DataManager(this.data as any[])   // Wrap data with DataManager
        };
        
        this.error = null;
        this.loading = false;
      },
      error: (err) => {
        // Handle fetch errors gracefully
        const errorMessage = err?.message || 'Failed to load diagram data';
        this.error = errorMessage;
        this.loading = false;
        console.error('Error loading layout data:', err);
      }
    });
  }

  // Customize default node appearance
  getNodeDefaults = (node: NodeModel): NodeModel => {
    node.width = 100;
    node.height = 40;
    node.shape = { type: 'Basic', shape: 'Rectangle' };
    node.style = { fill: '#6BA5D7', strokeColor: '#6BA5D7' };
    
    // Add text annotation showing the role field
    node.annotations = [
      {
        content: (node.data as LayoutNode).role,
        style: { color: 'white' }
      }
    ];
    return node;
  }

  // Customize default connector appearance
  getConnectorDefaults = (connector: ConnectorModel): ConnectorModel => {
    connector.type = 'Orthogonal';  // 90-degree angle connectors
    connector.targetDecorator = { 
      shape: 'Arrow', 
      width: 10, 
      height: 10 
    };
    connector.style = { strokeColor: '#6BA5D7' };
    return connector;
  }
}