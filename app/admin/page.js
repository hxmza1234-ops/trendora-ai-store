'use client';

import { useEffect, useState } from 'react';

export default function Admin() {
  const [s, setS] = useState({});
  const [key, setKey] = useState('');
  const [msg, setMsg] = useState('');

  const [product, setProduct] = useState({
    title: '',
    asin: '',
    category: 'Trending',
    price: '',
    trendScore: '90',
    image: '',
    url: '',
    reason: ''
  });

  const load = () =>
    fetch('/api/stats')
      .then((r) => r.json())
      .then(setS);

  useEffect(() => {
    load();
  }, []);

  async function seedCatalog() {
    setMsg('Seeding catalog…');

    const r = await fetch('/api/admin/seed', {
      method: 'POST',
      headers: {
        'x-admin-secret': key
      }
    });

    setMsg(
      r.ok
        ? 'Catalog seeded successfully'
        : 'Wrong admin secret or seed failed'
    );

    load();
  }

  async function addProduct(e) {
    e.preventDefault();

    if (!key) {
      setMsg('Enter your admin secret first');
      return;
    }

    if (!product.title || !product.url) {
      setMsg('Product title and affiliate URL are required');
      return;
    }

    setMsg('Adding product…');

    const r = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': key
      },
      body: JSON.stringify(product)
    });

    const data = await r.json();

    if (!r.ok) {
      setMsg(data.error || 'Failed to add product');
      return;
    }

    setMsg(`Product added — ${data.totalProducts} total products`);

    setProduct({
      title: '',
      asin: '',
      category: 'Trending',
      price: '',
      trendScore: '90',
      image: '',
      url: '',
      reason: ''
    });

    load();
  }

  return (
    <main className="admin">
      <a href="/">← Store</a>
      <small>CONTROL ROOM</small>

      <h1>Automation dashboard</h1>

      <div className="statgrid">
        <div>
          <b>{s.products || 0}</b>
          <span>Products</span>
        </div>

        <div>
          <b>{s.amazon ? 'Connected' : 'Setup'}</b>
          <span>Amazon</span>
        </div>

        <div>
          <b>{s.shopify ? 'Connected' : 'Setup'}</b>
          <span>Shopify</span>
        </div>

        <div>
          <b>72h</b>
          <span>Refresh cycle</span>
        </div>
      </div>

      <section className="panel">
        <h2>Admin access</h2>

        <input
          type="password"
          placeholder="Admin secret"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </section>

      <section className="panel">
        <h2>Add product</h2>

        <p>Add a product to the Trendora catalog.</p>

        <form onSubmit={addProduct}>
          <input
            placeholder="Product title"
            value={product.title}
            onChange={(e) =>
              setProduct({ ...product, title: e.target.value })
            }
          />

          <input
            placeholder="ASIN"
            value={product.asin}
            onChange={(e) =>
              setProduct({ ...product, asin: e.target.value })
            }
          />

          <input
            placeholder="Category"
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
          />

          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Trend score"
            value={product.trendScore}
            onChange={(e) =>
              setProduct({ ...product, trendScore: e.target.value })
            }
          />

          <input
            placeholder="Image URL"
            value={product.image}
            onChange={(e) =>
              setProduct({ ...product, image: e.target.value })
            }
          />

          <input
            placeholder="Amazon affiliate link"
            value={product.url}
            onChange={(e) =>
              setProduct({ ...product, url: e.target.value })
            }
          />

          <input
            placeholder="Why it's trending"
            value={product.reason}
            onChange={(e) =>
              setProduct({ ...product, reason: e.target.value })
            }
          />

          <button className="primary" type="submit">
            Add product
          </button>
        </form>

        <p>{msg}</p>
      </section>

      <section className="panel">
        <h2>Seed catalog</h2>

        <p>
          Save the current Trendora starter catalog to the persistent database.
        </p>

        <button className="primary" onClick={seedCatalog}>
          Seed catalog
        </button>
      </section>

      <section className="panel">
        <h2>Last refresh</h2>

        <p>{s.lastRefresh || 'Demo catalog — no live refresh yet'}</p>

        <p>Total refreshes: {s.refreshes || 0}</p>
      </section>
    </main>
  );
}
