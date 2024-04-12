import { Routes, Route } from "react-router-dom";
import "./index.css";
import Layout from "./layouts/Layout";
import Movies from "./pages/Movies";
import Movie from "./pages/Movie";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect } from "react";
import { useAppSelector } from "./hook";
import { toast } from "react-toastify";
import Actors from "./pages/Actors";
import Actor from "./pages/Actor";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Theaters from "./pages/Theaters";
import Theater from "./pages/Theater";
import Shows from "./pages/Shows";
import Show from "./pages/Show";
import Bookings from "./pages/Bookings";
import Booking from "./pages/Booking";
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
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute />}>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Movies />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/movies/:id" element={<Movie />} />
                    <Route path="/actors" element={<Actors />} />
                    <Route path="/actors/:id" element={<Actor />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/news/:id" element={<NewsDetail />} />
                    <Route path="/theaters" element={<Theaters />} />
                    <Route path="/theaters/:id" element={<Theater />} />
                    <Route path="/shows" element={<Shows />} />
                    <Route path="/shows/:id" element={<Show />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="bookings/:id" element={<Booking />} />
                    <Route path="/users" element={<Users />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
