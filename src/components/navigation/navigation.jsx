import css from "./navigation.module.css";
import { useNavigate, Link } from "react-router-dom";

export default function Navigation() {
    const navigate = useNavigate();
    return (
        <>
        <nav className={css.navbar}>
            <div className={css.brandName}>
                <Link to="/">La Véline Concept</Link>
            </div>
            <div className={css.navLinks}>
                <Link to="/anasayfa">Anasayfa</Link>
                <Link to="/products">Ürünler</Link>
                
            </div>
        </nav>
        </>
    );
}