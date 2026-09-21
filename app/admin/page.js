'use client';

import { useEffect, useState } from 'react';

const emptyProduct = {
  title: '',
  asin: '',
  category: 'Trending',
  price: '',
  trendScore: '90',
  image: '',
  url: '',
  reason: ''
};

export default function Admin() {
  const [s, setS] = useState({});
  const [products, setProducts] = useState([]);
  const [key, setKey] = useState('');
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [editing, setEditing] = useState(null);

  async function load() {
    try {
      const [statsResponse, productsResponse] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/products')
      ]);

      const stats = await statsResponse.json();
      const catalog = await productsResponse.json();

      setS(stats);
      setProducts(catalog.products || []);
    } catch {
      setMsg('Failed to load catalog');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function uploadFile(file) {
    if (!file) return null;

    if (!key) {
      setMsg('Enter your admin secret before uploading an image');
      return null;
    }

    setUploading(true);
    setMsg('Uploading image…');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const r = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'x-admin-secret': key
        },
        body: formData
      });

      const data = await r.json();

      if (!r.ok) {
        setMsg(data.error || 'Image upload failed');
        return null;
      }

      setMsg('Image uploaded successfully');
      return data.url;
    } catch {
      setMsg('Image upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function uploadNewImage(e) {
    const url = await uploadFile(e.target.files?.[0]);

    if (url) {
      setProduct((current) => ({
        ...current,
        image: url
      }));
    }
  }

  async function uploadEditImage(e) {
    const url = await uploadFile(e.target.files?.[0]);

    if (url) {
      setEditing((current) => ({
        ...current,
        image: url
      }));
    }
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

    try {
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

      setProduct(emptyProduct);
      setMsg(`Product added — ${data.totalProducts} total products`);
      await load();
    } catch {
      setMsg('Failed to add product');
    }
  }

  function startEdit(item) {
    setEditing({
      ...item,
      price: item.price ?? '',
      trendScore: item.trendScore ?? 90
    });

    setMsg('');
  }

  async function saveEdit(e) {
    e.preventDefault();

    if (!key) {
      setMsg('Enter your admin secret first');
      return;
    }

    if (!editing?.title || !editing?.url) {
      setMsg('Product title and affiliate URL are required');
      return;
    }

    setMsg('Saving changes…');

    try {
      const r = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': key
        },
        body: JSON.stringify(editing)
      });

      const data = await r.json();

      if (!r.ok) {
        setMsg(data.error || 'Failed to edit product');
        return;
      }

      setEditing(null);
      setMsg('Product updated successfully');
      await load();
    } catch {
      setMsg('Failed to edit product');
    }
  }

  async function deleteProduct(item) {
    if (!key) {
      setMsg('Enter your admin secret first');
      return;
    }

    const confirmed = window.confirm(
      `Delete "${item.title}" from Trendora?`
    );

    if (!confirmed) return;

    setMsg('Deleting product…');

    try {
      const r = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': key
        },
        body: JSON.stringify({
          id: item.id
        })
      });

      const data = await r.json();

      if (!r.ok) {
        setMsg(data.error || 'Failed to delete product');
        return;
      }

      if (editing?.id === item.id) {
        setEditing(null);
      }

      setMsg(`Product deleted — ${data.totalProducts} products remaining`);
      await load();
    } catch {
      setMsg('Failed to delete product');
    }
  }

  async function seedCatalog() {
    if (!key) {
      setMsg('Enter your admin secret first');
      return;
    }

    const confirmed = window.confirm(
      'Seed catalog will replace the current database catalog with the starter catalog. Continue?'
    );

    if (!confirmed) return;

    setMsg('Seeding catalog…');

    try {
      const r = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: {
          'x-admin-secret': key
        }
      });

      const data = await r.json();

      if (!r.ok) {
        setMsg(data.error || 'Seed failed');
        return;
      }

      setMsg('Catalog seeded successfully');
      await load();
    } catch {
      setMsg('Seed failed');
    }
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

        {msg && <p>{msg}</p>}
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

          <div>
            <p>Product image</p>

            <input
              type="file"
              accept="image/*"
              onChange={uploadNewImage}
              disabled={uploading}
            />

            {product.image && (
              <div>
                <p>✓ Image ready</p>
                <img
                  src={product.image}
                  alt="Product preview"
                  style={{
                    width: '140px',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                />
              </div>
            )}
          </div>

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

          <button
            className="primary"
            type="submit"
            disabled={uploading}
          >
            Add product
          </button>
        </form>
      </section>

      <section className="panel">
        <h2>Manage products</h2>

        <p>{products.length} products currently in Trendora.</p>

        {products.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '18px 0',
              borderBottom: '1px solid #2a2a2a'
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    border: '1px solid #333',
                    borderRadius: '10px',
                    display: 'grid',
                    placeItems: 'center'
                  }}
                >
                  No image
                </div>
              )}

              <div style={{ flex: 1 }}>
                <b>{item.title}</b>
                <p>{item.category}</p>
              </div>

              <button
                type="button"
                onClick={() => startEdit(item)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => deleteProduct(item)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      {editing && (
        <section className="panel">
          <h2>Edit product</h2>
          <p>Editing: {editing.title}</p>

          <form onSubmit={saveEdit}>
            <input
              placeholder="Product title"
              value={editing.title}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
            />

            <input
              placeholder="ASIN"
              value={editing.asin || ''}
              onChange={(e) =>
                setEditing({ ...editing, asin: e.target.value })
              }
            />

            <input
              placeholder="Category"
              value={editing.category || ''}
              onChange={(e) =>
                setEditing({ ...editing, category: e.target.value })
              }
            />

            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={editing.price}
              onChange={(e) =>
                setEditing({ ...editing, price: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Trend score"
              value={editing.trendScore}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  trendScore: e.target.value
                })
              }
            />

            <div>
              <p>Change product image</p>

              <input
                type="file"
                accept="image/*"
                onChange={uploadEditImage}
                disabled={uploading}
              />

              {editing.image && (
                <img
                  src={editing.image}
                  alt="Product preview"
                  style={{
                    width: '140px',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                />
              )}
            </div>

            <input
              placeholder="Amazon affiliate link"
              value={editing.url || ''}
              onChange={(e) =>
                setEditing({ ...editing, url: e.target.value })
              }
            />

            <input
              placeholder="Why it's trending"
              value={editing.reason || ''}
              onChange={(e) =>
                setEditing({ ...editing, reason: e.target.value })
              }
            />

            <button
              className="primary"
              type="submit"
              disabled={uploading}
            >
              Save changes
            </button>

            <button
              type="button"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          </form>
        </section>
      )}

      <section className="panel">
        <h2>Seed catalog</h2>

        <p>
          Reset the database to the Trendora starter catalog.
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
