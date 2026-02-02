import { Navigate, useLocation } from "react-router-dom";
import { getAdminSession } from "../services/adminAuthService";

const AdminProtectedRoute = ({ children }) => {
    const session = getAdminSession();
    const location = useLocation();

    if (!session) {
        // Redirect to admin login if not authenticated
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminProtectedRoute;
