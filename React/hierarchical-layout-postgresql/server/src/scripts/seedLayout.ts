import pool from '../db/index.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { LayoutNode } from '../types/layout.types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedDatabase = async (): Promise<void> => {
  const client = await pool.connect();
  
  try {
    console.log('Starting database seeding...');

    // Read seed data
    const seedDataPath = join(__dirname, '../data/layoutSeed.json');
    const seedData: LayoutNode[] = JSON.parse(readFileSync(seedDataPath, 'utf-8'));

    // Create table
    await client.query(`
      DROP TABLE IF EXISTS orgchart_layout;
      
      CREATE TABLE orgchart_layout (
        id TEXT PRIMARY KEY,
        parent_id TEXT,
        role TEXT NOT NULL,
        FOREIGN KEY (parent_id) REFERENCES orgchart_layout(id) ON DELETE CASCADE
      );
      
      CREATE INDEX idx_orgchart_layout_parent_id ON orgchart_layout(parent_id);
    `);
    
    console.log('Table created successfully');

    // Insert seed data
    for (const node of seedData) {
      await client.query(
        'INSERT INTO orgchart_layout (id, parent_id, role) VALUES ($1, $2, $3)',
        [node.id, node.parent_id, node.role]
      );
    }

    console.log(`Successfully seeded ${seedData.length} nodes`);
    console.log('Database seeding completed!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    client.release();
  }
};

seedDatabase();
