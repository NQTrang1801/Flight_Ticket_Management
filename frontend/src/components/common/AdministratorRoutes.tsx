import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "~/hook";

function AdministratorRoutes() {
    const { isLoggedIn } = useAppSelector((state) => state.auth!);

    return isLoggedIn ? <Outlet /> : <Navigate to="/administrator/login" />;
}

export default AdministratorRoutes;
