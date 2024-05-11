import { Routes, Route } from "react-router-dom";
import "./index.css";
import Layout from "./layouts/Layout";
import Login from "./pages/Login";
import AdministratorRoutes from "./components/AdministratorRoutes";
import { useEffect } from "react";
import { useAppSelector } from "./hook";
import { toast } from "react-toastify";
import FlightSchedule from "./pages/FlightSchedule";
import TicketSales from "./pages/TicketSales";
import Dashboard from "./pages/Dashboard";
import FlightBooking from "./pages/FlightBooking";
import FlightLookup from "./pages/FlightLookup";
import Regulations from "./pages/Regulations";
import FlightList from "./pages/FlightList";
import Register from "./pages/Register";
import Airports from "./pages/Airports";
import UserRoutes from "./components/UserRoutes";
import AdminRoutes from "./components/AdminRoutes";
import Users from "./pages/Users";

function App() {
    const root = document.querySelector("#root");
    const { isLoading } = useAppSelector((state) => state.loading!);
    const { message } = useAppSelector((state) => state.message!);

    useEffect(() => {
        if (isLoading) {
            root?.classList.add("brightness-50");
        } else {
            root?.classList.remove("brightness-50");
        }
    }, [isLoading, root?.classList]);

    useEffect(() => {
        if (message !== "") {
            toast(message);
        }
    }, [message]);

    return (
        <Routes>
            <Route path="/administrator/login" element={<Login />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="/user/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
                <Route path="/administrator" element={<AdministratorRoutes />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/administrator/flight-schedule" element={<FlightSchedule />} />
                    <Route path="/administrator/ticket-sales" element={<TicketSales />} />
                    <Route path="/administrator/flight-booking" element={<FlightBooking />} />
                    <Route path="/administrator/flight-lookup" element={<FlightLookup />} />
                    <Route path="/administrator/airport" element={<Airports />} />
                    <Route path="/administrator/regulations" element={<Regulations />} />
                    <Route path="/administrator/flight-list" element={<FlightList />} />
                    <Route path="/administrator/users" element={<Users />} />
                </Route>
                <Route path="/admin" element={<AdminRoutes />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/admin/ticket-sales" element={<TicketSales />} />
                    <Route path="/admin/flight-booking" element={<FlightBooking />} />
                    <Route path="/admin/flight-lookup" element={<FlightLookup />} />
                    <Route path="/admin/airport" element={<Airports />} />
                    <Route path="/admin/flight-list" element={<FlightList />} />
                </Route>
                <Route path="/user" element={<UserRoutes />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/user/ticket-sales" element={<TicketSales />} />
                    <Route path="/user/flight-booking" element={<FlightBooking />} />
                    <Route path="/user/flight-lookup" element={<FlightLookup />} />
                    <Route path="/user/airport" element={<Airports />} />
                    <Route path="/user/flight-list" element={<FlightList />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
