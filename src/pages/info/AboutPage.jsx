import css from "./AboutPage.module.css";

export const AboutPage = () => {
    return (
        <div className={css.page}>
            <div className={css.content}>
                <h1 className={css.title}>Hikayemiz</h1>

                <div className={css.story}>
                    <p>
                        <span className={css.highlight}>La Véline Concept</span>, zarafeti ve özgün tasarımı bir araya getirmek için doğdu.<br />
                        Her şey, kadınların günlük hayatlarında kendilerini özel hissetmeleri gerektiği inancıyla başladı.
                    </p>

                    <p>
                        Koleksiyonlarımızda kaliteli kumaşlar, dikkat çeken detaylar ve zamansız tasarımlar bir arada.<br />
                        Her parça, şıklığı ve konforu bir arada sunar; günlük kullanımdan özel anlara kadar her anınıza eşlik eder.
                    </p>

                    <div className={css.highlight}>La Véline Concept'te her ürün;</div>
                    <ul className={css.features}>
                        <li>✨ özenle tasarlanmış,</li>
                        <li>🧵 kaliteli kumaşlardan üretilmiş,</li>
                        <li>🤍 detaylara verilen önemle hazırlanmıştır.</li>
                    </ul>

                    <p>
                        Modayı takip eden ama zamansız kalan, şık ve rahat tasarımlarla;<br />
                        her kadının gardırobunda vazgeçilmez parçalar oluşturmayı hedefliyoruz.
                    </p>

                    <p className={css.footerNote}>
                        "Zarafet, detaylarda gizlidir."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
