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

    const handleCancelTicket = async (id: string) => {
        dispatch(startLoading());
        await axios
            .patch(
                `/request-reservations/${id}/cancel`,
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
                }, 1000);
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
            <div className="bg-block p-6 rounded-3xl shadow-xl">
                <div className="grid grid-cols-1 gap-6">
                    {ticketData &&
                        flightData?.map((flight, index) => (
                            <div
                                key={ticketData[index]._id}
                                className={`p-6 rounded-xl overflow-hidden shadow-xl border ${
                                    ticketData
                                        .filter((ticket) => ticket.flight_id._id === flight._id)
                                        .find((ticket) => ticket._id === ticketData[index]._id)?.status === "Paid"
                                        ? "border-green"
                                        : ticketData
                                                .filter((ticket) => ticket.flight_id._id === flight._id)
                                                .find((ticket) => ticket._id === ticketData[index]._id)?.status ===
                                            "Booked"
                                          ? "border-primary"
                                          : "border-mdRed"
                                } bg-background relative`}
                            >
                                <div
                                    className={`${
                                        ticketData
                                            .filter((ticket) => ticket.flight_id._id === flight._id)
                                            .find((ticket) => ticket._id === ticketData[index]._id)?.status === "Paid"
                                            ? "bg-green"
                                            : ticketData
                                                    .filter((ticket) => ticket.flight_id._id === flight._id)
                                                    .find((ticket) => ticket._id === ticketData[index]._id)?.status ===
                                                "Booked"
                                              ? "bg-primary"
                                              : "bg-mdRed"
                                    } absolute top-0 left-0 right-0 p-2 text-center font-semibold text-base`}
                                >
                                    Flight Ticket
                                </div>
                                {ticketData
                                    .filter((ticket) => ticket.flight_id._id === flight._id)
                                    .find((ticket) => ticket._id === ticketData[index]._id)?.status === "Booked" && (
                                    <div className="absolute top-14 right-6 flex gap-2">
                                        <button
                                            onClick={() => {
                                                handleCancelTicket(ticketData[index]._id);
                                            }}
                                            className="hover:bg-primary hover:border-primary rounded-lg border border-blue flex items-center justify-center p-1"
                                        >
                                            <i className="">
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
                                        </button>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <div>
                                        <span className="font-semibold">Passenger name</span>:{" "}
                                        {
                                            ticketData
                                                .filter((ticket) => ticket.flight_id._id === flight._id)
                                                .find((ticket) => ticket._id === ticketData[index]._id)?.full_name
                                        }
                                    </div>
                                    <div>
                                        <span className="font-semibold">Identification number</span>:{" "}
                                        {
                                            ticketData
                                                .filter((ticket) => ticket.flight_id._id === flight._id)
                                                .find((ticket) => ticket._id === ticketData[index]._id)?.CMND
                                        }
                                    </div>
                                    <div>
                                        <span className="font-semibold">Phone number</span>:{" "}
                                        {
                                            ticketData
                                                .filter((ticket) => ticket.flight_id._id === flight._id)
                                                .find((ticket) => ticket._id === ticketData[index]._id)?.phone_number
                                        }
                                    </div>
                                    <div>
                                        <span className="font-semibold">Flight number</span>: {flight.flight_number}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Departure airport</span>:{" "}
                                        {shortenAirportName(flight.departure_airport.name)}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Arrival airport</span>:{" "}
                                        {shortenAirportName(flight.destination_airport.name)}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Departure date & time</span>:{" "}
                                        {formatDateTime(flight.departure_datetime)}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Seating type</span>:{" "}
                                        {ticketData
                                            .filter((ticket) => ticket.flight_id._id === flight._id)
                                            .find((ticket) => ticket._id === ticketData[index]._id)?.seat_class === "1"
                                            ? "First class"
                                            : "Second class"}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Price</span>:{" "}
                                        {
                                            ticketData
                                                .filter((ticket) => ticket.flight_id._id === flight._id)
                                                .find((ticket) => ticket._id === ticketData[index]._id)?.price
                                        }{" "}
                                        USD
                                    </div>
                                    <div>
                                        <span className="font-semibold">Status</span>:{" "}
                                        {
                                            ticketData
                                                .filter((ticket) => ticket.flight_id._id === flight._id)
                                                .find((ticket) => ticket._id === ticketData[index]._id)?.status
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}

export default UserTickets;
