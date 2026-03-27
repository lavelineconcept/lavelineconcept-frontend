import css from "./visionMission.module.css";

export default function VisionMission() {
  return (
    <section className={css.visionMissionContainer}>
      <div className={css.card}>
        <h2 className={css.title}>VİZYONUMUZ</h2>
        <p className={css.description}>
          La Véline Concept olarak vizyonumuz; özel gün hediyeliklerinde zarafet, kalite ve kişiselleştirme denildiğinde akla gelen öncü markalardan biri olmaktır.
        </p>
        <p className={css.description}>
          Her tasarımımızla sadece bir ürün değil, yıllar sonra dahi hatırlanacak anlamlı hatıralar sunmayı hedefliyoruz.
        </p>
      </div>

      <div className={css.card}>
        <h2 className={css.title}>MİSYONUMUZ</h2>
        <p className={css.description}>
          Özel günlerinize değer katacak, estetik ve kaliteli tasarımlar üretmek önceliğimizdir.
        </p>
        <p className={css.description}>
          Her bir ürünü özenle tasarlayarak; isim, tarih ve özel detaylarla kişiselleştiriyor, müşterilerimize güvenli alışveriş ve zamanında teslimat garantisi sunuyoruz.
        </p>
      </div>

      <div className={css.card}>
        <h2 className={css.title}>NEDEN BİZİ SEÇMELİSİNİZ?</h2>
        <ul className={css.list}>
          <li>Kişiye Özel Tasarım</li>
          <li>Zarif ve Modern Konsept</li>
          <li>Premium Malzeme Kalitesi</li>
          <li>Güvenli Ödeme</li>
          <li>Türkiye Geneli Kargo</li>
        </ul>
      </div>
    </section>
  );
}