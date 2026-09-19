export const metadata = {
  title: 'Privacy Policy | Trendora',
  description: 'Privacy Policy for Trendora.',
};

export default function PrivacyPage() {
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
        <h1>Privacy Policy</h1>
        <p className="legalUpdated">Last updated: September 20, 2026</p>

        <section>
          <h2>Overview</h2>
          <p>
            Trendora is a product discovery website that helps visitors
            discover products and follow links to third-party retailers.
            This Privacy Policy explains how information may be collected,
            used, and handled when you visit Trendora.
          </p>

          <h2>Information We Collect</h2>
          <p>
            Trendora does not currently require visitors to create an account
            or directly submit personal information to browse the website.
            Our hosting and technology providers may automatically process
            technical information such as IP address, browser type, device
            information, and basic usage or diagnostic data when you access
            the site.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Trendora contains links to third-party websites and retailers.
            When you follow one of these links, the destination website may
            collect information according to its own privacy policy. Trendora
            does not control the privacy practices of third-party websites.
          </p>

          <h2>Affiliate Links</h2>
          <p>
            Some links on Trendora may be affiliate links. This means Trendora
            may earn a commission when a visitor makes a qualifying purchase
            after following certain links, at no additional cost to the
            visitor.
          </p>

          <h2>Amazon Associates</h2>
          <p>
            Trendora participates in the Amazon Services LLC Associates
            Program, an affiliate advertising program designed to provide a
            means for sites to earn advertising fees by advertising and
            linking to Amazon.com.
          </p>

          <h2>Cookies and Similar Technologies</h2>
          <p>
            Trendora itself may use essential technologies necessary to
            operate the website. Third-party services or destination retailers
            may use cookies or similar technologies according to their own
            policies.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            This Privacy Policy may be updated as Trendora develops or as the
            services used by the website change. The latest version will be
            posted on this page.
          </p>

          <h2>Contact</h2>
          <p>
            Questions regarding this Privacy Policy can be submitted through
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
