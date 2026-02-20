import type { LayoutNode } from '../types/layout.types';

const API_URL = 'http://localhost:5000/api/layout';

export const fetchLayoutData = async (): Promise<LayoutNode[]> => {
  const response = await fetch(API_URL);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch layout data: ${response.statusText}`);
  }
  
  return response.json();
};