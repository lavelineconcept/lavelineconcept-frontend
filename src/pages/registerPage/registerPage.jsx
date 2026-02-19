import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { registerUser } from "../../redux/auth/operations";
import { selectIsLoading } from "../../redux/auth/selectors";
import css from "./registerPage.module.css";

const validationSchema = Yup.object({
    name: Yup.string().required("Ad zorunludur"),
    surname: Yup.string().required("Soyad zorunludur"),
    email: Yup.string()
        .email("Geçerli bir e-posta adresi giriniz")
        .required("E-posta adresi zorunludur"),
    password: Yup.string()
        .min(6, "Parola en az 6 karakter olmalıdır")
        .required("Parola zorunludur"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Parolalar eşleşmiyor")
        .required("Parola onaylama zorunludur"),
});

export const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(selectIsLoading);

    const formik = useFormik({
        initialValues: {
            name: "",
            surname: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            // confirmPassword field is not needed for backend
            const { confirmPassword, ...registerData } = values;
            const result = await dispatch(registerUser(registerData));

            if (registerUser.fulfilled.match(result)) {
                toast.success("Kayıt başarıyla tamamlandı!");
                navigate("/login");
            } else {
                toast.error(result.payload || "Kayıt yapılamadı");
            }
        },
    });

    return (
        <div className={css.page}>
            <div className={css.card}>
                <h1 className={css.title}>Kayıt Ol</h1>
                <p className={css.subtitle}>La Véline dünyasına katılın</p>

                <form onSubmit={formik.handleSubmit} className={css.form}>
                    <div className={css.row}>
                        <div className={css.field}>
                            <label>Ad</label>
                            <input
                                type="text"
                                name="name"
                                {...formik.getFieldProps("name")}
                                placeholder="Adınız"
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className={css.fieldError}>{formik.errors.name}</div>
                            ) : null}
                        </div>

                        <div className={css.field}>
                            <label>Soyad</label>
                            <input
                                type="text"
                                name="surname"
                                {...formik.getFieldProps("surname")}
                                placeholder="Soyadınız"
                            />
                            {formik.touched.surname && formik.errors.surname ? (
                                <div className={css.fieldError}>{formik.errors.surname}</div>
                            ) : null}
                        </div>
                    </div>

                    <div className={css.field}>
                        <label>E-posta Adresi</label>
                        <input
                            type="email"
                            name="email"
                            {...formik.getFieldProps("email")}
                            placeholder="name@example.com"
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className={css.fieldError}>{formik.errors.email}</div>
                        ) : null}
                    </div>

                    <div className={css.field}>
                        <label>Parola</label>
                        <input
                            type="password"
                            name="password"
                            {...formik.getFieldProps("password")}
                            placeholder="Parolanızı oluşturun"
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className={css.fieldError}>{formik.errors.password}</div>
                        ) : null}
                    </div>

                    <div className={css.field}>
                        <label>Parola Onaylama</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            {...formik.getFieldProps("confirmPassword")}
                            placeholder="Parolanızı tekrar girin"
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                            <div className={css.fieldError}>{formik.errors.confirmPassword}</div>
                        ) : null}
                    </div>

                    <button type="submit" className={css.submitBtn} disabled={isLoading}>
                        {isLoading ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
                    </button>
                </form>

                <p className={css.switch}>
                    Zaten hesabınız var mı? <Link to="/login">Buradan giriş yapın</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
