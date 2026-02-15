import css from "./weStory.module.css";
import { Link } from "react-router-dom";
import Logo from "../../assets/laveline-yazılı-logo-nobackground.png";

export default function WeStory() {
  return (
    <>
      <section className={css.weStory}>
        <div className={css.textContainer}>
          <h2 className={css.title}>Hikayemiz Burada Başlıyor</h2>
          <p className={css.description}>
            La Véline Concept, hikayemiz burada yazacak. Devamı için butana
            basın.
                  </p>
            <Link to={"/ourStory"} className={css.button}>Devamını Oku</Link>
        </div>
        <div>
          <img
            src={Logo}
            alt="Our Story"
            className={css.logo}
          />
        </div>
      </section>
    </>
  );
}
