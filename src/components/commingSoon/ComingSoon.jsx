import logo from '../../assets/laveline-yazılı-logo-nobackground.png';
import styles from './ComingSoon.module.css';

const ComingSoon = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <img src={logo} alt="La Véline Concept Logo" className={styles.logoImage} />
                <h1 className={styles.logoText}>La Véline Concept</h1>
            </header>

            <div className={styles.divider}></div>

            <main>
                <h2 className={styles.title}>Çok Yakında Sizlerle</h2>
                <p className={styles.description}>
                    En özel günleriniz için özenle tasarlanan nişan hediyeliklerimizle çok yakında buradayız.
                </p>
                <p className={styles.description}>
                    La Véline Concept - Detaylarda Saklı Zarafet
                </p>

            </main>

            <footer className={styles.footer}>
                <p>© 2026 La Véline Concept. Tüm hakları saklıdır.</p>
            </footer>
        </div>
    );
};

export default ComingSoon;
