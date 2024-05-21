import axios from "~/utils/axios";
import { useState, useEffect } from "react";
import usePortal from "react-cool-portal";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "~/hook";
import { sendMessage } from "~/actions/message";
import { startLoading, stopLoading } from "~/actions/loading";
import shortenAirportName from "~/utils/shortenAirportName";
import formatDateTime from "~/utils/formatDateTime";
import UserUpdating from "~/components/UserUpdating";

const schema = yup.object().shape({
    name: yup.string().required("Name is required."),
    email: yup.string().email("Invalid email address.").required("Email is required."),
    password: yup.string().required("Password is required."),
    phoneNumber: yup
        .number()
        .required("Phone number is required.")
        .typeError("Phone number must be a number.")
        .min(10, "Phone number must be exactly 10 digits"),
    address: yup.string().required("Address is required.")
});

function UserAccount() {
    const data = JSON.parse(localStorage.getItem("user")!);
    const [ticketData, setTicketData] = useState<TicketData[]>();
    const [flightData, setFlightData] = useState<FlightScheduleData[]>();
    const [updatingMode, setUpdatingMode] = useState(false);

    const { Portal, hide, show } = usePortal({
        defaultShow: false
    });

    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterValidation>({
        resolver: yupResolver(schema)
    });

    const onSubmit: SubmitHandler<RegisterValidation> = async (formData) => {
        (async () => {
            const name = formData.name;
            const phoneNumber = formData.phoneNumber;
            const email = formData.email;
            const password = formData.password;
            const address = formData.address;

            try {
                await axios.post(
                    "/user/register",
                    {
                        fullname: name,
                        mobile: phoneNumber,
                        email,
                        password,
                        address
                    },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                dispatch(sendMessage("Created successfully!", "success"));
                const timer = setTimeout(() => {
                    window.location.reload();
                }, 2000);
                return () => clearTimeout(timer);
            } catch (error) {
                dispatch(sendMessage("Created failed!", "error"));
                console.error(error);
            }
        })();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(startLoading());

                const ticketResponse = await axios.get(`/user/${data._id}/tickets`);
                setTicketData(ticketResponse.data);

                console.log(ticketResponse.data);

                const flightPromises = ticketResponse.data.map((ticket: TicketData) =>
                    axios.get(`/flight/${ticket.flight_id._id}`)
                );

                const flightResponses = await Promise.all(flightPromises);

                const allFlightData = flightResponses.map((response) => response.data);

                setFlightData(allFlightData);

                dispatch(stopLoading());
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [dispatch, data._id]);

    return (
        <>
            <div className="bg-block p-6 rounded-3xl shadow-xl">
                <div className="grid grid-cols-1 gap-6">
                    <div
                        className={`p-6 rounded-xl overflow-hidden shadow-xl border border-primary bg-background relative`}
                    >
                        <div
                            className={`bg-primary absolute top-0 left-0 right-0 p-2 text-center font-semibold text-base`}
                        >
                            Account Information
                        </div>
                        <div className="absolute top-14 right-6 flex gap-2">
                            <button
                                onClick={() => {
                                    setUpdatingMode(!updatingMode);
                                }}
                                className="hover:bg-primary hover:border-primary rounded-lg border border-blue flex items-center justify-center p-1"
                            >
                                <i className="">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width={24}
                                        height={24}
                                        id="edit"
                                    >
                                        <path
                                            className="fill-white"
                                            d="M5,18H9.24a1,1,0,0,0,.71-.29l6.92-6.93h0L19.71,8a1,1,0,0,0,0-1.42L15.47,2.29a1,1,0,0,0-1.42,0L11.23,5.12h0L4.29,12.05a1,1,0,0,0-.29.71V17A1,1,0,0,0,5,18ZM14.76,4.41l2.83,2.83L16.17,8.66,13.34,5.83ZM6,13.17l5.93-5.93,2.83,2.83L8.83,16H6ZM21,20H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"
                                        ></path>
                                    </svg>
                                </i>
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div>
                                <span className="font-semibold">Full name</span>: {data.fullname}
                            </div>
                            <div>
                                <span className="font-semibold">Email</span>: {data.email}
                            </div>
                            <div>
                                <span className="font-semibold">Phone number</span>: {data.mobile}
                            </div>
                            <div>
                                <span className="font-semibold">Address</span>: {data.address}
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="font-semibold">Purchase:</span>
                            <table className="w-full bg-block mt-4">
                                <thead>
                                    <tr className="text-center bg-primary">
                                        <th className="">Index</th>
                                        <th className="">Passenger name</th>
                                        <th className="">Phone number</th>
                                        <th className="">Flight number</th>
                                        <th className="">Departure</th>
                                        <th className="">Arrival</th>
                                        <th className="">Departure datetime</th>
                                        <th className="">Seating type</th>
                                        <th className="">Price</th>
                                        <th className="">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ticketData &&
                                        flightData?.map((flight, index) => (
                                            <tr key={flight._id} className="text-center">
                                                <td>{index + 1}</td>
                                                <td>
                                                    {
                                                        ticketData.find((ticket) => ticket.flight_id._id === flight._id)
                                                            ?.full_name
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        ticketData.find((ticket) => ticket.flight_id._id === flight._id)
                                                            ?.phone_number
                                                    }
                                                </td>
                                                <td>{flight.flight_number}</td>
                                                <td>{shortenAirportName(flight.departure_airport.name)}</td>
                                                <td>{shortenAirportName(flight.destination_airport.name)}</td>
                                                <td>{formatDateTime(flight.departure_datetime)}</td>
                                                <td>
                                                    {ticketData.find((ticket) => ticket.flight_id._id === flight._id)
                                                        ?.seat_class === "1"
                                                        ? "First class"
                                                        : "Second class"}
                                                </td>
                                                <td>
                                                    {
                                                        ticketData.find((ticket) => ticket.flight_id._id === flight._id)
                                                            ?.price
                                                    }{" "}
                                                    USD
                                                </td>
                                                <td>
                                                    {
                                                        ticketData.find((ticket) => ticket.flight_id._id === flight._id)
                                                            ?.status
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {updatingMode && (
                <UserUpdating
                    email={data.email}
                    fullname={data.fullname}
                    isBlocked={data.isBlocked}
                    address={data.address}
                    mobile={data.mobile}
                />
            )}
        </>
    );
}

export default UserAccount;
