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
      DROP TABLE IF EXISTS hierarchicallayout;
      
      CREATE TABLE hierarchicallayout (
        id TEXT PRIMARY KEY,
        "parentId" TEXT,
        label TEXT NOT NULL,
        FOREIGN KEY ("parentId") REFERENCES hierarchicallayout(id) ON DELETE CASCADE
      );
      
      CREATE INDEX idx_hierarchicallayout_parentid ON hierarchicallayout("parentId");
    `);
    
    console.log('Table created successfully');

    // Insert seed data
    for (const node of seedData) {
      await client.query(
        'INSERT INTO hierarchicallayout (id, "parentId", label) VALUES ($1, $2, $3)',
        [node.id, node.parentId, node.label]
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
