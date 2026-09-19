'use client';

import { useEffect, useMemo, useState } from 'react';

export default function Home() {
  const [state, setState] = useState({ products: [] });
  const [stats, setStats] = useState({});
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  const load = () => {
    fetch('/api/products')
      .then((r) => r.json())
      .then(setState);

    fetch('/api/stats')
      .then((r) => r.json())
      .then(setStats);
  };

  useEffect(load, []);

  const cats = [
    'All',
    ...new Set(state.products.map((p) => p.category)),
  ];

  const products = useMemo(
    () =>
      state.products.filter(
        (p) =>
          (cat === 'All' || p.category === cat) &&
          p.title.toLowerCase().includes(q.toLowerCase())
      ),
    [state, q, cat]
  );

  return (
    <>
      <nav>
        <div className="brand">
          TREND<span>ORA</span>
        </div>

        <div className="navlinks">
          <a href="#shop">Shop</a>
          <a href="#about">How it works</a>
          <a href="/admin">Admin</a>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="eyebrow">CURATED PRODUCT DISCOVERY</div>

          <h1>
            The internet finds it.
            <br />
            <i>Trendora</i> curates it.
          </h1>

          <p>
            Discover interesting products across tech, home, lifestyle,
            travel and more — curated in one place so you can spend less
            time searching.
          </p>

          <div className="heroBtns">
            <a className="primary" href="#shop">
              Shop trending
            </a>
            <a className="secondary" href="#about">
              How it works
            </a>
          </div>

          <div className="metrics">
            <b>
              {state.products.length}
              <small>CURATED FINDS</small>
            </b>

            <b>
              72h
              <small>REFRESH CYCLE</small>
            </b>

            <b>
              CURATED
              <small>PRODUCT DISCOVERY</small>
            </b>

            <b>
              LIVE
              <small>STOREFRONT</small>
            </b>
          </div>
        </section>

        <section id="shop">
          <div className="sectionHead">
            <div>
              <small>CURATED BY TRENDORA</small>
              <h2>Trending right now</h2>
            </div>

            <input
              placeholder="Search finds..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="chips">
            {cats.map((c) => (
              <button
                className={cat === c ? 'active' : ''}
                onClick={() => setCat(c)}
                key={c}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid">
            {products.map((p) => (
              <article className="card" key={p.id}>
                <div className="pic">
                  <img src={p.image} alt={p.title} />
                  <span>↗ {p.trendScore}</span>
                </div>

                <div className="cardBody">
                  <small>{p.category}</small>
                  <h3>{p.title}</h3>
                  <p>{p.reason}</p>

                  <div className="buy">
                    <b>
                      {p.price
                        ? `$${Number(p.price).toFixed(2)}`
                        : 'Check price'}
                    </b>

                    <a
                      href={p.url}
                      target="_blank"
                      rel="nofollow sponsored noreferrer"
                    >
                      View product ↗
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="engine">
          <div>
            <small>HOW TRENDORA WORKS</small>
            <h2>Find more. Search less.</h2>

            <p>
              Trendora organizes product discoveries from across popular
              categories into a simple storefront. We focus on products
              that are interesting, useful, or gaining attention so you
              can discover new finds without digging through endless
              listings.
            </p>

            <p>
              Product availability, pricing and details may change at the
              destination retailer. Always review the retailer&apos;s
              product page before purchasing.
            </p>
          </div>

          <div className="pipeline">
            <span>
              01
              <br />
              <b>DISCOVER</b>
            </span>
            <span>
              02
              <br />
              <b>REVIEW</b>
            </span>
            <span>
              03
              <br />
              <b>CURATE</b>
            </span>
            <span>
              04
              <br />
              <b>REFRESH</b>
            </span>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand">
          TREND<span>ORA</span>
        </div>

        <p>
          Curated product discoveries • Availability and pricing can change
          at the destination retailer.
        </p>

        <p>
          Trendora participates in affiliate programs. We may earn a
          commission from qualifying purchases made through certain links,
          at no additional cost to you.
        </p>

        <p>
          As an Amazon Associate I earn from qualifying purchases.
        </p>
            <div className="footerLinks">
  <a href="/privacy">Privacy Policy</a>
  <a href="/terms">Terms of Use</a>
  <a href="/contact">Contact</a>
</div>
      </footer>
    </>
  );
}
