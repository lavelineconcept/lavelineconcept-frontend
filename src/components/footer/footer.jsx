import { Link } from "react-router-dom"
import css from "./footer.module.css"
import iyzicoLogo from "../../assets/logo_band_colored@2x.png"
import hooksLogo from "../../assets/hooks-logo.png"

export default function Footer() {
  return (
    <footer className={css.footerContainer}>
      <div className={css.footerTop}>
        <div className={css.footerBrand}>
          <h1 className={css.footerTitle}>La Véline Concept</h1>
          <p className={css.footerDescription}>
            Detaylar ve bilgi için bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className={css.footerNav}>
          <Link to="/about" className={css.footerLinks}>Hakkımızda</Link>
          <Link to="/contact" className={css.footerLinks}>İletişim</Link>
          <Link to="/delivery" className={css.footerLinks}>Teslimat ve İadeler</Link>
          <Link to="/privacy-policy" className={css.footerLinks}>Gizlilik Politikası</Link>
          <Link to="/distance-sales-agreement" className={css.footerLinks}>Mesafeli Satış Sözleşmesi</Link>
        </div>

        <div className={css.socialLinks}>
          <a href="https://www.instagram.com/lavelineconcept" className={css.footerLink} target="_blank" rel="noopener noreferrer">
            <svg
              className={css.instagramIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>Instagram</span>
          </a>
        </div>
      </div>

      <div className={css.footerBottom}>
        <img src={iyzicoLogo} alt="iyzico logo" className={css.iyzicoLogo} />
        <p className={css.footerText}>
          © 2025 La Véline Concept. Tüm hakları saklıdır.
        </p>
        <div className={css.developer}>
                    Developed by{" "}
                    <a
                        href="https://www.instagram.com/hookssoftwaresolutions?igsh=MWFmajMxYm5hMzhweQ=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className={css.devLink}
                    >
                        <img src={hooksLogo} alt="HOOKS Logo" className={css.devLogo} />
                        HOOKS SOFTWARE SOLUTIONS
                    </a>
                </div>
      </div>
    </footer>
  );
}