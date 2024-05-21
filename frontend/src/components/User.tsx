import React from "react";
import { useState, useEffect } from "react";
import axios from "~/utils/axios";
import { useAppDispatch } from "~/hook";
import UserUpdating from "./UserUpdating";
import { sendMessage } from "~/actions/message";
import { startLoading, stopLoading } from "~/actions/loading";
import shortenAirportName from "~/utils/shortenAirportName";
import Permission from "~/components/Permission";

interface UserProps {
    email: string;
    fullname: string;
    group_id: string;
    isBlocked: boolean;
    mobile: string;
    // tickets: [];
    address: string;
    _id: string;
}

const User: React.FC<UserProps> = ({ email, fullname, group_id, isBlocked, mobile, _id, address }) => {
    const [updatingMode, setUpdatingMode] = useState(false);
    const [ticketData, setTicketData] = useState<TicketData[]>();
    const [flightData, setFlightData] = useState<FlightScheduleData[]>();

    const userType = JSON.parse(localStorage.getItem("user")!)?.userType.toLowerCase();

    const dispatch = useAppDispatch();

    const handleBlockUser = async (_id: string) => {
        await axios
            .put(
                `/user/511246447/block-user/${_id}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                }
            )
            .then(() => {
                dispatch(sendMessage("Blocked successfully!", "success"));
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((error) => {
                console.error(error);
                dispatch(sendMessage("Blocked failed!", "error"));
            });
    };

    const handleUnblockUser = async (_id: string) => {
        await axios
            .put(
                `/user/511246447/unblock-user/${_id}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                }
            )
            .then(() => {
                dispatch(sendMessage("Unblocked successfully!", "success"));
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((error) => {
                console.error(error);
                dispatch(sendMessage("Unblocked failed!", "error"));
            });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(startLoading());

                const ticketResponse = await axios.get(`/user/${_id}/tickets`);
                setTicketData(ticketResponse.data);

                const flightPromises = ticketResponse.data.map((ticket: TicketData) =>
                    axios.get(`/flight/${ticket.flight_id}`, {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                        }
                    })
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
    }, [_id, dispatch]);

    // console.log(ticketData);

    return (
        <>
            <div
                className={`p-6 rounded-xl overflow-hidden shadow-xl border ${
                    isBlocked ? "border-mdRed" : "border-blue"
                } bg-background relative`}
            >
                <div
                    className={`${
                        isBlocked ? "bg-mdRed" : "bg-blue"
                    } absolute top-0 left-0 right-0 p-2 text-center font-semibold text-base`}
                >
                    User Account
                </div>
                <div className="absolute top-14 right-6 flex gap-2">
                    {userType !== "administrator" && (
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
                    )}
                    {userType === "administrator" && (
                        <>
                            <button
                                onClick={() => {
                                    if (isBlocked) {
                                        handleUnblockUser(_id);
                                    } else handleBlockUser(_id);
                                }}
                                className={`${
                                    isBlocked && "bg-mdRed border-mdRed hover:bg-blue hover:border-blue"
                                } hover:bg-mdRed hover:border-mdRed rounded-lg border border-blue flex items-center justify-center p-1`}
                            >
                                <i>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 48 48"
                                        id="block"
                                    >
                                        <path fill="none" d="M0 0h48v48H0z"></path>
                                        <path
                                            fill="white"
                                            d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zM8 24c0-8.84 7.16-16 16-16 3.7 0 7.09 1.27 9.8 3.37L11.37 33.8C9.27 31.09 8 27.7 8 24zm16 16c-3.7 0-7.09-1.27-9.8-3.37L36.63 14.2C38.73 16.91 40 20.3 40 24c0 8.84-7.16 16-16 16z"
                                        ></path>
                                    </svg>
                                </i>
                            </button>
                        </>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <div>
                        <span className="font-semibold">Full name</span>: {fullname}
                    </div>
                    <div>
                        <span className="font-semibold">Email</span>: {email}
                    </div>
                    <div>
                        <span className="font-semibold">Phone number</span>: {mobile}
                    </div>
                    <div>
                        <span className="font-semibold">Address</span>: {address}
                    </div>
                    <div>
                        <span className="font-semibold">Group id</span>: {group_id}
                    </div>
                    <div>
                        <span className="font-semibold">Blocked</span>: {isBlocked === false ? "False" : "True"}
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
                                            {ticketData.find((ticket) => ticket.flight_id === flight._id)?.full_name}
                                        </td>
                                        <td>
                                            {ticketData.find((ticket) => ticket.flight_id === flight._id)?.phone_number}
                                        </td>
                                        <td>{flight.flight_number}</td>
                                        <td>{shortenAirportName(flight.departure_airport.name)}</td>
                                        <td>{shortenAirportName(flight.destination_airport.name)}</td>
                                        <td>
                                            {ticketData.find((ticket) => ticket.flight_id === flight._id)
                                                ?.seat_class === "1"
                                                ? "First class"
                                                : "Second class"}
                                        </td>
                                        <td>
                                            {ticketData.find((ticket) => ticket.flight_id === flight._id)?.price} USD
                                        </td>
                                        <td>{ticketData.find((ticket) => ticket.flight_id === flight._id)?.status}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {updatingMode && userType !== "administrator" && (
                <UserUpdating
                    email={email}
                    fullname={fullname}
                    group_id={group_id}
                    isBlocked={isBlocked}
                    address={address}
                    mobile={mobile}
                    // tickets={tickets}
                />
            )}
        </>
    );
};

export default User;
