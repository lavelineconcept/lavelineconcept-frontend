import css from "./ContactPage.module.css";

export const ContactPage = () => {
    return (
        <div className={css.page}>
            <div className={css.content}>
                <h1 className={css.title}>İletişim</h1>

                <p className={css.message}>
                    Tüm soru, görüş, iade, teslimat ve önerileriniz için bize aşağıdaki kanallardan ulaşabilirsiniz.
                </p>

                <div className={css.contactCards}>
                    <a href="mailto:info@lavelineconcept.com" className={css.contactCard}>
                        <div className={css.cardIcon}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </div>
                        <span className={css.cardLabel}>E-posta</span>
                        <span className={css.cardValue}>info@lavelineconcept.com</span>
                    </a>

                    <a href="https://www.instagram.com/lavelineconcept" className={css.contactCard} target="_blank" rel="noopener noreferrer">
                        <div className={css.cardIcon}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </div>
                        <span className={css.cardLabel}>Instagram</span>
                        <span className={css.cardValue}>@lavelineconcept</span>
                    </a>
                </div>

                <p className={css.subtext}>
                    Size en kısa sürede dönüş yapmaktan mutluluk duyacağız.
                </p>
            </div>
        </div>
    );
};

export default ContactPage;
