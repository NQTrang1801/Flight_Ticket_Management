import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Layout from "./layouts/Layout";
import Login from "./components/common/Login";
import AdministratorRoutes from "./components/common/AdministratorRoutes";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./hook";
import { toast } from "react-toastify";
import FlightSchedules from "./components/administrator/FlightSchedules";
import Dashboard from "./components/administrator/Dashboard";
import FlightLookup from "./components/administrator/FlightLookup";
import Regulations from "./components/administrator/Regulations";
import Register from "./components/common/Register";
import Airports from "./components/administrator/Airports";
import UserRoutes from "./components/common/UserRoutes";
import AdminRoutes from "./components/common/AdminRoutes";
import Users from "./components/administrator/Users";
import BookingForms from "./components/administrator/BookingForms";
import UserAirports from "./components/user/UserAirports";
import UserAccount from "./components/user/UserAccount";
import AdminPermissionGroups from "./components/admin/AdminPermissionGroups";
import PermissionGroup from "./components/administrator/PermissionGroup";
import axios from "./utils/axios";
import { updatePermissions } from "./actions/permissions";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminFlightSchedules from "./components/admin/AdminFlightSchedules";
import AdminBookingForms from "./components/admin/AdminBookingForms";
import AdminAirports from "./components/admin/AdminAirports";
import AdminRegulations from "./components/admin/AdminRegulations";
import AdminUsers from "./components/admin/AdminUsers";
import AdminPermissionGroup from "./components/admin/AdminPermissionGroup";
import PermissionGroups from "./components/administrator/PermissionGroups";
import UserTickets from "./components/user/UserTickets";
import UserBookingTicket from "./components/user/UserBookingTicket";
import { dismissMessage } from "./actions/message";

function App() {
    const root = document.querySelector("#root");
    const { isLoading } = useAppSelector((state) => state.loading!);
    const { message, type, showToast } = useAppSelector((state) => state.message!);
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
        if (showToast) {
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

        dispatch(dismissMessage());
    }, [message, type, showToast, dispatch]);

    useEffect(() => {
        if (isLoggedIn) {
            const userId = JSON.parse(localStorage.getItem("user")!)._id;
            const userType = JSON.parse(localStorage.getItem("user")!).userType;

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
            if (userType !== "USER") fetchData();
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
                    <Route path="/administrator/flight-schedules" element={<FlightSchedules />} />
                    <Route path="/administrator/flight-lookup" element={<FlightLookup />} />
                    <Route path="/administrator/airports" element={<Airports />} />
                    <Route path="/administrator/regulations" element={<Regulations />} />
                    <Route path="/administrator/booking-forms" element={<BookingForms />} />
                    <Route path="/administrator/users" element={<Users />} />
                    <Route path="/administrator/permission-groups" element={<PermissionGroups />} />
                    <Route path="/administrator/permission-groups/:id" element={<PermissionGroup />} />
                </Route>
                <Route path="/admin" element={<AdminRoutes />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="/admin/flight-schedules" element={<AdminFlightSchedules />} />
                    <Route path="/admin/flight-lookup" element={<FlightLookup />} />
                    <Route path="/admin/airports" element={<AdminAirports />} />
                    <Route path="/admin/booking-forms" element={<AdminBookingForms />} />
                    <Route path="/admin/regulations" element={<AdminRegulations />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/permission-groups" element={<AdminPermissionGroups />} />
                    <Route path="/admin/permission-groups/:id" element={<AdminPermissionGroup />} />
                </Route>
                <Route path="/user" element={<UserRoutes />}>
                    <Route index element={<UserBookingTicket />} />
                    <Route path="/user/airports" element={<UserAirports />} />
                    <Route path="/user/user-account" element={<UserAccount />} />
                    <Route path="/user/tickets" element={<UserTickets />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
