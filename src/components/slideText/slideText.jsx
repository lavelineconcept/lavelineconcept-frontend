import css from "./slideText.module.css";

export default function SlideText() {
    const items = [
        "– La Véline Concept –    Zarif, kişiye özel ve premium nişan hediyelikleri ile en özel anlarınızı unutulmaz hatıralara dönüştürüyoruz",
        "– La Véline Concept –    Zarif, kişiye özel ve premium nişan hediyelikleri ile en özel anlarınızı unutulmaz hatıralara dönüştürüyoruz",
        "– La Véline Concept –    Zarif, kişiye özel ve premium nişan hediyelikleri ile en özel anlarınızı unutulmaz hatıralara dönüştürüyoruz",
        "– La Véline Concept –    Zarif, kişiye özel ve premium nişan hediyelikleri ile en özel anlarınızı unutulmaz hatıralara dönüştürüyoruz",
        "– La Véline Concept –    Zarif, kişiye özel ve premium nişan hediyelikleri ile en özel anlarınızı unutulmaz hatıralara dönüştürüyoruz",
        "– La Véline Concept –    Zarif, kişiye özel ve premium nişan hediyelikleri ile en özel anlarınızı unutulmaz hatıralara dönüştürüyoruz"
    ];

    const content = (
        <div className={css.brandGroup}>
            {items.map((item, index) => (
                <div key={index} className={css.brand}>
                    <h1 className={css.title}>{item}</h1>
                </div>
            ))}
        </div>
    );

    return (
        <section className={css.slideText}>
            <div className={css.brandScroll}>
                {content}
                {content}
            </div>
        </section>
    );
}
