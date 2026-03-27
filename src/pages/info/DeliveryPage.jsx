import css from "./DeliveryPage.module.css";

export const DeliveryPage = () => {
    return (
        <div className={css.page}>
            <div className={css.content}>
                <h1 className={css.title}>Teslimat ve İadeler</h1>

                <p className={css.intro}>
                    Bu sayfa, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında bilgilendirme amacıyla hazırlanmıştır.
                </p>

                <section className={css.section}>
                    <h2>Teslimat Koşulları</h2>
                    <p>Siparişleriniz, ödeme onayının alınmasının ardından 1–3 iş günü içerisinde kargoya teslim edilir. Teslimat süresi, alıcının bulunduğu lokasyona ve kargo firmasına bağlı olarak değişiklik gösterebilir.</p>
                    <p>Gönderimler, satıcı tarafından belirlenen anlaşmalı kargo firmaları aracılığıyla yapılır. Teslimatlar yalnızca Türkiye Cumhuriyeti sınırları içerisinde gerçekleştirilmektedir.</p>
                    <p>Kargo ücreti, sipariş aşamasında kullanıcıya açıkça bildirilir. Kampanya dönemlerinde ücretsiz kargo uygulaması yapılabilir.</p>
                </section>

                <section className={css.section}>
                    <h2>Cayma Hakkı (Mesafeli Satışlara İlişkin)</h2>
                    <p>Tüketici, hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin, ürünü teslim aldığı tarihten itibaren 14 (ondört) gün içerisinde cayma hakkını kullanabilir.</p>
                    <p>Cayma hakkının kullanılması için bu süre içinde satıcıya yazılı bildirim yapılması gerekmektedir.</p>
                </section>

                <section className={css.section}>
                    <h2>Cayma Hakkının Kullanılamayacağı Ürünler</h2>
                    <p>Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesi uyarınca aşağıdaki ürünlerde cayma hakkı kullanılamaz:</p>
                    <ul className={css.list}>
                        <li>Tüketicinin istekleri doğrultusunda kişiye özel hazırlanan ürünler</li>
                        <li>Hijyenik nedenlerle iadesi uygun olmayan ürünler</li>
                        <li>Ambalajı açılmış, kullanılmış veya tekrar satılabilirliğini kaybetmiş ürünler</li>
                    </ul>
                </section>

                <section className={css.section}>
                    <h2>İade Şartları</h2>
                    <p>İade edilecek ürünün;</p>
                    <ul className={css.list}>
                        <li>Kullanılmamış olması</li>
                        <li>Orijinal ambalajı, aksesuarları ve faturası ile birlikte gönderilmesi</li>
                        <li>Yeniden satılabilirliğini kaybetmemiş olması</li>
                    </ul>
                    <p>gerekmektedir.</p>
                    <p>İade edilen ürün tarafımıza ulaştıktan sonra kontrol edilir ve şartlara uygun olması halinde iade süreci başlatılır.</p>
                </section>

                <section className={css.section}>
                    <h2>Ücret İadesi</h2>
                    <p>İade onayının ardından ürün bedeli, 14 gün içerisinde ödeme yapılan yöntemle tüketiciye iade edilir. Banka kaynaklı gecikmelerden satıcı sorumlu değildir.</p>
                </section>

                <section className={css.section}>
                    <h2>İade Kargo Ücreti</h2>
                    <p>Hatalı, ayıplı veya yanlış gönderilen ürünlerde iade kargo ücreti satıcıya aittir.</p>
                    <p>Cayma hakkı kapsamında yapılan iadelerde kargo ücreti tüketiciye ait olabilir (mesafeli satış sözleşmesinde belirtilmişse).</p>
                </section>

                <section className={css.section}>
                    <h2>Hasarlı veya Eksik Ürünler</h2>
                    <p>Teslimat sırasında kargo paketi kontrol edilmelidir. Hasarlı ürünlerde kargo görevlisine hasar tespit tutanağı tutturulması zorunludur.</p>
                    <p>Eksik veya yanlış ürünlerde, teslimat tarihinden itibaren 48 saat içinde satıcıyla iletişime geçilmelidir.</p>
                </section>
            </div>
        </div>
    );
};

export default DeliveryPage;
