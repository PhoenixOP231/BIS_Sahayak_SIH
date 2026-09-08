import { NextRequest, NextResponse } from 'next/server';
import { getLicenseByDigits, getDatabaseStats } from '@/lib/db-licenses';
import { 
  parseAndVerifyLicense, 
  isDummyOrCounterfeitNumber,
  resolveStandardId,
  resolveStandardTitle
} from '@/lib/license-database';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const getStats = searchParams.get('stats');

  // Return database statistics if requested
  if (getStats === 'true' || getStats === '1') {
    const stats = await getDatabaseStats();
    return NextResponse.json({
      success: true,
      stats
    });
  }

  if (!q || !q.trim()) {
    return NextResponse.json({
      status: 'invalid',
      message: 'Please provide a CM/L license number, brand name, or standard.'
    }, { status: 400 });
  }

  const clean = q.trim().toUpperCase();
  const rawDigits = clean.replace(/[^0-9]/g, '');

  // 1. Counterfeit / Dummy Code Check (Strict Enforcement)
  if (isDummyOrCounterfeitNumber(rawDigits)) {
    return NextResponse.json({
      status: 'counterfeit',
      license: null,
      inputNumber: `CM/L-${rawDigits}`,
      message: `The license number CM/L-${rawDigits} is a known counterfeit / dummy test pattern. Substandard products carrying fake stamps violate Section 29 of the BIS Act, 2016 and carry severe domestic hazards.`
    });
  }

  // 2. Query Neon PostgreSQL Cloud Database (Primary National Engine)
  if (rawDigits.length === 7 || rawDigits.length === 8) {
    try {
      const dbRecord = await getLicenseByDigits(rawDigits);
      if (dbRecord) {
        return NextResponse.json({
          status: dbRecord.status === 'SUSPENDED' ? 'suspended' : 'verified',
          source: 'neon_postgresql_cloud',
          license: {
            cmlNumber: dbRecord.cml_number,
            digits: dbRecord.digits,
            brand: dbRecord.brand,
            manufacturer: dbRecord.manufacturer,
            isNumber: dbRecord.is_number,
            standardTitle: resolveStandardTitle(dbRecord.is_number),
            category: dbRecord.category,
            factoryLocation: dbRecord.factory_address,
            state: dbRecord.state,
            status: dbRecord.status,
            validUntil: dbRecord.valid_until || 'Operative',
            scheme: 'Scheme-I (ISI Mark Certification)',
            standardId: resolveStandardId(dbRecord.is_number),
            branchOffice: dbRecord.branch_office
          },
          inputNumber: dbRecord.cml_number,
          message: dbRecord.status === 'SUSPENDED' 
            ? `WARNING: The license ${dbRecord.cml_number} (${dbRecord.brand}) was SUSPENDED / REVOKED by BIS for non-compliance.`
            : `License ${dbRecord.cml_number} is verified authentic and operative in the Central BIS Database.`
        });
      }
    } catch (err) {
      console.error('Database query error, falling back to local verification:', err);
    }
  }

  // 3. Fallback to Local In-Memory Parser (Hybrid Resilience)
  const localResult = parseAndVerifyLicense(q);
  return NextResponse.json({
    ...localResult,
    source: 'local_engine_fallback'
  });
}
