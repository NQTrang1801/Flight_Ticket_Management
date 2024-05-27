import React from "react";
import axios from "~/utils/axios";
import { useAppDispatch, useAppSelector } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";
import formatDateTime from "~/utils/formatDateTime";
import checkPermission from "~/utils/checkPermission";

const AdminBookingForm: React.FC<BookingFormData> = ({
    CMND,
    booking_date,
    flight_id,
    full_name,
    phone_number,
    price,
    seat_class,
    status,
    user_id,
    _id
}) => {
    const dispatch = useAppDispatch();
    const { permissions } = useAppSelector((state) => state.permissions!);

    const confirmReservation = async (_id: string) => {
        await axios
            .patch(
                `/request-reservations/580457946/${_id}/success`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                }
            )
            .then(() => {
                dispatch(sendMessage("Confirmed reservation successfully!", "success"));
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
            .catch((error) => {
                console.error(error);
                dispatch(sendMessage("Confirmed reservation failed!", "error"));
            });
    };

    const cancelReservation = async (_id: string) => {
        await axios
            .patch(
                `/request-reservations/${_id}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                }
            )
            .then(() => {
                dispatch(sendMessage("Cancelled reservation successfully!", "success"));
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
            .catch((error) => {
                console.error(error);
                dispatch(sendMessage(`Cancelled reservation failed! ${error.response.data.message}`, "error"));
            });
    };

    return (
        <>
            <div
                className={`p-6 rounded-xl overflow-hidden shadow-xl border ${
                    status === "Paid" ? "border-green" : status === "Booked" ? "border-primary" : "border-mdRed"
                } bg-background relative`}
            >
                <div
                    className={`${
                        status === "Paid" ? "bg-green" : status === "Booked" ? "bg-primary" : "bg-mdRed"
                    } absolute top-0 left-0 right-0 p-2 text-center font-semibold text-base`}
                >
                    {status === "Paid" ? "Flight Ticket" : "Booking Form"}
                </div>

                <div className="absolute top-14 right-6 flex flex-col gap-2">
                    {checkPermission(permissions, "580457946") && status === "Booked" && (
                        <button
                            onClick={() => {
                                confirmReservation(_id);
                            }}
                            className="hover:bg-primary hover:border-primary rounded-lg border border-blue flex items-center justify-center p-1"
                        >
                            <i>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    id="check"
                                >
                                    <path fill="none" d="M0 0h24v24H0V0z"></path>
                                    <path
                                        className="fill-white"
                                        d="M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L9 16.17z"
                                    ></path>
                                </svg>
                            </i>
                        </button>
                    )}
                    {status === "Booked" && (
                        <button
                            onClick={() => {
                                cancelReservation(_id);
                            }}
                            className="hover:bg-mdRed hover:border-mdRed rounded-lg border border-blue flex items-center justify-center p-1"
                        >
                            <i>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width={24}
                                    height={24}
                                    id="cancel"
                                >
                                    <path
                                        className="fill-white"
                                        d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
                                    ></path>
                                </svg>
                            </i>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8">
                    <div>
                        <span className="font-semibold">Passenger name</span>: {full_name}
                    </div>
                    <div>
                        <span className="font-semibold">Passenger ID number</span>: {CMND}
                    </div>
                    <div>
                        <span className="font-semibold">Passenger phone number</span>: {phone_number}
                    </div>
                    <div>
                        <span className="font-semibold">User name</span>: {user_id.fullname}
                    </div>
                    <div>
                        <span className="font-semibold">User email</span>: {user_id.email}
                    </div>
                    <div>
                        <span className="font-semibold">Booking datetime</span>: {formatDateTime(booking_date)}
                    </div>
                    <div>
                        <span className="font-semibold">Seating type</span>:{" "}
                        {seat_class === "1" ? "First class" : "Second class"}
                    </div>
                    <div>
                        <span className="font-semibold">Price</span>: {price} USD
                    </div>
                    <div>
                        <span className="font-semibold">Status</span>: {status}
                    </div>
                    <div>
                        <span className="font-semibold">Flight code</span>: {flight_id.flight_code}
                    </div>
                    <div>
                        <span className="font-semibold">Flight number</span>: {flight_id.flight_number}
                    </div>
                    <div>
                        <span className="font-semibold">Departure datetime</span>:{" "}
                        {formatDateTime(flight_id.departure_datetime)}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminBookingForm;
