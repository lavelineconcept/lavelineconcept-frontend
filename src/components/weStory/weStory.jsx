import css from "./weStory.module.css";
import { Link } from "react-router-dom";
import Logo from "../../assets/laveline-yazılı-logo-nobackground.png";

export default function WeStory() {
  return (
    <>
      <section className={css.weStory}>
        <div className={css.textContainer}>
          <h2 className={css.title}>La Véline Concept</h2>
          <p className={css.description}>
            La Véline Concept olarak, özel günlerin en anlamlı detaylarını zarafetle tasarlıyoruz.
            Her bir hediyelik; özen, estetik ve kaliteli işçilik anlayışıyla hazırlanır.
            <br /><br />
            Amacımız, nişan ve özel davetlerinizde sevdiklerinize sadece bir hediye değil, unutulmaz bir hatıra sunmaktır.
          </p>
          <Link to={"/about"} className={css.button}>Devamını Oku</Link>
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
