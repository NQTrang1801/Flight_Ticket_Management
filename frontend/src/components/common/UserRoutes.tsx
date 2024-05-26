import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "~/hook";

function UserRoutes() {
    const { isLoggedIn } = useAppSelector((state) => state.auth!);

    return isLoggedIn ? <Outlet /> : <Navigate to="/user/login" />;
}

export default UserRoutes;
