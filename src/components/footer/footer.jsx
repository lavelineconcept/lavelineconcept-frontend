import css from "./footer.module.css"
import iyzicoLogo from "../../assets/logo_band_colored@2x.png"

export default function Footer() {
  return (
    <>
      <footer className={css.footerContainer}>
        <div className={css.footerTop}>
          <div className={css.footerContent}>
            <h1 className={css.footerTitle}>La Véline Concept</h1>
            <p> Detaylar ve bilgi için bizimle iletişime geçebilirsiniz</p>
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
          <div className={css.footerContent}>
            <h4 className={css.footerLinks}>Hakkımızda</h4>
            <h4 className={css.footerLinks}>Gizlilik sözleşmesi</h4>
            <h4 className={css.footerLinks}>Kullanım koşulları</h4>
            <h4 className={css.footerLinks}>İletişim</h4>
            <h4 className={css.footerLinks}>Teslimat ve İadeler</h4>
          </div>
        </div>
        <div className={css.footerBottom}>
          <img src={iyzicoLogo} alt="iyzico logo" className={css.iyzicoLogo} />
          <p className={css.footerText}>
            © 2024 Laveline Concept. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </>
  );
}