export const metadata = {
  title: 'Terms of Use | Trendora',
  description: 'Terms of Use for Trendora.',
};

export default function TermsPage() {
  return (
    <>
      <nav>
        <a href="/" className="brand">
          TREND<span>ORA</span>
        </a>

        <div className="navlinks">
          <a href="/">Home</a>
          <a href="/#shop">Shop</a>
        </div>
      </nav>

      <main className="legalPage">
        <small>LEGAL</small>
        <h1>Terms of Use</h1>
        <p className="legalUpdated">Last updated: September 20, 2026</p>

        <section>
          <h2>About Trendora</h2>
          <p>
            Trendora is a product discovery website that helps visitors
            discover products available from third-party retailers. Trendora
            may provide product information, recommendations, images, prices,
            and links to external websites.
          </p>

          <h2>Product Information</h2>
          <p>
            We aim to provide useful and accurate product information, but
            product details, pricing, availability, promotions, and other
            information may change at any time. Visitors should verify current
            information directly with the destination retailer before making
            a purchase.
          </p>

          <h2>Third-Party Retailers</h2>
          <p>
            Products displayed on Trendora may be sold, shipped, serviced,
            or otherwise provided by third-party retailers. Unless explicitly
            stated otherwise, Trendora is not the seller of products purchased
            through external retailer links.
          </p>

          <h2>Affiliate Disclosure</h2>
          <p>
            Some links on Trendora may be affiliate links. Trendora may earn
            a commission from qualifying purchases made after a visitor
            follows certain links, at no additional cost to the visitor.
          </p>

          <h2>Amazon Associates</h2>
          <p>
            As an Amazon Associate I earn from qualifying purchases.
          </p>

          <h2>External Websites</h2>
          <p>
            Trendora may link to websites operated by third parties. We do
            not control those websites and are not responsible for their
            content, availability, policies, security, or practices. Use of
            third-party websites is subject to their own terms and policies.
          </p>

          <h2>No Guarantee of Availability</h2>
          <p>
            Displaying a product on Trendora does not guarantee that the
            product will remain available, remain at the displayed price,
            or be suitable for a particular purpose.
          </p>

          <h2>Acceptable Use</h2>
          <p>
            Visitors may use Trendora for lawful personal purposes. You may
            not attempt to interfere with the operation or security of the
            website, misuse its services, or use the website for unlawful
            activity.
          </p>

          <h2>Changes to Trendora</h2>
          <p>
            We may update, modify, suspend, or discontinue portions of
            Trendora and may update these Terms as the website develops.
            The latest version will be posted on this page.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these Terms can be submitted through
            Trendora&apos;s contact page.
          </p>
        </section>

        <a className="legalBack" href="/">
          ← Back to Trendora
        </a>
      </main>
    </>
  );
}
