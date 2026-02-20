import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sendPasswordResetEmail } from "../../redux/auth/operations";
import { toast } from "react-hot-toast";
import css from "./ForgotPasswordPage.module.css";

const ForgotPasswordPage = () => {
    const dispatch = useDispatch();
    const [isEmailSent, setIsEmailSent] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Geçerli bir e-posta adresi giriniz")
                .required("E-posta adresi gereklidir"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const resultAction = await dispatch(sendPasswordResetEmail(values.email));
                if (sendPasswordResetEmail.fulfilled.match(resultAction)) {
                    toast.success("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
                    setIsEmailSent(true);
                } else {
                    toast.error(resultAction.payload || "Bir hata oluştu.");
                }
            } catch (error) {
                toast.error("İşlem sırasında bir hata oluştu.");
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (isEmailSent) {
        return (
            <div className={css.container}>
                <div className={css.successCard}>
                    <div className={css.icon}>📧</div>
                    <h1>E-posta Gönderildi!</h1>
                    <p>
                        Şifrenizi sıfırlamanız için gerekli bağlantıyı <strong>{formik.values.email}</strong> adresine gönderdik.
                        Lütfen gelen kutunuzu (ve gereksiz e-posta klasörünü) kontrol edin.
                    </p>
                    <Link to="/login" className={css.loginBtn}>Giriş Sayfasına Dön</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={css.container}>
            <div className={css.card}>
                <h1>Şifremi Unuttum</h1>
                <p>Kayıtlı e-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.</p>

                <form onSubmit={formik.handleSubmit} className={css.form}>
                    <div className={css.inputGroup}>
                        <label htmlFor="email">E-posta Adresi</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="ornek@mail.com"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <span className={css.error}>{formik.errors.email}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={css.submitBtn}
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? "Gönderiliyor..." : "Bağlantı Gönder"}
                    </button>
                </form>

                <div className={css.footer}>
                    <Link to="/login">Giriş yapmaya geri dön</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
