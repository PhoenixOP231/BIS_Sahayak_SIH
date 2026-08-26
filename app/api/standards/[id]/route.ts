import { NextRequest, NextResponse } from 'next/server';
import { getStandardById } from '@/lib/standards-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const standard = getStandardById(id);

    if (!standard) {
      return NextResponse.json(
        { error: 'Standard not found for ID or Number: ' + id },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      standard
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve standard' },
      { status: 500 }
    );
  }
}
