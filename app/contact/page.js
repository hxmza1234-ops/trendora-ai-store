export const metadata = {
  title: 'Contact | Trendora',
  description: 'Contact Trendora.',
};

export default function ContactPage() {
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
        <small>GET IN TOUCH</small>
        <h1>Contact Trendora</h1>

        <section>
          <h2>Questions or feedback?</h2>

          <p>
            If you have a question about Trendora, a product featured on the
            site, affiliate disclosures, privacy, or anything else related to
            the website, you can contact us by email.
          </p>

          <div className="contactCard">
            <small>EMAIL</small>
            <h2>Contact us</h2>

            <p>
              We aim to respond to legitimate inquiries as soon as reasonably
              possible.
            </p>

            <a
              className="primary"
              href="mailto:trendorarahq@gmail.com
            >
              Send an email
            </a>
          </div>

          <h2>Product questions</h2>

          <p>
            Trendora is a product discovery platform. For questions about an
            order, shipping, returns, warranties, or a specific purchase made
            through a third-party retailer, please contact that retailer
            directly.
          </p>
        </section>

        <a className="legalBack" href="/">
          ← Back to Trendora
        </a>
      </main>
    </>
  );
}
