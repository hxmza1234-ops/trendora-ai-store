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

export async function syncProductToShopify(product) {
  // Never send Trendora demo products to the real Shopify store
  if (!product?.asin || String(product.id || "").startsWith("demo-")) {
    return { skipped: true, reason: "Demo or invalid product" };
  }

  const asin = String(product.asin);

  // Check whether this Amazon product already exists in Shopify
  const existing = await shopifyGraphQL(
    `
      query FindTrendoraProduct($query: String!) {
        products(first: 1, query: $query) {
          nodes {
            id
            title
          }
        }
      }
    `,
    {
      query: `tag:trendora-asin-${asin}`
    }
  );

  if (existing.errors) {
    throw new Error(JSON.stringify(existing.errors));
  }

  const existingProduct = existing.data?.products?.nodes?.[0];

  // Don't create duplicates on future refreshes
  if (existingProduct) {
    return {
      skipped: true,
      reason: "Already exists",
      shopifyProductId: existingProduct.id
    };
  }

  const result = await shopifyGraphQL(
    `
      mutation CreateTrendoraProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      product: {
        title: product.title,
        status: "DRAFT",
        productType: product.category || "Trendora",
        tags: [
          "trendora",
          "amazon",
          `trendora-asin-${asin}`
        ]
      }
    }
  );

  const userErrors = result.data?.productCreate?.userErrors || [];

  if (result.errors?.length || userErrors.length) {
    throw new Error(
      JSON.stringify(result.errors?.length ? result.errors : userErrors)
    );
  }

  return {
    created: true,
    shopifyProduct: result.data?.productCreate?.product
  };
}

export async function syncProductsToShopify(products = []) {
  const realProducts = products.filter(
    (product) =>
      product?.asin &&
      !String(product.id || "").startsWith("demo-")
  );

  const results = [];

  // Sequential on purpose so we don't hammer Shopify's API
  for (const product of realProducts) {
    try {
      const result = await syncProductToShopify(product);
      results.push({
        asin: product.asin,
        title: product.title,
        ok: true,
        ...result
      });
    } catch (error) {
      results.push({
        asin: product.asin,
        title: product.title,
        ok: false,
        error: error.message
      });
    }
  }

  return results;
}
