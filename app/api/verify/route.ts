import { NextRequest, NextResponse } from 'next/server';
import { getLicenseByDigits, getDatabaseStats } from '@/lib/db-licenses';
import { 
  parseAndVerifyLicense, 
  isSuspiciousTestPattern,
  resolveStandardId,
  resolveStandardTitle,
  VerificationStatus
} from '@/lib/license-database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const getStats = searchParams.get('stats');

    // Return database statistics if requested
    if (getStats === 'true' || getStats === '1') {
      const stats = await getDatabaseStats();
      return NextResponse.json({
        success: true,
        isDemoData: true,
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
    const licenseDigits = /^(?:CM\/L[\s-]*)?(\d{7,8})$/.exec(clean)?.[1];

    // 1. Suspicious / Repeating Pattern Check
    if (licenseDigits && isSuspiciousTestPattern(licenseDigits)) {
      return NextResponse.json({
        status: 'suspicious_pattern',
        license: null,
        inputNumber: `CM/L-${rawDigits}`,
        isDemoData: true,
        authoritativeStep: 'Verify packaging and cross-check on official BIS Care App',
        portalUrl: 'https://www.services.bis.gov.in',
        message: `The license number CM/L-${rawDigits} matches an invalid or suspicious test pattern. This is not verified as an authentic licence. Please verify on the official BIS Care Mobile App.`
      });
    }

    // 2. Query Demonstration PostgreSQL Cloud Database
    if (licenseDigits) {
      try {
        const dbRecord = await getLicenseByDigits(licenseDigits);
        if (dbRecord) {
          let mappedStatus: VerificationStatus = 'operative';
          let statusMessage = `Demonstration record: License ${dbRecord.cml_number} (${dbRecord.brand}) is listed as OPERATIVE in our demonstration index. Confirm on official BIS Care App.`;

          if (dbRecord.status === 'EXPIRED') {
            mappedStatus = 'expired';
            statusMessage = `Notice: Demonstration record for License ${dbRecord.cml_number} (${dbRecord.brand}) is listed as EXPIRED. Products manufactured after expiry are not certified.`;
          } else if (dbRecord.status === 'SUSPENDED') {
            mappedStatus = 'suspended';
            statusMessage = `WARNING: Demonstration record for License ${dbRecord.cml_number} (${dbRecord.brand}) is marked as SUSPENDED in this dataset. Confirm its current status with BIS.`;
          } else if (dbRecord.status === 'CANCELLED') {
            mappedStatus = 'cancelled';
            statusMessage = `WARNING: Demonstration record for License ${dbRecord.cml_number} (${dbRecord.brand}) is marked as CANCELLED in this dataset. Confirm its current status with BIS.`;
          }

          return NextResponse.json({
            status: mappedStatus,
            source: 'neon_postgresql_demo_cache',
            isDemoData: true,
            authoritativeStep: 'Confirm live validity on official BIS Care Mobile App (com.bis.bisapp)',
            portalUrl: 'https://www.services.bis.gov.in',
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
            message: statusMessage
          });
        }
      } catch (err) {
        console.error('Database query error, falling back to local verification:', err);
      }
    }

    // 3. Fallback to Local In-Memory Demonstration Parser
    const localResult = parseAndVerifyLicense(q);
    return NextResponse.json({
      ...localResult,
      source: 'local_demo_engine'
    });

  } catch (err) {
    console.error('Verification route error:', err);
    return NextResponse.json({
      status: 'invalid',
      message: 'Failed to process verification request. Please try again.'
    }, { status: 500 });
  }
}
