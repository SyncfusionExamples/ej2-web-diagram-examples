import pool from '../db/index.js';
import pkg from 'pg';
const { Client } = pkg;
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { LayoutNode } from '../types/layout.types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedDatabase = async (): Promise<void> => {
  const dbName = process.env.DB_NAME || 'orgchart_db';
  // 1. Create Database if it doesn't exist
  const systemClient = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: 'postgres', // Connect to default system DB
  });

  try {
    await systemClient.connect();
    const res = await systemClient.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
    
    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" not found. Creating...`);
      await systemClient.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database "${dbName}" created successfully.`);
    }
  } catch (error) {
    console.error('Error checking/creating database:', error);
  } finally {
    await systemClient.end();
  }

  // 2. Continue with table creation and seeding
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
