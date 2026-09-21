import { NextResponse } from 'next/server';
import { saveProducts } from '../../../../../lib/store';
import { demoProducts } from '../../../../../lib/demo';

export async function POST(req) {
  if (
    !process.env.ADMIN_SECRET ||
    req.headers.get('x-admin-secret') !== process.env.ADMIN_SECRET
  ) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const state = await saveProducts(demoProducts);

  return NextResponse.json({
    ok: true,
    seeded: true,
    products: state.products.length,
    updatedAt: state.updatedAt,
    refreshes: state.refreshes
  });
}
