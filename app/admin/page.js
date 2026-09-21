'use client';

import { useEffect, useState } from 'react';

export default function Admin() {
  const [s, setS] = useState({});
  const [key, setKey] = useState('');
  const [msg, setMsg] = useState('');

  const load = () =>
    fetch('/api/stats')
      .then((r) => r.json())
      .then(setS);

  useEffect(load, []);

  async function refresh() {
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
        <h2>Seed catalog</h2>

        <p>
          Save the current Trendora catalog to the persistent database.
        </p>

        <input
          type="password"
          placeholder="Admin secret"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />

        <button className="primary" onClick={refresh}>
          Seed catalog
        </button>

        <p>{msg}</p>
      </section>

      <section className="panel">
        <h2>Last refresh</h2>

        <p>{s.lastRefresh || 'Demo catalog — no live refresh yet'}</p>

        <p>
          Total refreshes: {s.refreshes || 0}
        </p>
      </section>
    </main>
  );
}
