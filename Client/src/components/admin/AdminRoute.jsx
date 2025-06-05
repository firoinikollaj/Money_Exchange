import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Admin") {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}
