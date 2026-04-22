import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { selectCartItems, selectCartTotalPrice, selectIsGiftWrap } from "../../redux/cart/selectors";
import { createOrder } from "../../redux/orders/operations";
import { clearCart } from "../../redux/cart/operations";
import { clearCartLocal } from "../../redux/cart/slice";
import { selectIsLoggedIn, selectUser } from "../../redux/auth/selectors";
import css from "./CheckoutPage.module.css";
import ImageWithFallback from "../../components/common/ImageWithFallback";
import { toast } from "react-hot-toast";

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(selectCartItems);
    const totalPrice = useSelector(selectCartTotalPrice);
    const isGiftWrap = useSelector(selectIsGiftWrap);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const user = useSelector(selectUser);
    const [isSuccess, setIsSuccess] = useState(false);
    const [threeDSHtml, setThreeDSHtml] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get("status");
        const error = queryParams.get("error");

        if (status === "success") {
            setIsSuccess(true);
            dispatch(clearCart());
            // Clear URL parameters to prevent re-triggering on refresh
            navigate("/checkout", { replace: true });
        } else if (status === "failed") {
            toast.error(error || "Ödeme işlemi başarısız oldu.");
            // Clear URL parameters
            navigate("/checkout", { replace: true });
        }
    }, [location.search, navigate, dispatch]);

    const savedAddresses = user?.addresses || [];
    const hasSavedAddresses = savedAddresses.length > 0;

    // "saved" = kayıtlı adres seçildi, "new" = yeni adres giriliyor
    const [addressMode, setAddressMode] = useState(hasSavedAddresses ? "saved" : "new");
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(hasSavedAddresses ? 0 : -1);

    useEffect(() => {
        if (hasSavedAddresses) {
            setAddressMode("saved");
            setSelectedAddressIndex(0);
        } else {
            setAddressMode("new");
            setSelectedAddressIndex(-1);
        }
    }, [hasSavedAddresses]);

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
            customerNote: "",
        },
        validationSchema: Yup.object({
            street: Yup.string().when([], {
                is: () => addressMode === "new",
                then: (schema) => schema.required("Adres gereklidir"),
                otherwise: (schema) => schema.notRequired(),
            }),
            city: Yup.string().when([], {
                is: () => addressMode === "new",
                then: (schema) => schema.required("Şehir gereklidir"),
                otherwise: (schema) => schema.notRequired(),
            }),
            zip: Yup.string().when([], {
                is: () => addressMode === "new",
                then: (schema) => schema.required("Posta kodu gereklidir"),
                otherwise: (schema) => schema.notRequired(),
            }),
            contactNumber: Yup.string().when([], {
                is: () => addressMode === "new",
                then: (schema) => schema.required("Telefon numarası gereklidir"),
                otherwise: (schema) => schema.notRequired(),
            }),
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

            let address;
            let contactNumber;

            if (addressMode === "saved" && selectedAddressIndex >= 0) {
                const selected = savedAddresses[selectedAddressIndex];
                address = {
                    street: selected.address,
                    city: selected.city,
                    zip: selected.zip || "34000", // Fallback for existing addresses without zip
                    country: "Türkiye",
                };
                contactNumber = selected.telephone;
            } else {
                address = {
                    street: values.street,
                    city: values.city,
                    zip: values.zip,
                    country: values.country,
                };
                contactNumber = values.contactNumber;
            }

            const orderData = {
                paymentMethod: values.paymentMethod,
                address,
                contactNumber,
                isGiftWrap: isGiftWrap,
                customerNote: values.customerNote,
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
                    const result = resultAction.payload;
                    
                    if (result?.paymentResult?.isThreeDS) {
                        // 3D Secure flow
                        // Iyzico threeDSHtmlContent is Base64 encoded, we must decode it first.
                        try {
                            const decodedHtml = atob(result.paymentResult.htmlContent);
                            setThreeDSHtml(decodedHtml);
                        } catch (e) {
                            console.error("Base64 decoding failed:", e);
                            toast.error("3D Secure verisi çözümlenemedi.");
                        }
                        return;
                    }

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

    const handleSelectAddress = (index) => {
        setSelectedAddressIndex(index);
        setAddressMode("saved");
    };

    const handleNewAddress = () => {
        setAddressMode("new");
        setSelectedAddressIndex(-1);
        formik.setFieldValue("street", "");
        formik.setFieldValue("city", "");
        formik.setFieldValue("zip", "");
        formik.setFieldValue("contactNumber", "");
    };

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

                        {hasSavedAddresses && (
                            <div className={css.addressSelection}>
                                <p className={css.addressLabel}>Kayıtlı Adresleriniz</p>
                                <div className={css.addressCards}>
                                    {savedAddresses.map((addr, index) => (
                                        <div
                                            key={index}
                                            className={`${css.addressCard} ${addressMode === "saved" && selectedAddressIndex === index ? css.selectedCard : ""}`}
                                            onClick={() => handleSelectAddress(index)}
                                        >
                                            <div className={css.addressCardRadio}>
                                                <span className={`${css.radioCircle} ${addressMode === "saved" && selectedAddressIndex === index ? css.radioActive : ""}`} />
                                            </div>
                                            <div className={css.addressCardBody}>
                                                <p className={css.addressCardTitle}>{addr.title}</p>
                                                <p className={css.addressCardText}>{addr.address}</p>
                                                <p className={css.addressCardText}>{addr.district} / {addr.city}</p>
                                                <p className={css.addressCardPhone}>📞 {addr.telephone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    className={`${css.newAddressBtn} ${addressMode === "new" ? css.newAddressBtnActive : ""}`}
                                    onClick={handleNewAddress}
                                >
                                    + Farklı bir adres gir
                                </button>
                            </div>
                        )}

                        {(addressMode === "new" || !hasSavedAddresses) && (
                            <div className={css.manualAddress}>
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
                            </div>
                        )}
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
                                        <>
                                            <p className={css.ibanInfo}>IBAN: TR40 0001 0090 1042 2796 0050 02</p>
                                            <p className={css.ibanInfo}>Alıcı: Burcu Aleyna ERTEN</p>
                                        </>
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
                    
                    <section className={css.section}>
                        <h2>Sipariş Notu (İsteğe Bağlı)</h2>
                        <div className={css.inputGroup}>
                            <textarea
                                name="customerNote"
                                placeholder="Siparişinizle ilgili iletmek istediğiniz özel bir notunuz var mı?"
                                rows="3"
                                {...formik.getFieldProps("customerNote")}
                                style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', resize: 'vertical', fontFamily: 'inherit', marginTop: '10px' }}
                            />
                        </div>
                    </section>
                </div>

                <div className={css.rightCol}>
                    <div className={css.orderSummary}>
                        <h3>Sipariş Özeti</h3>
                        <div className={css.itemsScroll}>
                            {items.map(item => (
                                <div key={item._id} className={css.summaryItem}>
                                    <ImageWithFallback src={item.productId?.images?.[0]} alt={item.productId?.title} />
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

            {/* 3D Secure Modal Overlay */}
            {threeDSHtml && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        background: '#fff',
                        width: '90%',
                        maxWidth: '600px',
                        height: '600px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{
                            padding: '15px',
                            borderBottom: '1px solid #ddd',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: '#f9f9f9'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '18px' }}>3D Secure Doğrulama</h3>
                            <button 
                                onClick={() => setThreeDSHtml(null)}
                                style={{
                                    background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer'
                                }}
                            >
                                &times;
                            </button>
                        </div>
                        <iframe 
                            title="3D Secure"
                            srcDoc={threeDSHtml}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
