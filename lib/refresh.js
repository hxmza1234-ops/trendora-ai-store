import {
  amazonConfigured,
  normalizeAmazon,
  searchAmazon
} from "./amazon";

import { getState, saveProducts } from "./store";

import {
  shopifyConfigured,
  syncProductsToShopify
} from "./shopify";

export async function refreshCatalog() {
  // Never overwrite the existing catalog if Amazon isn't ready.
  if (!amazonConfigured()) {
    const currentState = await getState();

    return {
      ...currentState,
      source: "existing",
      refreshed: false,
      reason: "Amazon API is not configured",
      shopifySync: []
    };
  }

  const searches = [
    "viral gadgets",
    "home essentials",
    "travel accessories",
    "fitness accessories",
    "beauty gadgets",
    "car accessories",
    "phone accessories",
    "kitchen gadgets",
    "desk accessories",
    "pet accessories"
  ];

  const groups = await Promise.allSettled(
    searches.map((keywords) => searchAmazon(keywords))
  );

  const products = Array.from(
    new Map(
      groups
        .filter((result) => result.status === "fulfilled")
        .flatMap((result) => normalizeAmazon(result.value))
        .filter((product) => product?.asin)
        .map((product) => [product.asin, product])
    ).values()
  )
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, 100);

  // Amazon failed or returned nothing:
  // KEEP the existing Trendora catalog.
  if (!products.length) {
    const currentState = await getState();

    return {
      ...currentState,
      source: "existing",
      refreshed: false,
      reason: "Amazon returned no usable products",
      shopifySync: []
    };
  }

  // Only save after we know we received real Amazon products.
  const state = await saveProducts(products);

  let shopifySync = [];

  if (shopifyConfigured()) {
    shopifySync = await syncProductsToShopify(products);
  }

  return {
    ...state,
    source: "amazon",
    refreshed: true,
    shopifySync
  };
}
