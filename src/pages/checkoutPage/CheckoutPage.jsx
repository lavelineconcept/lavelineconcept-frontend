import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { selectCartItems, selectCartTotalPrice, selectIsGiftWrap } from "../../redux/cart/selectors";
import { createOrder } from "../../redux/orders/operations";
import { clearCart } from "../../redux/cart/operations";
import { clearCartLocal } from "../../redux/cart/slice";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import css from "./CheckoutPage.module.css";
import { toast } from "react-hot-toast";

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(selectCartItems);
    const totalPrice = useSelector(selectCartTotalPrice);
    const isGiftWrap = useSelector(selectIsGiftWrap);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const [isSuccess, setIsSuccess] = useState(false);

    const shippingCost = totalPrice > 1500 ? 0 : 135;
    const giftWrapCost = isGiftWrap ? 50 : 0;
    const finalTotal = totalPrice + shippingCost + giftWrapCost;

    const formik = useFormik({
        initialValues: {
            street: "",
            city: "",
            zip: "",
            country: "Türkiye",
            contactNumber: "",
            paymentMethod: "Credit Card",
            cardHolderName: "",
            cardNumber: "",
            expireMonth: "",
            expireYear: "",
            cvc: "",
        },
        validationSchema: Yup.object({
            street: Yup.string().required("Adres gereklidir"),
            city: Yup.string().required("Şehir gereklidir"),
            zip: Yup.string().required("Posta kodu gereklidir"),
            contactNumber: Yup.string().required("Telefon numarası gereklidir"),
            paymentMethod: Yup.string().required(),
            cardHolderName: Yup.string().when("paymentMethod", {
                is: "Credit Card",
                then: () => Yup.string().required("Kart üzerindeki isim gereklidir"),
            }),
            cardNumber: Yup.string().when("paymentMethod", {
                is: "Credit Card",
                then: () => Yup.string().matches(/^\d{16}$/, "Geçerli bir kart numarası giriniz (16 hane)").required("Kart numarası gereklidir"),
            }),
            expireMonth: Yup.string().when("paymentMethod", {
                is: "Credit Card",
                then: () => Yup.string().matches(/^(0[1-9]|1[0-2])$/, "AA formatında giriniz").required("Ay gereklidir"),
            }),
            expireYear: Yup.string().when("paymentMethod", {
                is: "Credit Card",
                then: () => Yup.string().matches(/^\d{2}$/, "YY formatında giriniz").required("Yıl gereklidir"),
            }),
            cvc: Yup.string().when("paymentMethod", {
                is: "Credit Card",
                then: () => Yup.string().matches(/^\d{3}$/, "3 hane").required("CVC gereklidir"),
            }),
        }),
        onSubmit: async (values) => {
            if (!isLoggedIn) {
                toast.error("Sipariş vermek için giriş yapmalısınız.");
                navigate("/login", { state: { from: "/checkout" } });
                return;
            }

            const orderData = {
                paymentMethod: values.paymentMethod,
                address: {
                    street: values.street,
                    city: values.city,
                    zip: values.zip,
                    country: values.country,
                },
                contactNumber: values.contactNumber,
                isGiftWrap: isGiftWrap,
            };

            if (values.paymentMethod === "Credit Card") {
                orderData.cardDetails = {
                    cardHolderName: values.cardHolderName,
                    cardNumber: values.cardNumber,
                    expireMonth: values.expireMonth,
                    expireYear: values.expireYear,
                    cvc: values.cvc,
                };
            }

            try {
                const resultAction = await dispatch(createOrder(orderData));
                if (createOrder.fulfilled.match(resultAction)) {
                    toast.success("Sipariş başarıyla oluşturuldu!");
                    dispatch(clearCart());
                    setIsSuccess(true);
                } else {
                    toast.error(resultAction.payload || "Sipariş oluşturulamadı");
                }
            } catch (error) {
                toast.error("Bir hata oluştu");
            }
        },
    });

    if (isSuccess) {
        return (
            <div className={css.successView}>
                <div className={css.successCard}>
                    <div className={css.successIcon}>✓</div>
                    <h2>Tebrikler!</h2>
                    <p>Siparişiniz başarıyla alındı ve hazırlanmaya başlandı.</p>
                    <button onClick={() => navigate("/profile")} className={css.ordersBtn}>
                        Siparişlerimi Görüntüle
                    </button>
                    <button onClick={() => navigate("/")} className={css.homeBtn}>
                        Anasayfaya Dön
                    </button>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={css.emptyState}>
                <h2>Ödeme için sepetinizde ürün bulunmalıdır.</h2>
                <button onClick={() => navigate("/products")}>Ürünlere Göz At</button>
            </div>
        );
    }

    return (
        <div className={css.container}>
            <form onSubmit={formik.handleSubmit} className={css.checkoutForm}>
                <div className={css.leftCol}>
                    <section className={css.section}>
                        <h2>Teslimat Bilgileri</h2>
                        <div className={css.inputGroup}>
                            <label>Adres</label>
                            <input
                                name="street"
                                type="text"
                                placeholder="Sokak, No, Daire"
                                {...formik.getFieldProps("street")}
                            />
                            {formik.touched.street && formik.errors.street && <span className={css.error}>{formik.errors.street}</span>}
                        </div>
                        <div className={css.row}>
                            <div className={css.inputGroup}>
                                <label>Şehir</label>
                                <input
                                    name="city"
                                    type="text"
                                    {...formik.getFieldProps("city")}
                                />
                                {formik.touched.city && formik.errors.city && <span className={css.error}>{formik.errors.city}</span>}
                            </div>
                            <div className={css.inputGroup}>
                                <label>Posta Kodu</label>
                                <input
                                    name="zip"
                                    type="text"
                                    {...formik.getFieldProps("zip")}
                                />
                                {formik.touched.zip && formik.errors.zip && <span className={css.error}>{formik.errors.zip}</span>}
                            </div>
                        </div>
                        <div className={css.inputGroup}>
                            <label>Telefon</label>
                            <input
                                name="contactNumber"
                                type="tel"
                                placeholder="0(xxx) xxx xx xx"
                                {...formik.getFieldProps("contactNumber")}
                            />
                            {formik.touched.contactNumber && formik.errors.contactNumber && <span className={css.error}>{formik.errors.contactNumber}</span>}
                        </div>
                    </section>

                    <section className={css.section}>
                        <h2>Ödeme Yöntemi</h2>
                        <div className={css.paymentMethods}>
                            <label className={`${css.payOption} ${formik.values.paymentMethod === "Credit Card" ? css.active : ""}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Credit Card"
                                    checked={formik.values.paymentMethod === "Credit Card"}
                                    onChange={formik.handleChange}
                                />
                                <span>Kredi / Banka Kartı</span>
                            </label>
                            <label className={`${css.payOption} ${formik.values.paymentMethod === "Bank Transfer" ? css.active : ""}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Bank Transfer"
                                    checked={formik.values.paymentMethod === "Bank Transfer"}
                                    onChange={formik.handleChange}
                                />
                                <div className={css.payText}>
                                    <span>EFT / Havale</span>
                                    {formik.values.paymentMethod === "Bank Transfer" && (
                                        <p className={css.ibanInfo}>IBAN: TR1111 1111 1111 ... (Örnek)</p>
                                    )}
                                </div>
                            </label>
                        </div>

                        {formik.values.paymentMethod === "Credit Card" && (
                            <div className={css.cardDetails}>
                                <div className={css.inputGroup}>
                                    <label>Kart Üzerindeki İsim</label>
                                    <input
                                        name="cardHolderName"
                                        type="text"
                                        {...formik.getFieldProps("cardHolderName")}
                                    />
                                    {formik.touched.cardHolderName && formik.errors.cardHolderName && <span className={css.error}>{formik.errors.cardHolderName}</span>}
                                </div>
                                <div className={css.inputGroup}>
                                    <label>Kart Numarası</label>
                                    <input
                                        name="cardNumber"
                                        type="text"
                                        maxLength="16"
                                        placeholder="xxxx xxxx xxxx xxxx"
                                        {...formik.getFieldProps("cardNumber")}
                                    />
                                    {formik.touched.cardNumber && formik.errors.cardNumber && <span className={css.error}>{formik.errors.cardNumber}</span>}
                                </div>
                                <div className={css.row}>
                                    <div className={css.inputGroup}>
                                        <label>Son Kullanma (AA/YY)</label>
                                        <div className={css.expiryRow}>
                                            <input
                                                name="expireMonth"
                                                type="text"
                                                maxLength="2"
                                                placeholder="AA"
                                                {...formik.getFieldProps("expireMonth")}
                                            />
                                            <span>/</span>
                                            <input
                                                name="expireYear"
                                                type="text"
                                                maxLength="2"
                                                placeholder="YY"
                                                {...formik.getFieldProps("expireYear")}
                                            />
                                        </div>
                                        {(formik.errors.expireMonth || formik.errors.expireYear) && <span className={css.error}>Geçersiz tarih</span>}
                                    </div>
                                    <div className={css.inputGroup}>
                                        <label>CVC</label>
                                        <input
                                            name="cvc"
                                            type="text"
                                            maxLength="3"
                                            placeholder="xxx"
                                            {...formik.getFieldProps("cvc")}
                                        />
                                        {formik.touched.cvc && formik.errors.cvc && <span className={css.error}>{formik.errors.cvc}</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                <div className={css.rightCol}>
                    <div className={css.orderSummary}>
                        <h3>Sipariş Özeti</h3>
                        <div className={css.itemsScroll}>
                            {items.map(item => (
                                <div key={item._id} className={css.summaryItem}>
                                    <img src={item.productId?.images?.[0]} alt={item.productId?.title} />
                                    <div className={css.itemInfo}>
                                        <p className={css.itemTitle}>{item.productId?.title}</p>
                                        <p className={css.itemMeta}>{item.quantity} Adet • {item.productId?.price} TL</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={css.totals}>
                            <div className={css.totalLine}>
                                <span>Ara Toplam</span>
                                <span>{totalPrice.toFixed(2)} TL</span>
                            </div>
                            <div className={css.totalLine}>
                                <span>Kargo</span>
                                <span>{shippingCost === 0 ? "Ücretsiz" : shippingCost.toFixed(2) + " TL"}</span>
                            </div>
                            {isGiftWrap && (
                                <div className={css.totalLine}>
                                    <span>Hediye Paketi</span>
                                    <span>50.00 TL</span>
                                </div>
                            )}
                            <div className={`${css.totalLine} ${css.grandTotal}`}>
                                <span>Toplam</span>
                                <span>{finalTotal.toFixed(2)} TL</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={css.submitBtn}
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? "İşleniyor..." : "SİPARİŞİ TAMAMLA"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;
