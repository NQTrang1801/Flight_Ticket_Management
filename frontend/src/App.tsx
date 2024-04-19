import { Routes, Route } from "react-router-dom";
import "./index.css";
import Layout from "./layouts/Layout";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute />}>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/flight-schedule" element={<FlightSchedule />} />
                    <Route path="/ticket-sales" element={<TicketSales />} />
                    <Route path="/flight-booking" element={<FlightBooking />} />
                    <Route path="/flight-lookup" element={<FlightLookup />} />
                    <Route path="/airport" element={<Airports />} />
                    <Route path="/regulations" element={<Regulations />} />
                    <Route path="/flight-list" element={<FlightList />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
