import css from "./subscription.module.css";
import { Link } from "react-router-dom";

export default function Subscription() {
  return (
    <>
      <section className={css.subscription}>
        <h2 className={css.title}>La Véline Concept Dünyasına Katılın</h2>
        <p className={css.subtitle}>
          Yeni ürünler ve özel tekliflerden haberdar olun
        </p>
        <Link to="/register" className={css.subscribeButton}>
          Şimdi Kaydolun
        </Link>
      </section>
    </>
  );
}
