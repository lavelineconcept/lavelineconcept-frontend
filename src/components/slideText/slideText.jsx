import css from "./slideText.module.css";

export default function SlideText() {
    const items = [
        "TOPLU SİPARİŞ",
        "LOREM IPSUM DOLOR SIT AMET",
        "YENİ KOLEKSİYON",
        "1500TL ÜZERİ KARGO ÜCRETSİZ",
        "LOREM IPSUM DOLOR SIT AMET",
        "GÜVENLI ÖDEME",
        "EL YAPIMI",
        "LOREM IPSUM DOLOR SIT AMET"
    ];

    // Double the items for a seamless loop
    const displayItems = [...items, ...items, ...items];

    return (
        <section className={css.slideText}>
            <div className={css.brandScroll}>
                {displayItems.map((item, index) => (
                    <div key={index} className={css.brand}>
                        <h1 className={css.title}>{item}</h1>
                        <span className={css.separator}>•</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
