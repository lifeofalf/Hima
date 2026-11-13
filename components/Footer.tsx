import Logo from "./Logo";
import type { Dict } from "@/lib/i18n";

export default function Footer({ dict }: { dict: Dict }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="logo">
            <Logo />
          </div>
          <div>
            <h4>{dict.footer.facilityLabel}</h4>
            <address>
              Hima Seafood Rjukan
              <br />
              Svaddevegen 129
              <br />
              3660 Rjukan
            </address>
          </div>
          <div>
            <h4>{dict.footer.salesLabel}</h4>
            <address>
              Hima Seafood Management
              <br />
              Dronning Mauds gate 3
              <br />
              0250 Oslo
              <br />
              <a href="mailto:info@himaseafood.com">info@himaseafood.com</a>
            </address>
          </div>
        </div>
        <div className="footer-meta">
          <span>© Hima Seafood</span>
          <span>{dict.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
