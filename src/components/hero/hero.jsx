import css from "./hero.module.css";
import Logo from "../../assets/laveline-logo-nobackground.png";

export default function Hero() {
    return (
      <>
        <section className={css.hero}>
          <div className={css.brand}>
            <img
              src={Logo}
              alt="La Véline Concept Logo"
              className={css.logo}
            />
            <h1 className={css.title}>La Véline Concept</h1>
            <p className={css.subtitle}>Detaylarda Saklı Zarafet</p>
          </div>
        </section>
      </>
    );
}
