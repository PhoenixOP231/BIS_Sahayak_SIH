import { NextRequest, NextResponse } from 'next/server';
import { searchStandards, ALL_STANDARDS } from '@/lib/standards-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';
    const status = searchParams.get('status') || 'all';

    const results = searchStandards(query, category, status);

    // Extract unique categories and sectors for filter dropdowns
    const categories = Array.from(new Set(ALL_STANDARDS.map(s => s.category))).sort();
    const sectors = Array.from(new Set(ALL_STANDARDS.map(s => s.sector))).sort();

    return NextResponse.json({
      success: true,
      total: results.length,
      categories,
      sectors,
      standards: results
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch standards' },
      { status: 500 }
    );
  }
}
