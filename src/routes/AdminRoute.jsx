import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn, selectIsRefreshing, selectIsAdmin } from "../redux/auth/selectors";

/**
 * Restricted to admins only.
 * If not logged in, redirects to login.
 * If logged in but not admin, redirects to home/products.
 */
const AdminRoute = ({ children, redirectTo = "/products" }) => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const isRefreshing = useSelector(selectIsRefreshing);
    const isAdmin = useSelector(selectIsAdmin);

    const shouldRedirect = !isRefreshing && (!isLoggedIn || !isAdmin);

    return shouldRedirect ? <Navigate to={redirectTo} /> : children;
};

export default AdminRoute;
