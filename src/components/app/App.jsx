import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import RestrictedRoute from "../../routes/RestrictedRoute";
import PrivateRoute from "../../routes/PrivateRoute";
import AdminRoute from "../../routes/AdminRoute";



import Navigation from "../navigation/navigation";
import Footer from "../footer/footer";

const HomePage = lazy(() => import("../../pages/homePage/HomePage"));
const LoginPage = lazy(() => import("../../pages/loginPage/loginPage"));
const RegisterPage = lazy(() => import('../../pages/registerPage/registerPage'));
const ProfilePage = lazy(() => import('../../pages/profilePage/ProfilePage'));
const ProductDetailsPage = lazy(() => import('../../pages/productDetailsPage/ProductDetailsPage'));
const ProductsPage = lazy(() => import('../../pages/productsPage/ProductsPage'));
const AdminPage = lazy(() => import('../../pages/adminPage/AdminPage'));
const CartPage = lazy(() => import('../../pages/cartPage/CartPage'));
const CheckoutPage = lazy(() => import('../../pages/checkoutPage/CheckoutPage'));

const App = () => {
  return (
    <div className={css.appContainer}>
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
        </Routes>
      </Suspense>
      <Footer />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;
