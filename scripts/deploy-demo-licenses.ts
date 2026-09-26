// scripts/deploy-demo-licenses.ts
// Local Demonstration Dataset Deployment Pipeline
// Loads curated demonstration licence records into Neon Serverless PostgreSQL for offline prototype indexing.
// NOTE: This script does NOT connect to official government BIS servers or live e-BIS APIs.
// For official real-time verification, users must use the official BIS Care Mobile App or e-BIS portal (services.bis.gov.in).

import * as fs from 'fs';
import * as path from 'path';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

interface LicenseSeed {
  cmlNumber: string;
  digits: string;
  brand: string;
  manufacturer: string;
  isNumber: string;
  category: string;
  factoryLocation: string;
  state: string;
  status: 'OPERATIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED';
  validUntil: string;
}

async function runDeploy() {
  const startTime = Date.now();
  console.log('=== BIS SAHAYAK: DEMO LICENCE DATABASE DEPLOYMENT ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Notice: Deploying local demonstration records into Neon PostgreSQL.');

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes('placeholder')) {
    console.error('ERROR: DATABASE_URL is not set. Please configure DATABASE_URL in .env.local or environment.');
    process.exit(1);
  }

  const sql = neon(dbUrl);

  // 1. Ensure Table and Indexes Exist
  console.log('Step 1: Verifying database schema on Neon PostgreSQL...');
  await sql`
    CREATE TABLE IF NOT EXISTS bis_licenses (
      cml_number VARCHAR(20) PRIMARY KEY,
      digits VARCHAR(15) NOT NULL,
      brand VARCHAR(150) NOT NULL,
      manufacturer VARCHAR(255) NOT NULL,
      is_number VARCHAR(50) NOT NULL,
      category VARCHAR(100) NOT NULL,
      factory_address TEXT,
      state VARCHAR(100),
      branch_office VARCHAR(150),
      status VARCHAR(20) DEFAULT 'OPERATIVE',
      valid_until VARCHAR(100),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_bis_digits ON bis_licenses(digits);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_bis_brand ON bis_licenses(brand);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_bis_is_number ON bis_licenses(is_number);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_bis_status ON bis_licenses(status);`;
  console.log('Schema verified successfully.');

  // 2. Load Demonstration Licences Dataset
  console.log('Step 2: Loading local demonstration licences dataset...');
  const jsonPath = path.join(process.cwd(), 'data', 'licenses', 'verified-licenses.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('ERROR: verified-licenses.json not found at:', jsonPath);
    process.exit(1);
  }

  const fileData = fs.readFileSync(jsonPath, 'utf-8');
  const licenses: LicenseSeed[] = JSON.parse(fileData);
  console.log(`Loaded ${licenses.length} demonstration licence records from local file.`);

  // 3. Upsert records into Neon PostgreSQL in concurrent batches
  console.log('Step 3: Upserting demo records into Neon PostgreSQL in concurrent batches...');
  let upsertedCount = 0;
  let errorsCount = 0;
  const batchSize = 25;

  for (let i = 0; i < licenses.length; i += batchSize) {
    const chunk = licenses.slice(i, i + batchSize);
    await Promise.all(chunk.map(async (lic) => {
      try {
        await sql`
          INSERT INTO bis_licenses (
            cml_number, digits, brand, manufacturer, is_number,
            category, factory_address, state, branch_office,
            status, valid_until, updated_at
          ) VALUES (
            ${lic.cmlNumber}, ${lic.digits}, ${lic.brand}, ${lic.manufacturer}, ${lic.isNumber},
            ${lic.category}, ${lic.factoryLocation}, ${lic.state}, ${lic.state ? `State: ${lic.state}` : 'BIS Region'},
            ${lic.status}, ${lic.validUntil}, NOW()
          )
          ON CONFLICT (cml_number) DO UPDATE SET
            brand = EXCLUDED.brand,
            manufacturer = EXCLUDED.manufacturer,
            is_number = EXCLUDED.is_number,
            category = EXCLUDED.category,
            factory_address = EXCLUDED.factory_address,
            state = EXCLUDED.state,
            branch_office = EXCLUDED.branch_office,
            status = EXCLUDED.status,
            valid_until = EXCLUDED.valid_until,
            updated_at = NOW();
        `;
        upsertedCount++;
      } catch (err) {
        console.error(`Failed to upsert ${lic.cmlNumber}:`, err);
        errorsCount++;
      }
    }));

    if ((i + batchSize) % 200 === 0 || i + batchSize >= licenses.length) {
      console.log(`Uploaded ${Math.min(i + batchSize, licenses.length)} / ${licenses.length} records...`);
    }
  }

  // 4. Print Summary and Verification
  const countRes = await sql`SELECT COUNT(*)::int as total FROM bis_licenses;`;
  const totalInDb = countRes[0]?.total || 0;
  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('=== DEPLOYMENT SUMMARY ===');
  console.log(`Successfully Upserted: ${upsertedCount} demo records`);
  console.log(`Errors: ${errorsCount}`);
  console.log(`Total Records in Cloud Demo Database: ${totalInDb}`);
  console.log(`Execution Time: ${elapsedSec} seconds`);
}

runDeploy().catch(err => {
  console.error('Fatal deployment error:', err);
  process.exit(1);
});
