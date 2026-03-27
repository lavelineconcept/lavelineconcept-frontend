import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { resetPassword } from "../../redux/auth/operations";
import { toast } from "react-hot-toast";
import css from "./ResetPasswordPage.module.css";

const ResetPasswordPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); // Assuming token is in query string ?token=...
    // Alternatively, it could be a route param /reset-password/:token. 
    // I'll support both by checking if token exists, if not, maybe it's in the URL path.
    // For now, let's assume query param as it's common for emails.

    const [isSuccess, setIsSuccess] = useState(false);

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(6, "Şifre en az 6 karakter olmalıdır")
                .required("Yeni şifre gereklidir"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor")
                .required("Şifre onayı gereklidir"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            if (!token) {
                toast.error("Geçersiz veya eksik sıfırlama anahtarı (token).");
                return;
            }

            try {
                const resultAction = await dispatch(resetPassword({ token, newPassword: values.password }));
                if (resetPassword.fulfilled.match(resultAction)) {
                    toast.success("Şifreniz başarıyla güncellendi.");
                    setIsSuccess(true);
                    setTimeout(() => navigate("/login"), 3000);
                } else {
                    toast.error(resultAction.payload || "Şifre sıfırlama başarısız oldu.");
                }
            } catch (error) {
                toast.error("Bir hata oluştu.");
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (isSuccess) {
        return (
            <div className={css.container}>
                <div className={css.successCard}>
                    <div className={css.icon}>✅</div>
                    <h1>Şifre Güncellendi!</h1>
                    <p>Yeni şifreniz başarıyla kaydedildi. Giriş sayfasına yönlendiriliyorsunuz...</p>
                    <Link to="/login" className={css.loginBtn}>Giriş Yap</Link>
                </div>
            </div>
        );
    }

    if (!token) {
        return (
            <div className={css.container}>
                <div className={css.errorCard}>
                    <h1>Geçersiz Bağlantı</h1>
                    <p>Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş olabilir. Lütfen tekrar deneyin.</p>
                    <Link to="/forgot-password" className={css.retryBtn}>Yeni Bağlantı İste</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={css.container}>
            <div className={css.card}>
                <h1>Yeni Şifre Belirle</h1>
                <p>Lütfen hesabınız için yeni ve güvenli bir şifre girin.</p>

                <form onSubmit={formik.handleSubmit} className={css.form}>
                    <div className={css.inputGroup}>
                        <label htmlFor="password">Yeni Şifre</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••"
                            {...formik.getFieldProps("password")}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <span className={css.error}>{formik.errors.password}</span>
                        )}
                    </div>

                    <div className={css.inputGroup}>
                        <label htmlFor="confirmPassword">Şifre Tekrar</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••"
                            {...formik.getFieldProps("confirmPassword")}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <span className={css.error}>{formik.errors.confirmPassword}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={css.submitBtn}
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
