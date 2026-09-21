import { neon } from '@neondatabase/serverless';
import { demoProducts } from './demo';

const sql = neon(process.env.DATABASE_URL);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS trendora_catalog (
      id INTEGER PRIMARY KEY,
      products JSONB NOT NULL,
      updated_at TIMESTAMPTZ,
      refreshes INTEGER NOT NULL DEFAULT 0
    )
  `;
}

export async function getState() {
  await ensureTable();

  const rows = await sql`
    SELECT products, updated_at, refreshes
    FROM trendora_catalog
    WHERE id = 1
  `;

  if (!rows.length) {
    return {
      products: demoProducts,
      updatedAt: null,
      refreshes: 0
    };
  }

  return {
    products: rows[0].products,
    updatedAt: rows[0].updated_at,
    refreshes: rows[0].refreshes
  };
}

export async function saveProducts(products) {
  await ensureTable();

  const updatedAt = new Date().toISOString();
  const productsJson = JSON.stringify(products);

  const rows = await sql`
    INSERT INTO trendora_catalog (
      id,
      products,
      updated_at,
      refreshes
    )
    VALUES (
      1,
      ${productsJson}::jsonb,
      ${updatedAt},
      1
    )
    ON CONFLICT (id)
    DO UPDATE SET
      products = EXCLUDED.products,
      updated_at = EXCLUDED.updated_at,
      refreshes = trendora_catalog.refreshes + 1
    RETURNING products, updated_at, refreshes
  `;

  return {
    products: rows[0].products,
    updatedAt: rows[0].updated_at,
    refreshes: rows[0].refreshes
  };
}
