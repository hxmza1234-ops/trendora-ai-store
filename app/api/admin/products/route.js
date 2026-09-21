import { NextResponse } from 'next/server';
import { getState, saveProducts } from '../../../../lib/store';

function authorized(req) {
  return (
    process.env.ADMIN_SECRET &&
    req.headers.get('x-admin-secret') === process.env.ADMIN_SECRET
  );
}

// ADD PRODUCT
export async function POST(req) {
  if (!authorized(req)) {
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

// EDIT PRODUCT
export async function PUT(req) {
  if (!authorized(req)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const product = await req.json();

    if (!product.id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (!product.title || !product.url) {
      return NextResponse.json(
        { error: 'Product title and URL are required' },
        { status: 400 }
      );
    }

    const state = await getState();

    const exists = state.products.some(
      (item) => item.id === product.id
    );

    if (!exists) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const updatedProduct = {
      id: product.id,
      asin: product.asin || '',
      title: product.title,
      category: product.category || 'Trending',
      price: Number(product.price) || 0,
      trendScore: Number(product.trendScore) || 90,
      image: product.image || '',
      url: product.url,
      reason: product.reason || 'Hand-picked by Trendora.'
    };

    const products = state.products.map((item) =>
      item.id === product.id ? updatedProduct : item
    );

    await saveProducts(products);

    return NextResponse.json({
      ok: true,
      product: updatedProduct
    });
  } catch (error) {
    console.error('Edit product error:', error);

    return NextResponse.json(
      { error: 'Failed to edit product' },
      { status: 500 }
    );
  }
}

// DELETE PRODUCT
export async function DELETE(req) {
  if (!authorized(req)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const state = await getState();

    const exists = state.products.some(
      (product) => product.id === id
    );

    if (!exists) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const products = state.products.filter(
      (product) => product.id !== id
    );

    const saved = await saveProducts(products);

    return NextResponse.json({
      ok: true,
      deleted: id,
      totalProducts: saved.products.length
    });
  } catch (error) {
    console.error('Delete product error:', error);

    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
