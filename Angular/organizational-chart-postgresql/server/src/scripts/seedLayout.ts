import { createAdminPool, createAppPool } from '../db/index';
import * as fs from 'fs';
import * as path from 'path';
import { LayoutNode } from '../types/layout.types';

async function seedDatabase(): Promise<void> {
  const adminPool = createAdminPool();
  let appPool;

  try {
    console.log('Step 1: Connecting to postgres database...');
    
    // Check if orgchart_db exists
    console.log('Step 2: Checking if orgchart_db database exists...');
    const dbCheckResult = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );

    if (dbCheckResult.rows.length === 0) {
      console.log(`Database ${process.env.DB_NAME} does not exist. Creating...`);
      await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✓ Database ${process.env.DB_NAME} created successfully`);
    } else {
      console.log(`✓ Database ${process.env.DB_NAME} already exists`);
    }

    await adminPool.end();
    console.log('Step 3: Connecting to orgchart_db...');

    // Connect to orgchart_db
    appPool = createAppPool();

    // Create table
    console.log('Step 4: Creating orgchart_layout table...');
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS orgchart_layout (
        id TEXT PRIMARY KEY,
        parent_id TEXT,
        role TEXT NOT NULL,
        FOREIGN KEY (parent_id) REFERENCES orgchart_layout(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Table created successfully');

    // Create index on parent_id
    await appPool.query(`
      CREATE INDEX IF NOT EXISTS idx_parent_id ON orgchart_layout(parent_id)
    `);
    console.log('✓ Index on parent_id created successfully');

    // Read seed data
    console.log('Step 5: Reading seed data...');
    const seedDataPath = path.join(__dirname, '../data/layoutSeed.json');
    const seedData: LayoutNode[] = JSON.parse(
      fs.readFileSync(seedDataPath, 'utf-8')
    );
    console.log(`✓ Read ${seedData.length} nodes from seed file`);

    // Clear existing data
    console.log('Step 6: Clearing existing data and inserting seed data...');
    await appPool.query('TRUNCATE TABLE orgchart_layout CASCADE');

    // Insert seed data in two passes to handle foreign key constraints
    // First pass: Insert nodes without parent_id
    const rootNodes = seedData.filter(node => !node.parent_id);
    for (const node of rootNodes) {
      await appPool.query(
        'INSERT INTO orgchart_layout (id, parent_id, role) VALUES ($1, $2, $3)',
        [node.id, null, node.role]
      );
    }

    // Second pass: Insert nodes with parent_id
    const childNodes = seedData.filter(node => node.parent_id);
    for (const node of childNodes) {
      await appPool.query(
        'INSERT INTO orgchart_layout (id, parent_id, role) VALUES ($1, $2, $3)',
        [node.id, node.parent_id, node.role]
      );
    }

    console.log(`✓ Inserted ${seedData.length} nodes successfully`);

    // Verify data
    const result = await appPool.query('SELECT COUNT(*) FROM orgchart_layout');
    console.log(`Step 7: Verification - Total nodes in database: ${result.rows[0].count}`);

    console.log('\n✓✓✓ Database seeding completed successfully! ✓✓✓\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  } finally {
    if (appPool) {
      await appPool.end();
    }
  }
}

seedDatabase();
