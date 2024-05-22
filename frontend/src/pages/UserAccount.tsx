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
    const [visible, setVisible] = useState(false);

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
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                                <label htmlFor="newPassword" className="flex items-center gap-1 mb-1">
                                    New password
                                    <IsRequired />
                                </label>
                                <div className="relative">
                                    <input
                                        id="newPassword"
                                        autoComplete="new-password"
                                        type={visible === false ? "password" : "text"}
                                        placeholder="Enter your new password . . ."
                                        {...register("newPassword")}
                                        className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 px-4 py-3 rounded-lg w-full placeholder:text-disabled"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-2 right-4"
                                        onClick={() => setVisible(!visible)}
                                    >
                                        <i className="">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="28"
                                                height="28"
                                                fill="none"
                                                viewBox="0 0 32 32"
                                                id="eye"
                                                className={visible ? "rotate-180" : ""}
                                            >
                                                <path
                                                    className="fill-disabled"
                                                    d="M3.50386 12.1317C3.98316 11.8579 4.59368 12.0242 4.86787 12.5032L4.87304 12.512C4.87846 12.5212 4.8877 12.5367 4.90076 12.5581 4.92688 12.601 4.96822 12.6674 5.02477 12.754 5.13794 12.9273 5.31156 13.1807 5.54543 13.4877 6.01412 14.1028 6.71931 14.9256 7.6585 15.7474 9.537 17.3911 12.3124 19 16 19 19.6877 19 22.463 17.3911 24.3415 15.7474 25.2807 14.9256 25.9859 14.1028 26.4546 13.4877 26.6884 13.1807 26.8621 12.9273 26.9752 12.754 27.0318 12.6674 27.0731 12.601 27.0992 12.5581 27.1123 12.5367 27.1215 12.5212 27.127 12.512L27.1318 12.5038 27.1326 12.5024C27.4071 12.0241 28.0172 11.858 28.4961 12.1317 28.9757 12.4058 29.1423 13.0166 28.8682 13.4961L28 13C28.8682 13.4961 28.8685 13.4957 28.8682 13.4961L28.8672 13.4979 28.8658 13.5003 28.8619 13.5071 28.8496 13.5281C28.8394 13.5454 28.8252 13.5692 28.807 13.5991 28.7706 13.6588 28.7182 13.7427 28.6498 13.8476 28.5129 14.0571 28.3116 14.3505 28.0454 14.6998 27.5141 15.3971 26.7193 16.3244 25.6585 17.2526 23.537 19.1089 20.3124 21 16 21 11.6877 21 8.463 19.1089 6.3415 17.2526 5.28069 16.3244 4.48588 15.3971 3.95457 14.6998 3.68844 14.3505 3.48706 14.0571 3.35023 13.8476 3.28178 13.7427 3.22937 13.6588 3.19299 13.5991 3.1748 13.5692 3.1606 13.5454 3.1504 13.5281L3.13809 13.5071 3.13417 13.5003 3.13278 13.4979 3.13222 13.4969C3.13198 13.4965 3.13176 13.4961 4 13L3.13222 13.4969C2.85821 13.0174 3.02434 12.4058 3.50386 12.1317zM6.70711 20.7071L4.70711 22.7071C4.31658 23.0976 3.68342 23.0976 3.29289 22.7071 2.90237 22.3166 2.90237 21.6834 3.29289 21.2929L5.29289 19.2929C5.68342 18.9024 6.31658 18.9024 6.70711 19.2929 7.09763 19.6834 7.09763 20.3166 6.70711 20.7071zM27.2929 22.7071L25.2929 20.7071C24.9024 20.3166 24.9024 19.6834 25.2929 19.2929 25.6834 18.9024 26.3166 18.9024 26.7071 19.2929L28.7071 21.2929C29.0976 21.6834 29.0976 22.3166 28.7071 22.7071 28.3166 23.0976 27.6834 23.0976 27.2929 22.7071zM10.4285 25.3714C10.2234 25.8841 9.64141 26.1336 9.12863 25.9285 8.61584 25.7234 8.36641 25.1414 8.57152 24.6286L9.57146 22.1286C9.77657 21.6158 10.3585 21.3664 10.8713 21.5715 11.3841 21.7766 11.6335 22.3586 11.4284 22.8714L10.4285 25.3714zM22.8714 25.9285C22.3586 26.1336 21.7766 25.8841 21.5715 25.3714L20.5716 22.8714C20.3665 22.3586 20.6159 21.7766 21.1287 21.5715 21.6415 21.3664 22.2234 21.6158 22.4285 22.1286L23.4285 24.6286C23.6336 25.1414 23.3842 25.7234 22.8714 25.9285zM17 26C17 26.5523 16.5523 27 16 27 15.4477 27 15 26.5523 15 26V23.5C15 22.9477 15.4477 22.5 16 22.5 16.5523 22.5 17 22.9477 17 23.5V26z"
                                                ></path>
                                            </svg>
                                        </i>
                                    </button>

                                    {errors.newPassword && (
                                        <span className="text-deepRed">{errors.newPassword.message}</span>
                                    )}
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
