import css from "./navigation.module.css";
import { Link } from "react-router-dom";

export default function Navigation() {
  // const navigate = useNavigate();
  return (
    <>
      <nav className={css.navbar}>
        <div className={css.brandName}>
          <Link to="/">La Véline Concept</Link>
        </div>
        <div className={css.navLinks}>
          <Link to="/">Anasayfa</Link>
          <Link to="/products">Ürünler</Link>
          <Link to="/cart" className={css.cartLink} title="Alışveriş Sepeti">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="6" width="18" height="12" rx="1" ry="1" />
              <path d="M7 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
              <path d="M9 12v5" />
              <path d="M15 12v5" />
            </svg>
          </Link>
          <Link to="/login" className={css.button}>GİRİŞ YAP</Link>
        </div>
      </nav>
    </>
  );
}
