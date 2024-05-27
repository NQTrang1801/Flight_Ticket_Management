import React from "react";
import { useState, useRef, useEffect } from "react";
import axios from "~/utils/axios";
import usePortal from "react-cool-portal";
import { sendMessage } from "~/actions/message";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import getFormattedDateTime from "~/utils/getFormattedDateTime";
import ScheduleUpdating from "./ScheduleUpdating";

const ScheduleItem: React.FC<FlightScheduleData> = ({
    _id,
    flight_number,
    flight_code,
    departure_airport,
    destination_airport,
    departure_datetime,
    duration,
    seats,
    ticket_price,
    transit_airports,
    rules
}) => {
    const [selectedId, setSelectedId] = useState("");
    const [updatingMode, setUpdatingMode] = useState(false);

    const overlayRef = useRef<HTMLDivElement>(null);
    const { Portal, hide, show } = usePortal({
        defaultShow: false
    });
    const dispatch = useAppDispatch();

    const handleDelete = async () => {
        await axios
            .delete(`/flight/511627641/${selectedId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                }
            })
            .then(() => {
                dispatch(sendMessage("Deleted successfully!", "success"));
                setTimeout(() => window.location.reload(), 1000);
            })
            .catch((error) => {
                dispatch(sendMessage(`Deleted failed! ${error.response.data.message}`, "error"));
                console.error(error);
            });
    };

    useEffect(() => {
        if (selectedId !== "") show();
    }, [selectedId, show]);

    return (
        <>
            <li className="p-6 rounded-xl overflow-hidden shadow-xl border border-primary bg-background relative">
                <div className="bg-primary absolute top-0 left-0 right-0 p-3 text-center font-semibold text-base">
                    Flight Schedule
                </div>
                <div className="absolute top-16 right-6 flex gap-2">
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
                    <button
                        onClick={() => {
                            setSelectedId(_id);
                        }}
                        className="hover:bg-mdRed hover:border-mdRed rounded-lg border border-blue flex items-center justify-center p-1"
                    >
                        <i>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32"
                                width={24}
                                height={24}
                                id="delete"
                            >
                                <path
                                    className="fill-white"
                                    d="M24.2,12.193,23.8,24.3a3.988,3.988,0,0,1-4,3.857H12.2a3.988,3.988,0,0,1-4-3.853L7.8,12.193a1,1,0,0,1,2-.066l.4,12.11a2,2,0,0,0,2,1.923h7.6a2,2,0,0,0,2-1.927l.4-12.106a1,1,0,0,1,2,.066Zm1.323-4.029a1,1,0,0,1-1,1H7.478a1,1,0,0,1,0-2h3.1a1.276,1.276,0,0,0,1.273-1.148,2.991,2.991,0,0,1,2.984-2.694h2.33a2.991,2.991,0,0,1,2.984,2.694,1.276,1.276,0,0,0,1.273,1.148h3.1A1,1,0,0,1,25.522,8.164Zm-11.936-1h4.828a3.3,3.3,0,0,1-.255-.944,1,1,0,0,0-.994-.9h-2.33a1,1,0,0,0-.994.9A3.3,3.3,0,0,1,13.586,7.164Zm1.007,15.151V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Zm4.814,0V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Z"
                                ></path>
                            </svg>
                        </i>
                    </button>
                </div>
                <div className="mt-12 flex flex-col gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <span className="font-semibold">Flight code</span>: {flight_code}
                        </div>
                        <div>
                            <span className="font-semibold">Flight number</span>: {flight_number}
                        </div>
                        <div>
                            <span className="font-semibold">Departure airport</span>: {departure_airport.name}
                        </div>
                        <div>
                            <span className="font-semibold">Arrival airport</span>: {destination_airport.name}
                        </div>

                        <div>
                            <span className="font-semibold">Departure date</span>:{" "}
                            {getFormattedDateTime(departure_datetime).split(" ")[0]}
                        </div>
                        <div>
                            <span className="font-semibold">Departure time</span>:{" "}
                            {getFormattedDateTime(departure_datetime).split(" ")[1]}
                        </div>
                        <div>
                            <span className="font-semibold">Price</span>: {ticket_price} USD
                        </div>
                        <div>
                            <span className="font-semibold">Flight duration</span>: {duration} minutes
                        </div>
                    </div>
                    <span className="font-semibold">Seats:</span>
                    <table className="w-full bg-block">
                        <thead>
                            <tr className="text-center bg-primary">
                                <th className="w-32">Index</th>
                                <th className="w-72">Seating type</th>
                                <th className="w-72">Seating capacity</th>
                                <th>Booked seats</th>
                                <th>Available</th>
                            </tr>
                        </thead>
                        <tbody>
                            {seats.map((seat, index) => (
                                <tr key={seat.class} className="text-center">
                                    <td>{index + 1}</td>
                                    <td>{seat.class === "1" ? "First class" : "Second class"}</td>
                                    <td>{seat.count} seats</td>
                                    <td>{seat.booked_seats} seats</td>
                                    <td>{seat.status === false ? "False" : "True"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <span className="font-semibold">Intermediate airports:</span>
                    {transit_airports.length > 0 && (
                        <table className="w-full bg-block">
                            <thead>
                                <tr className="text-center bg-primary">
                                    <th className="w-32">Index</th>
                                    <th className="w-72">Intermediate airport</th>
                                    <th className="w-72">Stop duration</th>
                                    <th>Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transit_airports.map((airport, index) => (
                                    <tr key={airport.airport_id._id} className="text-center">
                                        <td>{index + 1}</td>
                                        <td>{airport.airport_id.name}</td>
                                        <td>{airport.stop_duration} minutes</td>
                                        <td>{airport.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </li>
            {updatingMode ? (
                <ScheduleUpdating
                    _id={_id}
                    flight_number={flight_number}
                    flight_code={flight_code}
                    departure_airport={departure_airport}
                    destination_airport={destination_airport}
                    departure_datetime={departure_datetime}
                    duration={duration}
                    seats={seats}
                    ticket_price={ticket_price}
                    transit_airports={transit_airports}
                    rules={rules}
                />
            ) : (
                <Portal>
                    <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                        <div className="flex items-center justify-center">
                            <div className="rounded-xl py-6 px-12 border border-primary bg-background flex flex-col items-center justify-center relative">
                                <button
                                    onClick={() => {
                                        hide();
                                        setSelectedId("");
                                        overlayRef.current?.classList.replace("flex", "hidden");
                                    }}
                                    className="absolute right-3 top-3 border border-blue rounded-full p-1 hover:border-primary hover:bg-primary"
                                >
                                    <i>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width={14}
                                            height={14}
                                            id="close"
                                        >
                                            <path
                                                className="fill-white"
                                                d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
                                            ></path>
                                        </svg>
                                    </i>
                                </button>
                                <p className="mb-4 mt-4 text-[15px]">Are you sure to delete this flight schedule?</p>
                                <div className="flex gap-6">
                                    <button
                                        className="px-5 py-2 border border-blue hover:border-mdRed hover:bg-mdRed rounded-lg"
                                        onClick={() => handleDelete()}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            hide();
                                            setSelectedId("");
                                            overlayRef.current?.classList.replace("flex", "hidden");
                                        }}
                                        className="px-5 py-2 border border-blue hover:border-primary hover:bg-primary rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </>
    );
};

export default ScheduleItem;
