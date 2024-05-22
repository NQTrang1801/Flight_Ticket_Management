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
import IsRequired from "~/icons/IsRequired";

const schema = yup.object().shape({
    newPassword: yup.string().required("New password is required.")
});

function UserAccount() {
    const [userData, setUserData] = useState<UserData>();
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
    } = useForm<{ newPassword: string }>({
        resolver: yupResolver(schema)
    });

    const onSubmit: SubmitHandler<{ newPassword: string }> = async (formData) => {
        (async () => {
            const newPassword = formData.newPassword;

            try {
                await axios.patch(
                    "/user/password",
                    {
                        password: newPassword
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                        }
                    }
                );

                dispatch(sendMessage("Changed password successfully!", "success"));
                const timer = setTimeout(() => {
                    window.location.reload();
                }, 2000);
                return () => clearTimeout(timer);
            } catch (error) {
                dispatch(sendMessage("Changed password failed!", "error"));
                console.error(error);
            }
        })();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(startLoading());

                const userResponse = await axios.get(`/user/all-users`);
                setUserData(
                    userResponse.data.find(
                        (user: UserData) => user._id === JSON.parse(localStorage.getItem("user")!)._id
                    )
                );

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

    console.log(ticketData);

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
                            <button
                                onClick={() => {
                                    show();
                                }}
                                className="hover:bg-primary hover:border-primary rounded-lg border border-blue flex items-center justify-center p-1"
                            >
                                <i className="">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 32 32"
                                        width={24}
                                        height={24}
                                        id="password"
                                    >
                                        <path
                                            className="fill-white"
                                            d="M25 1L12.611 13.388A9 9 0 0 0 1 22a9 9 0 0 0 9 9 9 9 0 0 0 8.611-11.612L21 17v-2h2l8-8V1h-6zm4 5.171L22.172 13H19v3.171l-1.803 1.802-.848.848.348 1.147c.201.662.303 1.345.303 2.032 0 3.86-3.141 7-7 7s-7-3.14-7-7 3.141-7 7-7c.686 0 1.37.102 2.031.302l1.146.348.848-.848L25.828 3H29v3.171z"
                                        ></path>
                                        <circle className="fill-white" cx="8" cy="24" r="2"></circle>
                                        <path className="fill-white" d="M20.646 10.647l6-6 .707.707-6 6z"></path>
                                    </svg>
                                </i>
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div>
                                <span className="font-semibold">Full name</span>: {userData?.fullname}
                            </div>
                            <div>
                                <span className="font-semibold">Email</span>: {userData?.email}
                            </div>
                            <div>
                                <span className="font-semibold">Phone number</span>: {userData?.mobile}
                            </div>
                            <div>
                                <span className="font-semibold">Address</span>: {userData?.address}
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
                    email={userData?.email}
                    fullname={userData?.fullname}
                    isBlocked={userData?.isBlocked}
                    address={userData?.address}
                    mobile={userData?.mobile}
                />
            )}
            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="border border-blue p-8 bg-background relative rounded-xl max-h-[810px] w-[450px]  overflow-y-scroll no-scrollbar">
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
                                <div className="text-white font-semibold text-xl">Change password</div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                                <div className="flex gap-2 flex-col">
                                    <label htmlFor="newPassword" className="flex gap-1 mb-1 items-center">
                                        New password
                                        <IsRequired />
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        placeholder="Enter your new password . . ."
                                        {...register("newPassword")}
                                        className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                    />
                                    {<span className="text-deepRed">{errors.newPassword?.message}</span>}
                                </div>

                                <button
                                    className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                    type="submit"
                                >
                                    Change password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    );
}

export default UserAccount;
