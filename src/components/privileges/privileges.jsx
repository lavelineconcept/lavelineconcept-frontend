import css from "./privileges.module.css";
import img from "../../assets/privilageimg.jpg";

export default function Privileges() {
  return (
    <>
      <section className={css.privileges}>
        <h2 className={css.title}>Sunduğumuz Ayrıcalıklar</h2>
        <p className={css.description}>
          Özel günleriniz için zarafetle ve özenle hazırlanmış kişiye özel tasarımlar sunuyoruz.
        </p>
        <div className={css.content}>
          <div className={css.imageContainer}>
            <img src={img} alt="Privileges" className={css.image} />
          </div>
          <div className={css.textContainer}>
            <h3>Güvenli Ödeme</h3>
            <p>Tüm siparişleriniz güvenli ödeme altyapısı ile korunur ve sorunsuz şekilde tamamlanır.</p>
            <h3>Kişiye Özel Tasarım</h3>
            <p>İsim ve tarih detaylarıyla tamamen size özel hazırlanan zarif hediyelikler.</p>
            <h3>Premium Kalite</h3>
            <p>Seçkin malzemeler ve özenli işçilik ile uzun süre saklanabilecek hatıralar.</p>
          </div>
        </div>
      </section>
    </>
  );
}
