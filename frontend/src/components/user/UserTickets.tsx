import axios from "~/utils/axios";
import { useState, useEffect } from "react";
import { useAppDispatch } from "~/hook";
import { sendMessage } from "~/actions/message";
import { startLoading, stopLoading } from "~/actions/loading";
import shortenAirportName from "~/utils/shortenAirportName";
import formatDateTime from "~/utils/formatDateTime";

function UserTickets() {
    const [ticketData, setTicketData] = useState<TicketData[]>();
    const [flightData, setFlightData] = useState<FlightScheduleData[]>();
    const [selectedId, setSelectedId] = useState("");

    const handleCancelTicket = async () => {
        dispatch(startLoading());
        await axios
            .patch(
                `/request-reservations/${selectedId}/cancel`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                }
            )
            .then(() => {
                dispatch(stopLoading());
                dispatch(sendMessage("Canceled successfully!", "success"));
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((error) => {
                console.error(error);
                dispatch(sendMessage("Canceled failed!", "error"));
            });
    };

    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(startLoading());

                const ticketResponse = await axios.get(
                    `/user/${JSON.parse(localStorage.getItem("user")!)._id}/tickets`
                );
                setTicketData(ticketResponse.data);

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
    }, [dispatch]);

    return (
        <>
            <div className="flex justify-end items-center mb-6">
                {selectedId !== "" && (
                    <button
                        onClick={() => {
                            handleCancelTicket();
                        }}
                        className="hover:bg-mdRed hover:border-mdRed bg-block rounded-xl border border-blue flex items-center justify-center p-3"
                    >
                        <i className="mr-[3px]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width={24}
                                height={24}
                                id="cancel"
                            >
                                <path
                                    fill="white"
                                    d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
                                ></path>
                            </svg>
                        </i>
                        Cancel ticket
                    </button>
                )}
            </div>
            <div className="bg-block p-6 rounded-3xl shadow-xl">
                {ticketData && (
                    <table className="w-full bg-block">
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
                                <th className="">Cancel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flightData?.map((flight, index) => (
                                <tr key={ticketData[index]._id} className="text-center">
                                    <td>{index + 1}</td>
                                    <td>
                                        {
                                            ticketData
                                                .filter((ticket) => ticket.flight_id._id === flight._id)
                                                .find((ticket) => ticket._id === ticketData[index]._id)?.full_name
                                        }
                                    </td>
                                    <td>
                                        {
                                            ticketData
                                                .filter((ticket) => ticket.flight_id._id === flight._id)
                                                .find((ticket) => ticket._id === ticketData[index]._id)?.phone_number
                                        }
                                    </td>
                                    <td>{flight.flight_number}</td>
                                    <td>{shortenAirportName(flight.departure_airport.name)}</td>
                                    <td>{shortenAirportName(flight.destination_airport.name)}</td>
                                    <td>{formatDateTime(flight.departure_datetime)}</td>
                                    <td>
                                        {ticketData
                                            .filter((ticket) => ticket.flight_id._id === flight._id)
                                            .find((ticket) => ticket._id === ticketData[index]._id)?.seat_class === "1"
                                            ? "First class"
                                            : "Second class"}
                                    </td>
                                    <td>
                                        {
                                            ticketData
                                                .filter((ticket) => ticket.flight_id._id === flight._id)
                                                .find((ticket) => ticket._id === ticketData[index]._id)?.price
                                        }{" "}
                                        USD
                                    </td>
                                    <td>
                                        {
                                            ticketData
                                                .filter((ticket) => ticket.flight_id._id === flight._id)
                                                .find((ticket) => ticket._id === ticketData[index]._id)?.status
                                        }
                                    </td>
                                    <td className="text-center">
                                        <button
                                            onClick={() => {
                                                if (selectedId === ticketData[index]._id) {
                                                    setSelectedId("");
                                                } else setSelectedId(ticketData[index]._id);
                                            }}
                                            className="hover:border-primary inline-block bg-block rounded-full border border-blue items-center justify-center"
                                        >
                                            <i>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    width={20}
                                                    height={20}
                                                    id="dot"
                                                    className="scale-150"
                                                >
                                                    {selectedId === ticketData[index]._id && (
                                                        <path
                                                            className="fill-blue"
                                                            d="M7.8 10a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0-4.4 0z"
                                                        ></path>
                                                    )}
                                                </svg>
                                            </i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default UserTickets;
