import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Layout from "./layouts/Layout";
import Login from "./pages/Login";
import AdministratorRoutes from "./components/AdministratorRoutes";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./hook";
import { toast } from "react-toastify";
import FlightSchedule from "./pages/FlightSchedule";
import Dashboard from "./pages/Dashboard";
import FlightLookup from "./pages/FlightLookup";
import Regulations from "./pages/Regulations";
import Register from "./pages/Register";
import Airports from "./pages/Airports";
import UserRoutes from "./components/UserRoutes";
import AdminRoutes from "./components/AdminRoutes";
import Users from "./pages/Users";
import BookingForms from "./pages/BookingForms";
import BookingTicket from "./pages/BookingTicket";
import UserAirports from "./pages/UserAirports";
import UserAccount from "./pages/UserAccount";
import PermissionGroups from "./pages/PermissionGroups";
import PermissionGroup from "./pages/PermissionGroup";
import axios from "./utils/axios";
import { updatePermissions } from "./actions/permissions";

function App() {
    const root = document.querySelector("#root");
    const { isLoading } = useAppSelector((state) => state.loading!);
    const { message, type } = useAppSelector((state) => state.message!);
    const permissionsRef = useRef(null);

    const dispatch = useAppDispatch();
    const { isLoggedIn } = useAppSelector((state) => state.auth!);

    useEffect(() => {
        if (isLoading) {
            root?.classList.add("brightness-50");
        } else {
            root?.classList.remove("brightness-50");
        }
    }, [isLoading, root?.classList]);

    useEffect(() => {
        if (message !== "") {
            switch (type) {
                case "info":
                    toast.info(message);
                    break;
                case "success":
                    toast.success(message);
                    break;
                case "warning":
                    toast.warning(message);
                    break;
                case "error":
                    toast.error(message);
                    break;
                default:
                    toast(message);
                    break;
            }
        }
    }, [message, type]);

    useEffect(() => {
        if (isLoggedIn) {
            const userId = JSON.parse(localStorage.getItem("user")!)._id;

            const prevPermissions = permissionsRef.current;
            const isPermissionsUpdated = prevPermissions !== null;

            const fetchData = async () => {
                try {
                    const permissionResponse = await axios.get(`/permission/511000000/${userId}/all/`, {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                        }
                    });

                    if (
                        !isPermissionsUpdated ||
                        JSON.stringify(permissionResponse.data) !== JSON.stringify(prevPermissions)
                    ) {
                        dispatch(updatePermissions(permissionResponse.data));
                    }

                    permissionsRef.current = permissionResponse.data;
                } catch (error) {
                    console.error(error);
                }
            };

            fetchData();
        }
    }, [dispatch, isLoggedIn]);

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/user/login" replace />} />
            <Route path="/administrator/login" element={<Login />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="/user/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
                <Route path="/administrator" element={<AdministratorRoutes />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/administrator/flight-schedule" element={<FlightSchedule />} />
                    <Route path="/administrator/flight-lookup" element={<FlightLookup />} />
                    <Route path="/administrator/airports" element={<Airports />} />
                    <Route path="/administrator/regulations" element={<Regulations />} />
                    <Route path="/administrator/booking-forms" element={<BookingForms />} />
                    <Route path="/administrator/users" element={<Users />} />
                    <Route path="/administrator/permission-groups" element={<PermissionGroups />} />
                    <Route path="/administrator/permission-groups/:id" element={<PermissionGroup />} />
                </Route>
                <Route path="/admin" element={<AdminRoutes />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/admin/flight-lookup" element={<FlightLookup />} />
                    <Route path="/admin/airports" element={<Airports />} />
                    <Route path="/admin/booking-forms" element={<BookingForms />} />
                </Route>
                <Route path="/user" element={<UserRoutes />}>
                    <Route index element={<BookingTicket />} />
                    <Route path="/user/airports" element={<UserAirports />} />
                    <Route path="/user/user-account" element={<UserAccount />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
