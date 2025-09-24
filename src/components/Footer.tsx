const Footer = () => {
  return (
    <footer>
      {/* Section: Social media */}
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        {/* Left */}
        <div className="me-5 d-none d-lg-block">
          <span></span>
        </div>
        {/* Left */}

        {/* Right */}
        <div>
          <a href="#" className="me-4 text-reset">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="me-4 text-reset">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="me-4 text-reset">
            <i className="fab fa-google"></i>
          </a>
          <a href="#" className="me-4 text-reset">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="me-4 text-reset">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="#" className="me-4 text-reset">
            <i className="fab fa-github"></i>
          </a>
        </div>
        {/* Right */}
      </section>
      {/* Section: Social media */}

      {/* Contact */}
      <section className="text-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-lg-start">
              <p>
                Migração para Next.js: Cristiano Filho  | LinkedIn:{" "}
                <a href="https://www.linkedin.com/in/cristiano-filho/://www.linkedin.com/in/leonel-dorneles-porto-b88600122/" className="text-reset fw-bold">
                  Linkedin
                </a>{" "}
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Contact */}
    </footer>
  );
};

export default Footer;
