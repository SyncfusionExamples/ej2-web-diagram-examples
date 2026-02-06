import { useEffect, useState } from 'react';
import {
  DiagramComponent,
  Inject,
  HierarchicalTree,
  DataBinding,
  Node,
  Connector
} from '@syncfusion/ej2-react-diagrams';
import { DataManager } from '@syncfusion/ej2-data';
import type { LayoutNode } from '../types/layout.types';
import { fetchLayoutData } from '../services/layoutService';

const DiagramOrgchartLayout = () => {
  const [data, setData] = useState<LayoutNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const layoutData = await fetchLayoutData();
        setData(layoutData);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load diagram data';
        setError(errorMessage);
        console.error('Error loading layout data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading diagram...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#d32f2f'
      }}>
        <h3>Error Loading Diagram</h3>
        <p>{error}</p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Please ensure the backend server is running on http://localhost:5000
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '700px' }}>
      <DiagramComponent
        id="diagram"
        width="100%"
        height="100%"
        dataSourceSettings={{
          id: 'id',
          parentId: 'parent_id',
          dataSource: new DataManager(data)
        }}
        layout={{
          type: 'OrganizationalChart',
          horizontalSpacing: 50,
          verticalSpacing: 50
        }}
        getNodeDefaults={(node: Node) => {
          node.width = 100;
          node.height = 40;
          node.shape = { type: 'Basic', shape: 'Rectangle' };
          node.style = { fill: '#6BA5D7', strokeColor: '#6BA5D7' };
          node.annotations = [{
            content: (node.data as LayoutNode).role,
            style: { color: 'white' }
          }];
          return node;
        }}
        getConnectorDefaults={(connector: Connector) => {
          connector.type = 'Orthogonal';
          connector.targetDecorator = {
            shape: 'Arrow',
            width: 10,
            height: 10
          };
          connector.style = { strokeColor: '#6BA5D7' };
          return connector;
        }}
      >
        <Inject services={[HierarchicalTree, DataBinding]} />
      </DiagramComponent>
    </div>
  );
};

export default DiagramOrgchartLayout;
