let cachedToken = null;
let tokenExpiresAt = 0;

export function shopifyConfigured() {
  return !!(
    process.env.SHOPIFY_STORE_DOMAIN &&
    process.env.SHOPIFY_CLIENT_ID &&
    process.env.SHOPIFY_CLIENT_SECRET
  );
}

async function getShopifyAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const response = await fetch(
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify auth failed: ${response.status}`);
  }

  const data = await response.json();

  cachedToken = data.access_token;
  tokenExpiresAt =
    Date.now() + Math.max((data.expires_in || 86400) - 300, 60) * 1000;

  return cachedToken;
}

export async function shopifyGraphQL(query, variables = {}) {
  const token = await getShopifyAccessToken();
  const version = process.env.SHOPIFY_API_VERSION || "2026-07";

  const response = await fetch(
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/${version}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify ${response.status}`);
  }

  return response.json();
}
