import css from "./hero.module.css";

export default function Hero() {
    return (
      <>
        <section className={css.hero}>
          <div className={css.brand}>
            <h1 className={css.title}>La Véline Concept</h1>
            <p className={css.subtitle}>Detaylarda Saklı Zarafet</p>
          </div>
        </section>
      </>
    );
}
