import { Request, Response } from 'express';
import { pool } from '../db/index';
import { LayoutNode } from '../types/layout.types';

export async function getLayoutData(_req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query<LayoutNode>(
      'SELECT id, parent_id, role FROM orgchart_layout ORDER BY id'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching layout data:', error);
    
    if (process.env.NODE_ENV === 'development') {
      res.status(500).json({
        error: 'Failed to fetch layout data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } else {
      res.status(500).json({
        error: 'Failed to fetch layout data'
      });
    }
  }
}
