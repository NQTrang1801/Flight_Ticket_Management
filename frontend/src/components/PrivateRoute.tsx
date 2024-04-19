import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "~/hook";

function PrivateRoute() {
    const { isLoggedIn } = useAppSelector((state) => state.auth!);

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
