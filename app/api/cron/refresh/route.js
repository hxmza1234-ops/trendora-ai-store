import { NextResponse } from 'next/server';
import { refreshCatalog } from '../../../../lib/refresh';
import { getState } from '../../../../lib/store';

const THREE_DAYS = 72 * 60 * 60 * 1000;

export async function GET(req) {
  const auth = req.headers.get('authorization');

  if (
    process.env.CRON_SECRET &&
    auth !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const state = await getState();

  if (state.updatedAt) {
    const lastRefresh = new Date(state.updatedAt).getTime();
    const timeSinceRefresh = Date.now() - lastRefresh;

    if (timeSinceRefresh < THREE_DAYS) {
      return NextResponse.json({
        ok: true,
        refreshed: false,
        message: '72 hours have not passed yet',
        lastRefresh: state.updatedAt
      });
    }
  }

  const result = await refreshCatalog();

  return NextResponse.json({
    ok: true,
    ...result
  });
}
