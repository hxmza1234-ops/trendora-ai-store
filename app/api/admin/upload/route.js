import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

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
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    if (!file.type?.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image must be under 4MB' },
        { status: 400 }
      );
    }

    const blob = await put(
      `products/${Date.now()}-${file.name}`,
      file,
      {
        access: 'public',
        addRandomSuffix: true
      }
    );

    return NextResponse.json({
      ok: true,
      url: blob.url
    });
  } catch (error) {
    console.error('Image upload error:', error);

    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
