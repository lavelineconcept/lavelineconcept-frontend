import { Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import RestrictedRoute from "../../routes/RestrictedRoute";
import PrivateRoute from "../../routes/PrivateRoute";
import AdminRoute from "../../routes/AdminRoute";
import { refreshUser, setAuthHeader } from "../../redux/auth/operations";
import { selectIsLoggedIn } from "../../redux/auth/selectors";

import Navigation from "../navigation/navigation";
import Footer from "../footer/footer";
import ScrollToTop from "../ScrollToTop/ScrolltoTop";

const HomePage = lazy(() => import("../../pages/homePage/HomePage"));
const LoginPage = lazy(() => import("../../pages/loginPage/loginPage"));
const RegisterPage = lazy(() => import('../../pages/registerPage/registerPage'));
const ProfilePage = lazy(() => import('../../pages/profilePage/ProfilePage'));
const ProductDetailsPage = lazy(() => import('../../pages/productDetailsPage/ProductDetailsPage'));
const ProductsPage = lazy(() => import('../../pages/productsPage/ProductsPage'));
const AdminPage = lazy(() => import('../../pages/adminPage/AdminPage'));
const CartPage = lazy(() => import('../../pages/cartPage/CartPage'));
const CheckoutPage = lazy(() => import('../../pages/checkoutPage/CheckoutPage'));
const ForgotPasswordPage = lazy(() => import('../../pages/forgotPasswordPage/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../../pages/resetPasswordPage/ResetPasswordPage'));
const AboutPage = lazy(() => import('../../pages/info/AboutPage'));
const ContactPage = lazy(() => import('../../pages/info/ContactPage'));
const DeliveryPage = lazy(() => import('../../pages/info/DeliveryPage'));
const PrivacyPolicyPage = lazy(() => import('../../pages/info/PrivacyPolicyPage'));
const DistanceSalesAgreementPage = lazy(() => import('../../pages/info/DistanceSalesAgreementPage'));

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (isLoggedIn && token) {
      // Persist'ten gelen token'ı axis header'a set et
      setAuthHeader(token);
      // Sonra refresh ile yeni token al (cookie varsa çalışır, yoksa mevcut token kullanılır)
      dispatch(refreshUser());
    }
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={css.appContainer}>
      <ScrollToTop />
      <Navigation />
      <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Yükleniyor...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <RestrictedRoute redirectTo="/">
                <LoginPage />
              </RestrictedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <RestrictedRoute redirectTo="/">
                <RegisterPage />
              </RestrictedRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <RestrictedRoute redirectTo="/">
                <ForgotPasswordPage />
              </RestrictedRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <RestrictedRoute redirectTo="/">
                <ResetPasswordPage />
              </RestrictedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:productId" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <CheckoutPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute redirectTo="/">
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/distance-sales-agreement" element={<DistanceSalesAgreementPage />} />
        </Routes>
      </Suspense>
      <Footer />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;

