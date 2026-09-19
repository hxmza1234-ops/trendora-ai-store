import { shopifyGraphQL, shopifyConfigured } from "../../../../lib/shopify";

export async function GET() {
  if (!shopifyConfigured()) {
    return Response.json(
      { ok: false, error: "Shopify environment variables are missing" },
      { status: 500 }
    );
  }

  try {
    const data = await shopifyGraphQL(`
      query {
        shop {
          name
          myshopifyDomain
        }
      }
    `);

    if (data.errors) {
      return Response.json(
        { ok: false, errors: data.errors },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      message: "Shopify API connection successful",
      shop: data.data?.shop
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
