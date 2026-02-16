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
              <a href="https://www.instagram.com/lavelineconcept" className={css.footerLink}>
                Instagram: @lavelineconcept
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