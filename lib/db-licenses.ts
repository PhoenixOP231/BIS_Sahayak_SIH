import { neon } from '@neondatabase/serverless';

export interface BisLicenseRecord {
  cml_number: string;
  digits: string;
  brand: string;
  manufacturer: string;
  is_number: string;
  category: string;
  factory_address: string;
  state: string;
  branch_office: string;
  status: 'OPERATIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED';
  valid_until: string | null;
  created_at?: string;
  updated_at?: string;
}

function getSql() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes('placeholder')) {
    return null;
  }
  return neon(dbUrl);
}

/**
 * Find license by exact digits or CM/L number in cloud Postgres
 */
export async function getLicenseByDigits(digitsOrCml: string): Promise<BisLicenseRecord | null> {
  const sql = getSql();
  if (!sql) return null;

  try {
    const rawDigits = digitsOrCml.replace(/[^0-9]/g, '');
    const cleanCml = digitsOrCml.trim().toUpperCase();

    const rows = await sql`
      SELECT 
        cml_number, digits, brand, manufacturer, is_number, 
        category, factory_address, state, branch_office, 
        status, valid_until, created_at, updated_at
      FROM bis_licenses
      WHERE digits = ${rawDigits} OR cml_number = ${cleanCml}
      LIMIT 1
    `;

    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        cml_number: r.cml_number,
        digits: r.digits,
        brand: r.brand,
        manufacturer: r.manufacturer,
        is_number: r.is_number,
        category: r.category,
        factory_address: r.factory_address || '',
        state: r.state || '',
        branch_office: r.branch_office || '',
        status: r.status as any,
        valid_until: r.valid_until ? String(r.valid_until) : null,
        created_at: r.created_at,
        updated_at: r.updated_at
      };
    }
    return null;
  } catch (err) {
    console.error('Error querying Neon PostgreSQL bis_licenses:', err);
    return null;
  }
}

/**
 * Search licenses by brand, manufacturer, or IS standard
 */
export async function searchLicensesFromDb(term: string, limit = 20): Promise<BisLicenseRecord[]> {
  const sql = getSql();
  if (!sql || !term.trim()) return [];

  try {
    const pattern = `%${term.trim()}%`;
    const rows = await sql`
      SELECT 
        cml_number, digits, brand, manufacturer, is_number, 
        category, factory_address, state, branch_office, 
        status, valid_until
      FROM bis_licenses
      WHERE 
        brand ILIKE ${pattern} OR 
        manufacturer ILIKE ${pattern} OR 
        cml_number ILIKE ${pattern} OR 
        is_number ILIKE ${pattern}
      LIMIT ${limit}
    `;

    return rows.map((r: any) => ({
      cml_number: r.cml_number,
      digits: r.digits,
      brand: r.brand,
      manufacturer: r.manufacturer,
      is_number: r.is_number,
      category: r.category,
      factory_address: r.factory_address || '',
      state: r.state || '',
      branch_office: r.branch_office || '',
      status: r.status,
      valid_until: r.valid_until ? String(r.valid_until) : null
    }));
  } catch (err) {
    console.error('Error searching Neon PostgreSQL bis_licenses:', err);
    return [];
  }
}

/**
 * Upsert a single license record
 */
export async function upsertLicense(rec: BisLicenseRecord): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;

  try {
    await sql`
      INSERT INTO bis_licenses (
        cml_number, digits, brand, manufacturer, is_number, 
        category, factory_address, state, branch_office, 
        status, valid_until, updated_at
      ) VALUES (
        ${rec.cml_number}, ${rec.digits}, ${rec.brand}, ${rec.manufacturer}, ${rec.is_number},
        ${rec.category}, ${rec.factory_address}, ${rec.state}, ${rec.branch_office},
        ${rec.status}, ${rec.valid_until}, NOW()
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
        updated_at = NOW()
    `;
    return true;
  } catch (err) {
    console.error('Error upserting license to Neon:', err);
    return false;
  }
}

/**
 * Get count & summary statistics from Neon database
 */
export async function getDatabaseStats(): Promise<{ totalLicenses: number; operative: number; suspended: number; lastUpdated: string | null }> {
  const sql = getSql();
  if (!sql) {
    return { totalLicenses: 0, operative: 0, suspended: 0, lastUpdated: null };
  }

  try {
    const stats = await sql`
      SELECT 
        COUNT(*)::int as total,
        COUNT(CASE WHEN status = 'OPERATIVE' THEN 1 END)::int as operative,
        COUNT(CASE WHEN status = 'SUSPENDED' THEN 1 END)::int as suspended,
        MAX(updated_at) as last_updated
      FROM bis_licenses
    `;
    if (stats && stats.length > 0) {
      return {
        totalLicenses: stats[0].total || 0,
        operative: stats[0].operative || 0,
        suspended: stats[0].suspended || 0,
        lastUpdated: stats[0].last_updated ? new Date(stats[0].last_updated).toISOString() : null
      };
    }
  } catch (err) {
    console.error('Error getting DB stats:', err);
  }

  return { totalLicenses: 0, operative: 0, suspended: 0, lastUpdated: null };
}
