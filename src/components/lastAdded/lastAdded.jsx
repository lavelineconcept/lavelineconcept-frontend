import css from "./lastAdded.module.css";

export default function LastAdded() {
    return (
        <>
            <section className={css.lastAddedSection}>
                <h2 className={css.title}>Son Eklenenler</h2>
                <div className={css.productList}>
                    {/* Ürün kartları burada yer alacak */}
                </div>
            </section>
        </>
    );
}