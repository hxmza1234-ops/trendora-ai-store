import { NextResponse } from 'next/server';
import { getState, saveProducts } from '../../../../lib/store';

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

  try {
    const product = await req.json();

    if (!product.title || !product.url) {
      return NextResponse.json(
        { error: 'Product title and URL are required' },
        { status: 400 }
      );
    }

    const state = await getState();

    const newProduct = {
      id: `manual-${Date.now()}`,
      asin: product.asin || '',
      title: product.title,
      category: product.category || 'Trending',
      price: Number(product.price) || 0,
      trendScore: Number(product.trendScore) || 90,
      image: product.image || '',
      url: product.url,
      reason: product.reason || 'Hand-picked by Trendora.'
    };

    const products = [...state.products, newProduct];

    const saved = await saveProducts(products);

    return NextResponse.json({
      ok: true,
      product: newProduct,
      totalProducts: saved.products.length
    });
  } catch (error) {
    console.error('Add product error:', error);

    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
}
