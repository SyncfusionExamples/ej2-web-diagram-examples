import { Request, Response } from 'express';
import pool from '../db/index.js';
import { LayoutNode } from '../types/layout.types.js';

/**
 * Fetches all organizational chart layout nodes from the database
 * Returns organizational chart data as JSON array
 */
export const getLayoutData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Execute SQL query to fetch all nodes ordered by id
    const result = await pool.query<LayoutNode>(
      'SELECT id, parent_id, role FROM org_chart_layout ORDER BY id'
    );
    
    // Send the rows array as JSON response
    res.json(result.rows);
  } catch (error) {
    // Log error for debugging
    console.error('Error fetching layout data:', error);
    
    // Extract error message safely
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return 500 Internal Server Error with details in development mode
    res.status(500).json({
      message: 'Failed to fetch layout data',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};