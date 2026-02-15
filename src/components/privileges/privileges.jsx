import css from "./privileges.module.css";
import img from "../../assets/privilageimg.jpg";

export default function Privileges() {
  return (
    <>
      <section className={css.privileges}>
        <h2 className={css.title}>Sunduğumuz Ayrıcalıklar</h2>
        <p className={css.description}>
          La Véline Concept olarak müşterilerimize sunduğumuz avantajlar burada
          yazacak.
        </p>
        <div className={css.content}>
          <div className={css.imageContainer}>
            <img src={img} alt="Privileges" className={css.image} />
          </div>
          <div className={css.textContainer}>
            <h3>ayrıcalık 1</h3>
            <p>ayrıcalık 1 açıklaması</p>
            <h3>ayrıcalık 2</h3>
            <p>ayrıcalık 2 açıklaması</p>
            <h3>ayrıcalık 3</h3>
            <p>ayrıcalık 3 açıklaması</p>
          </div>
        </div>
      </section>
    </>
  );
}
