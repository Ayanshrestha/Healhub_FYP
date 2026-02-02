import { Navigate } from "react-router-dom";

const PatientProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}") || {};
    const token = localStorage.getItem("token");

    if (!token || user.role !== "patient") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PatientProtectedRoute;
