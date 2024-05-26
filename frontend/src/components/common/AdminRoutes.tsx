import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "~/hook";

function AdminRoutes() {
    const { isLoggedIn } = useAppSelector((state) => state.auth!);

    return isLoggedIn ? <Outlet /> : <Navigate to="/admin/login" />;
}

export default AdminRoutes;
