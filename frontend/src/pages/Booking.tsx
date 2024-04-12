import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "~/utils/axios";
import { useForm } from "react-hook-form";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";
import { useAppDispatch } from "~/hook";
import usePortal from "react-cool-portal";
import IsRequired from "~/icons/IsRequired";
import formatCurrency from "~/utils/formatCurrency";
import Tippy from "@tippyjs/react/headless";
import { convertNormalDate } from "~/utils/convertNormalDate";

function Booking() {
    const [data, setData] = useState<IBookings>();
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { Portal, show, hide } = usePortal({ defaultShow: false });
    const [status, setStatus] = useState("");
    const [statusVisible, setStatusVisible] = useState(false);
    const { handleSubmit } = useForm();

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`/bookings/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.accessToken}`
                    }
                });
                setData(response.data);
                setStatus(response.data.status);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [id]);

    const onSubmit = async () => {
        hide();
        dispatch(startLoading());

        (async () => {
            try {
                await axios.patch(
                    `/bookings/${id}`,
                    {
                        status: status
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.accessToken}`
                        }
                    }
                );
                dispatch(stopLoading());
                dispatch(sendMessage("Updated successfully!"));
                setTimeout(() => window.location.reload(), 2000);
            } catch (error) {
                dispatch(stopLoading());
                dispatch(sendMessage("Updated failed!"));
                console.error(error);
            }
        })();
    };

    return (
        data && (
            <>
                <div className="flex justify-end items-center mb-6">
                    <div className="flex gap-3 items-center">
                        <button
                            onClick={() => {
                                show();
                            }}
                            className={`rounded-xl bg-block border-blue border hover:border-primary 
                           hover:bg-primary flex items-center justify-center p-3 w-[112px]`}
                        >
                            <i className="mr-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width={20}
                                    height={20}
                                    id="edit"
                                >
                                    <path
                                        className="fill-white"
                                        d="M5,18H9.24a1,1,0,0,0,.71-.29l6.92-6.93h0L19.71,8a1,1,0,0,0,0-1.42L15.47,2.29a1,1,0,0,0-1.42,0L11.23,5.12h0L4.29,12.05a1,1,0,0,0-.29.71V17A1,1,0,0,0,5,18ZM14.76,4.41l2.83,2.83L16.17,8.66,13.34,5.83ZM6,13.17l5.93-5.93,2.83,2.83L8.83,16H6ZM21,20H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"
                                    ></path>
                                </svg>
                            </i>
                            Update
                        </button>
                    </div>
                </div>
                <div className="bg-block p-6 rounded-3xl shadow-xl flex flex-col gap-6">
                    <div className="flex justify-between rounded-xl p-4 border border-blue gap-6">
                        <div className="text-center w-[40%]">
                            <img
                                src={
                                    data.showing.movie.moviePosters?.filter((poster) => poster.isThumb === true)[0].link
                                }
                                alt="movie poster"
                                className="rounded-xl group-hover:scale-110 transition-transform duration-300 ease-linear"
                            />
                            <div className="text-lg text-primary font-semibold mt-4">{data.showing.movie.name}</div>
                            <div>{data.showing.movie.director}</div>
                        </div>
                        <div className="p-4 w-[60%] flex justify-between">
                            <div>
                                <div className="mb-2">
                                    <div className="text-base font-medium text-primary mb-2">Booking Information</div>
                                    <div className="">
                                        <span className="font-medium text-blue">Price: </span>
                                        {formatCurrency(data.totalPrice)} VND
                                    </div>
                                    <div className="capitalize">
                                        <span className="font-medium text-blue">Status: </span>
                                        {data.status}
                                    </div>
                                    <div className="capitalize">
                                        <span className="font-medium text-blue">Theater: </span>
                                        {data.showing.room.theater.name + " - " + data.showing.room.theater.city}
                                    </div>
                                    <div className="capitalize">
                                        <span className="font-medium text-blue">Address: </span>
                                        {data.showing.room.theater.address}
                                    </div>
                                    <div className="capitalize">
                                        <span className="font-medium text-blue">Room: </span>
                                        {data.showing.room.name + " - " + data.showing.room.type}
                                    </div>
                                    <div className="font-medium text-blue">All seats:</div>
                                    {data.showingSeats.map((seat) => (
                                        <li key={seat.id} className="ml-4 capitalize">
                                            {seat.type === "standard" ? (
                                                <span className="">
                                                    Seat:{" "}
                                                    {seat.seat.seatRow +
                                                        seat.seat.seatColumn +
                                                        " - " +
                                                        formatCurrency(seat.price) +
                                                        " VND"}
                                                </span>
                                            ) : (
                                                <span className="">
                                                    Couple seat:{" "}
                                                    {seat.seat.seatRow + seat.seat.seatColumn + " - " + "100,000 VND"}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-base font-medium text-primary mb-2">User Information</div>
                                <div className="">
                                    <span className="font-medium text-blue">User: </span>
                                    {data.user.email}
                                </div>
                                <div className="capitalize">
                                    <span className="font-medium text-blue">Name: </span>
                                    {data.user.firstName} {data.user.lastName}
                                </div>
                                <div className="capitalize">
                                    <span className="font-medium text-blue">Gender: </span>
                                    {data.user.gender}
                                </div>
                                <div className="capitalize">
                                    <span className="font-medium text-blue">Address: </span>
                                    {data.user.address}
                                </div>
                                <div className="">
                                    <span className="font-medium text-blue">Phone number: </span>
                                    {data.user.phoneNumber}
                                </div>
                                <div className="capitalize">
                                    <span className="font-medium text-blue">Birthday: </span>
                                    {convertNormalDate(data.user.dateOfBirth)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Portal>
                    <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                        <div className="flex items-center justify-center">
                            <div className="border border-blue p-8 bg-background relative rounded-xl no-scrollbar">
                                <button
                                    onClick={hide}
                                    className="absolute right-4 top-4 border border-blue rounded-full p-1 hover:border-primary hover:bg-primary"
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
                                <div className="flex justify-center mb-8">
                                    <div className="text-white font-semibold text-xl">Update booking</div>
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                                    <div className="text-blue text-[15px]">Booking Information</div>
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="movieParticipantIds" className="flex gap-1 mb-1 items-center">
                                            Status
                                            <IsRequired />
                                        </label>
                                        <Tippy
                                            interactive
                                            onClickOutside={() => setStatusVisible(!statusVisible)}
                                            visible={statusVisible}
                                            offset={[0, 0]}
                                            placement="bottom"
                                            render={(attrs) => (
                                                <div
                                                    {...attrs}
                                                    className={`flex w-[290px] text-white p-2 rounded-bl-lg rounded-br-lg flex-col bg-background outline-1 outline-border outline justify-center ${
                                                        statusVisible ? "outline-primary" : ""
                                                    }`}
                                                >
                                                    <div
                                                        onClick={() => {
                                                            setStatus("created");
                                                            setStatusVisible(false);
                                                        }}
                                                        className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                            status === "created" ? "text-blue pointer-events-none" : ""
                                                        }`}
                                                    >
                                                        Created
                                                    </div>
                                                    <div
                                                        onClick={() => {
                                                            setStatus("payed");
                                                            setStatusVisible(false);
                                                        }}
                                                        className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                            status === "payed" ? "text-blue pointer-events-none" : ""
                                                        }`}
                                                    >
                                                        Payed
                                                    </div>{" "}
                                                    <div
                                                        onClick={() => {
                                                            setStatus("completed");
                                                            setStatusVisible(false);
                                                        }}
                                                        className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                            status === "completed"
                                                                ? "text-blue pointer-events-none"
                                                                : ""
                                                        }`}
                                                    >
                                                        Completed
                                                    </div>{" "}
                                                    <div
                                                        onClick={() => {
                                                            setStatus("canceled");
                                                            setStatusVisible(false);
                                                        }}
                                                        className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                            status === "canceled" ? "text-blue pointer-events-none" : ""
                                                        }`}
                                                    >
                                                        Canceled
                                                    </div>
                                                </div>
                                            )}
                                        >
                                            <div
                                                tabIndex={-1}
                                                onClick={() => setStatusVisible(!statusVisible)}
                                                className={`hover:outline-primary py-3 px-4 outline-blue outline-1 outline bg-[rgba(141,124,221,0.1)] cursor-pointer ${
                                                    statusVisible
                                                        ? "rounded-tl-lg rounded-tr-lg outline-primary"
                                                        : "rounded-lg"
                                                }   flex justify-between items-center w-[290px] capitalize`}
                                            >
                                                {status}
                                                <i className={`${statusVisible ? "rotate-180" : ""}`}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 16 16"
                                                        id="chevron-down"
                                                    >
                                                        <path
                                                            fill="#fff"
                                                            d="M4.14645,5.64645 C4.34171,5.45118 4.65829,5.45118 4.85355,5.64645 L7.9999975,8.79289 L11.1464,5.64645 C11.3417,5.45118 11.6583,5.45118 11.8536,5.64645 C12.0488,5.84171 12.0488,6.15829 11.8536,6.35355 L8.35355,9.85355 C8.15829,10.0488 7.84171,10.0488 7.64645,9.85355 L4.14645,6.35355 C3.95118,6.15829 3.95118,5.84171 4.14645,5.64645 Z"
                                                        ></path>
                                                    </svg>
                                                </i>
                                            </div>
                                        </Tippy>
                                    </div>
                                    <div className="outline outline-1 outline-border my-2"></div>
                                    <button
                                        className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                        type="submit"
                                    >
                                        Update booking
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </Portal>
            </>
        )
    );
}

export default Booking;
