import {
  amazonConfigured,
  normalizeAmazon,
  searchAmazon
} from "./amazon";

import { saveProducts } from "./store";

import {
  shopifyConfigured,
  syncProductsToShopify
} from "./shopify";

export async function refreshCatalog() {
  let products;
  let source = "demo";
  let shopifySync = [];

  if (amazonConfigured()) {
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

    products = groups
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => normalizeAmazon(result.value));

    // Remove duplicate Amazon products by ASIN
    products = Array.from(
      new Map(
        products
          .filter((product) => product?.asin)
          .map((product) => [product.asin, product])
      ).values()
    )
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, 100);

    if (products.length) {
      source = "amazon";
    }
  }

  // Keep demo catalog for the website if Amazon isn't configured,
  // but demos will NEVER be sent to Shopify.
  if (!products?.length) {
    const { demoProducts } = await import("./demo");
    products = demoProducts;
  }

  const state = await saveProducts(products);

  // Only real Amazon products can reach Shopify.
  if (
    source === "amazon" &&
    shopifyConfigured() &&
    products.length
  ) {
    shopifySync = await syncProductsToShopify(products);
  }

  return {
    ...state,
    source,
    shopifySync
  };
}
