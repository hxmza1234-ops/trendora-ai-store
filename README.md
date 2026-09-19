# Trendora Full Stack

Next.js full-stack storefront prepared for Vercel.

## What is live in the code
- Responsive storefront + product search/category filtering
- Server-side API routes
- Amazon Creators API adapter (OAuth credentials stay server-side)
- Scheduled `/api/cron/refresh` catalog refresh every 3 days via `vercel.json`
- Admin dashboard + protected manual refresh
- Shopify GraphQL helper and HMAC-verified webhook endpoint
- Spotify embed configured through an environment variable
- Demo fallback so the site renders before credentials are connected

## Important architecture note
The in-memory demo store is intentionally zero-setup. For durable production data, connect a database and replace `lib/store.js` with persistent reads/writes. Vercel Postgres/Neon/Supabase are suitable choices. The rest of the application is already isolated behind `getState`/`saveProducts` so this is a small swap.

## Deploy
1. Put this folder in GitHub or import it directly into Vercel.
2. In Vercel, add the variables from `.env.example` under Project > Settings > Environment Variables.
3. Deploy. Vercel detects Next.js automatically.
4. Set `NEXT_PUBLIC_SPOTIFY_EMBED_URL` to your Spotify playlist/profile embed URL.
5. Create `ADMIN_SECRET` and `CRON_SECRET` as long random values.

## Amazon
Join Amazon Associates and obtain approved Creators API credentials. Add `AMAZON_CREATOR_CLIENT_ID`, `AMAZON_CREATOR_CLIENT_SECRET`, `AMAZON_PARTNER_TAG`, marketplace and region. Without these, demo products remain active.

## Shopify
Create/configure a Shopify app and add `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_ACCESS_TOKEN`, API version, and webhook secret. The webhook receiver is `/api/shopify/webhook`. Keep checkout/product-write behavior aligned with your actual business model and Amazon/Shopify terms; this starter does not pretend that Amazon retail orders can be silently auto-purchased as a dropshipping fulfillment API.

## Local
Copy `.env.example` to `.env.local`, then `npm install` and `npm run dev`.
