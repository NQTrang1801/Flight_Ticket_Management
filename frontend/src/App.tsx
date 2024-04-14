import { Routes, Route } from "react-router-dom";
import "./index.css";
import Layout from "./layouts/Layout";
// import Movie from "./pages/Movie";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect } from "react";
import { useAppSelector } from "./hook";
import { toast } from "react-toastify";
// import Actor from "./pages/Actor";
// import News from "./pages/News";
// import NewsDetail from "./pages/NewsDetail";
// import Theaters from "./pages/FlightLookup";
// import Theater from "./pages/Theater";
// import Shows from "./pages/Shows";
// import Show from "./pages/Show";
// import Bookings from "./pages/FlightBooking";
// import Booking from "./pages/Booking";
// import Users from "./pages/Users";
import FlightSchedule from "./pages/FlightSchedule";
import TicketSales from "./pages/TicketSales";
import Dashboard from "./pages/Dashboard";
import FlightBooking from "./pages/FlightBooking";
import FlightLookup from "./pages/FlightLookup";
import Regulations from "./pages/Regulations";
import FlightList from "./pages/FlightList";

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
            <Route path="/" element={<PrivateRoute />}>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/flight-schedule" element={<FlightSchedule />} />
                    {/* <Route path="/movies/:id" element={<Movie />} /> */}
                    <Route path="/ticket-sales" element={<TicketSales />} />
                    {/* <Route path="/actors/:id" element={<Actor />} /> */}
                    <Route path="/flight-booking" element={<FlightBooking />} />
                    {/* <Route path="/news/:id" element={<NewsDetail />} /> */}
                    <Route path="/flight-lookup" element={<FlightLookup />} />
                    {/* <Route path="/theaters/:id" element={<Theater />} /> */}
                    <Route path="/regulations" element={<Regulations />} />
                    <Route path="/flight-list" element={<FlightList />} />
                    {/* <Route path="/shows/:id" element={<Show />} />
                    <Route path="bookings/:id" element={<Booking />} />
                    <Route path="/users" element={<Users />} /> */}
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
