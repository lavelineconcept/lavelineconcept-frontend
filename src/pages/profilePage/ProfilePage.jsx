import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { selectUser, selectIsLoading } from "../../redux/auth/selectors";
import { updateUser } from "../../redux/auth/operations";
import { fetchOrders } from "../../redux/orders/operations";
import { selectOrders, selectIsLoading as selectIsOrdersLoading } from "../../redux/orders/selectors";
import css from "./ProfilePage.module.css";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const isLoading = useSelector(selectIsLoading);
    const orders = useSelector(selectOrders);
    const isOrdersLoading = useSelector(selectIsOrdersLoading);

    const [activeTab, setActiveTab] = useState("info");
    const [isAddingAddress, setIsAddingAddress] = useState(false);

    useEffect(() => {
        if (activeTab === "orders") {
            dispatch(fetchOrders());
        }
    }, [dispatch, activeTab]);

    const infoSchema = Yup.object().shape({
        name: Yup.string().required("Ad gerekli"),
        surname: Yup.string().required("Soyad gerekli"),
    });

    const passwordSchema = Yup.object().shape({
        currentPassword: Yup.string().required("Mevcut şifre gerekli"),
        newPassword: Yup.string()
            .min(6, "Şifre en az 6 karakter olmalı")
            .required("Yeni şifre gerekli"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], "Şifreler eşleşmiyor")
            .required("Şifre onayı gerekli"),
    });

    const addressSchema = Yup.object().shape({
        title: Yup.string().required("Adres başlığı gerekli (örn: Ev, İş)"),
        telephone: Yup.string().required("Telefon numarası gerekli"),
        city: Yup.string().required("Şehir gerekli"),
        district: Yup.string().required("İlçe gerekli"),
        address: Yup.string().required("Açık adres gerekli"),
    });

    const handleInfoSubmit = (values) => {
        dispatch(updateUser({ id: user._id, data: values }))
            .unwrap()
            .then(() => toast.success("Bilgiler güncellendi"))
            .catch((err) => toast.error(err));
    };

    const handlePasswordSubmit = (values, { resetForm }) => {
        dispatch(updateUser({
            id: user._id, data: {
                currentPassword: values.currentPassword,
                password: values.newPassword
            }
        }))
            .unwrap()
            .then(() => {
                toast.success("Şifre başarıyla değiştirildi");
                resetForm();
            })
            .catch((err) => toast.error(err));
    };

    const handleAddressSubmit = (values, { resetForm }) => {
        const newAddresses = [...(user.addresses || []), values];
        dispatch(updateUser({ id: user._id, data: { addresses: newAddresses } }))
            .unwrap()
            .then(() => {
                toast.success("Adres eklendi");
                resetForm();
                setIsAddingAddress(false);
            })
            .catch((err) => toast.error(err));
    };

    const handleDeleteAddress = (index) => {
        const newAddresses = user.addresses.filter((_, i) => i !== index);
        dispatch(updateUser({ id: user._id, data: { addresses: newAddresses } }))
            .unwrap()
            .then(() => toast.success("Adres silindi"))
            .catch((err) => toast.error(err));
    };

    const renderContent = () => {
        switch (activeTab) {
            case "info":
                return (
                    <div className={css.section}>
                        <h2 className={css.sectionTitle}>Kişisel Bilgiler</h2>
                        <Formik
                            initialValues={{
                                name: user?.name || "",
                                surname: user?.surname || "",
                                email: user?.email || "",
                                telephone: user?.telephone || ""
                            }}
                            validationSchema={infoSchema}
                            onSubmit={handleInfoSubmit}
                            enableReinitialize
                        >
                            {() => (
                                <Form className={css.form}>
                                    <div className={css.row}>
                                        <div className={css.fieldGroup}>
                                            <label>Ad</label>
                                            <Field name="name" className={css.input} />
                                            <ErrorMessage name="name" component="div" className={css.error} />
                                        </div>
                                        <div className={css.fieldGroup}>
                                            <label>Soyad</label>
                                            <Field name="surname" className={css.input} />
                                            <ErrorMessage name="surname" component="div" className={css.error} />
                                        </div>
                                    </div>
                                    <div className={css.fieldGroup}>
                                        <label>Telefon</label>
                                        <Field name="telephone" className={css.input} placeholder="05xx xxx xx xx" />
                                    </div>
                                    <div className={css.fieldGroup}>
                                        <label>E-posta (Değiştirilemez)</label>
                                        <Field name="email" className={css.input} disabled />
                                    </div>
                                    <button type="submit" className={css.submitBtn} disabled={isLoading}>
                                        Bilgilerimi Güncelle
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                );
            case "password":
                return (
                    <div className={css.section}>
                        <h2 className={css.sectionTitle}>Şifre Değiştirme</h2>
                        <Formik
                            initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
                            validationSchema={passwordSchema}
                            onSubmit={handlePasswordSubmit}
                        >
                            {() => (
                                <Form className={css.form}>
                                    <div className={css.fieldGroup}>
                                        <label>Mevcut Şifre</label>
                                        <Field name="currentPassword" type="password" className={css.input} />
                                        <ErrorMessage name="currentPassword" component="div" className={css.error} />
                                    </div>
                                    <div className={css.fieldGroup}>
                                        <label>Yeni Şifre</label>
                                        <Field name="newPassword" type="password" className={css.input} />
                                        <ErrorMessage name="newPassword" component="div" className={css.error} />
                                    </div>
                                    <div className={css.fieldGroup}>
                                        <label>Yeni Şifre (Tekrar)</label>
                                        <Field name="confirmPassword" type="password" className={css.input} />
                                        <ErrorMessage name="confirmPassword" component="div" className={css.error} />
                                    </div>
                                    <button type="submit" className={css.submitBtn} disabled={isLoading}>
                                        Şifreyi Güncelle
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                );
            case "address":
                return (
                    <div className={css.section}>
                        <h2 className={css.sectionTitle}>Adres Bilgilerim</h2>

                        {!isAddingAddress ? (
                            <>
                                <button
                                    className={css.addBtnToggle}
                                    onClick={() => setIsAddingAddress(true)}
                                >
                                    + Yeni Adres Ekle
                                </button>

                                <div className={css.addressList}>
                                    {(!user?.addresses || user.addresses.length === 0) ? (
                                        <p className={css.emptyText}>Henüz bir adres eklemediniz.</p>
                                    ) : (
                                        user.addresses.map((addr, index) => (
                                            <div key={index} className={css.addressCard}>
                                                <div className={css.addressCardHeader}>
                                                    <h3 className={css.addressCardTitle}>{addr.title}</h3>
                                                    <button
                                                        className={css.deleteBtn}
                                                        onClick={() => handleDeleteAddress(index)}
                                                    >
                                                        Sil
                                                    </button>
                                                </div>
                                                <div className={css.addressInfo}>
                                                    <p className={css.addressText}>{addr.address}</p>
                                                    <p className={css.addressText}>{addr.district} / {addr.city}</p>
                                                    <p className={css.addressPhone}>📞 {addr.telephone}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        ) : (
                            <Formik
                                initialValues={{
                                    title: "",
                                    telephone: user?.telephone || "",
                                    city: "",
                                    district: "",
                                    address: ""
                                }}
                                validationSchema={addressSchema}
                                onSubmit={handleAddressSubmit}
                            >
                                {() => (
                                    <Form className={css.form}>
                                        <div className={css.fieldGroup}>
                                            <label>Adres Başlığı</label>
                                            <Field name="title" className={css.input} placeholder="Örn: Ev, İş" />
                                            <ErrorMessage name="title" component="div" className={css.error} />
                                        </div>
                                        <div className={css.fieldGroup}>
                                            <label>Telefon</label>
                                            <Field name="telephone" className={css.input} placeholder="05xx xxx xx xx" />
                                            <ErrorMessage name="telephone" component="div" className={css.error} />
                                        </div>
                                        <div className={css.row}>
                                            <div className={css.fieldGroup}>
                                                <label>Şehir</label>
                                                <Field name="city" className={css.input} />
                                                <ErrorMessage name="city" component="div" className={css.error} />
                                            </div>
                                            <div className={css.fieldGroup}>
                                                <label>İlçe</label>
                                                <Field name="district" className={css.input} />
                                                <ErrorMessage name="district" component="div" className={css.error} />
                                            </div>
                                        </div>
                                        <div className={css.fieldGroup}>
                                            <label>Açık Adres</label>
                                            <Field as="textarea" name="address" className={`${css.input} ${css.textarea}`} />
                                            <ErrorMessage name="address" component="div" className={css.error} />
                                        </div>
                                        <div className={css.formFooter}>
                                            <button type="submit" className={css.submitBtn} disabled={isLoading}>
                                                Adresi Kaydet
                                            </button>
                                            <button
                                                type="button"
                                                className={css.cancelBtn}
                                                onClick={() => setIsAddingAddress(false)}
                                            >
                                                İptal
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        )}
                    </div>
                );
            case "orders":
                return (
                    <div className={css.section}>
                        <h2 className={css.sectionTitle}>Sipariş Geçmişi</h2>
                        {isOrdersLoading ? (
                            <p className={css.loadingText}>Yükleniyor...</p>
                        ) : orders.length === 0 ? (
                            <p className={css.emptyText}>Henüz bir siparişiniz bulunmuyor.</p>
                        ) : (
                            <div className={css.ordersContainer}>
                                {orders.map((order) => (
                                    <div key={order._id} className={css.orderCard}>
                                        <div className={css.orderHeader}>
                                            <div className={css.headerItem}>
                                                <p className={css.orderLabel}>Tarih</p>
                                                <p className={css.orderValue}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className={css.headerItem}>
                                                <p className={css.orderLabel}>Tutar</p>
                                                <p className={css.orderValue}>{order.totalPrice.toFixed(2)} TL</p>
                                            </div>
                                            <div className={css.headerItem}>
                                                <p className={css.orderLabel}>Durum</p>
                                                <span className={`${css.status} ${css[`status_${order.status.toLowerCase()}`]}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className={css.headerItem}>
                                                <p className={css.orderLabel}>No</p>
                                                <p className={css.orderValue}>#{order._id.slice(-6)}</p>
                                            </div>
                                        </div>
                                        <div className={css.orderItems}>
                                            {order.items.map((item, i) => (
                                                <div key={i} className={css.orderItem}>
                                                    <span className={css.itemName}>{item.productId?.title || "Ürün"} (x{item.quantity})</span>
                                                    <span className={css.itemPrice}>{item.price.toFixed(2)} TL</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={css.container}>
            <header className={css.header}>
                <h1 className={css.title}>Hesabım</h1>
                <p className={css.subtitle}>Hoş geldin, {user?.name}</p>
            </header>

            <div className={css.layout}>
                <aside className={css.sidebar}>
                    <nav className={css.menu}>
                        <button
                            className={`${css.menuItem} ${activeTab === 'info' ? css.activeItem : ''}`}
                            onClick={() => setActiveTab('info')}
                        >
                            Kişisel Bilgiler
                        </button>
                        <button
                            className={`${css.menuItem} ${activeTab === 'password' ? css.activeItem : ''}`}
                            onClick={() => setActiveTab('password')}
                        >
                            Şifre Değiştir
                        </button>
                        <button
                            className={`${css.menuItem} ${activeTab === 'address' ? css.activeItem : ''}`}
                            onClick={() => setActiveTab('address')}
                        >
                            Adres Bilgilerim
                        </button>
                        <button
                            className={`${css.menuItem} ${activeTab === 'orders' ? css.activeItem : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            Siparişlerim
                        </button>
                    </nav>
                </aside>

                <main className={css.content}>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;
