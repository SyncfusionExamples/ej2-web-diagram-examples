import { Request, Response } from 'express';
import pool from '../db/index.js';
import { LayoutNode } from '../types/layout.types.js';

export const getLayoutData = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query<LayoutNode>(
      'SELECT id, parent_id, role FROM orgchart_layout ORDER BY id'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching layout data:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    res.status(500).json({
      message: 'Failed to fetch layout data',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};
