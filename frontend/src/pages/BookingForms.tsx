import axios from "~/utils/axios";
import { useState, useEffect } from "react";
import usePortal from "react-cool-portal";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsRequired from "~/icons/IsRequired";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";
import Tippy from "@tippyjs/react/headless";
import BookingForm from "~/components/BookingForm";
import formatDateTime from "~/utils/formatDateTime";

const schema = yup.object().shape({
    fullName: yup.string().required("Full name is required."),
    identificationNumber: yup
        .number()
        .required("Identification number is required.")
        .typeError("Identification number must be a number"),
    phoneNumber: yup
        .number()
        .required("Phone number is required.")
        .typeError("Phone number must be a number.")
        .min(10, "Phone number must be exactly 10 digits")
});

function BookingForms() {
    const [data, setData] = useState<BookingFormData[]>();
    const [flightData, setFlightData] = useState<FlightScheduleData[]>();
    const [userData, setUserData] = useState<UserData[]>();

    const [selectedFlight, setSelectedFlight] = useState<FlightScheduleData>({});
    const [flightVisible, setFlightVisible] = useState(false);

    const [selectedUser, setSelectedUser] = useState<UserData>({});
    const [userVisible, setUserVisible] = useState(false);

    const [ticketClass, setTicketClass] = useState("First class");

    const [formSubmitted, setFormSubmitted] = useState(false);

    const { Portal, show, hide } = usePortal({
        defaultShow: false
    });

    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<BookingFormValidation>({
        resolver: yupResolver(schema)
    });

    const onSubmit: SubmitHandler<BookingFormValidation> = async (formData) => {
        dispatch(startLoading());
        const full_name = formData.fullName;
        const CMND = formData.identificationNumber;
        const phone_number = "0" + formData.phoneNumber;

        if (formSubmitted) {
            (async () => {
                try {
                    await axios.post(
                        "/request-reservations/booking",
                        {
                            full_name,
                            CMND,
                            phone_number,
                            flight_id: selectedFlight._id,
                            user_id: selectedUser._id,
                            seat_class: ticketClass === "First class" ? 1 : 2
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                            }
                        }
                    );
                    dispatch(stopLoading());
                    dispatch(sendMessage("Created successfully!", "success"));
                    setTimeout(() => window.location.reload(), 2000);
                } catch (error) {
                    dispatch(stopLoading());
                    dispatch(sendMessage(`Created failed! ${error.response.data.message}`, "error"));
                    console.error(error);
                }
            })();
        }
    };

    useEffect(() => {
        (async () => {
            await axios
                .get("/request-reservations/580320946/request-all", {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                })
                .then((response) => {
                    setData(response.data);
                })
                .catch((err) => console.error(err));
        })();
        (async () => {
            await axios
                .get("/flight/all", { headers: { "Content-Type": "application/json" } })
                .then((response) => {
                    setFlightData(response.data);
                })
                .catch((err) => console.error(err));
        })();

        (async () => {
            await axios
                .get("/user/511320447/admin/all-users", {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                })
                .then((response) => {
                    setUserData(response.data.USER);
                })
                .catch((err) => console.error(err));
        })();
    }, []);

    useEffect(() => {
        if (Object.keys(selectedFlight).length > 0 && Object.keys(selectedUser).length > 0) setFormSubmitted(false);
    }, [selectedFlight, selectedUser]);

    return (
        <>
            <div className="flex justify-end items-center mb-6">
                <button
                    onClick={() => {
                        show();
                    }}
                    className="bg-block rounded-xl border-blue border hover:border-primary hover:bg-primary flex items-center justify-center p-3 w-[112px]"
                >
                    <i className="mr-[3px]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            id="add"
                            x="0"
                            y="0"
                            version="1.1"
                            viewBox="0 0 29 29"
                            xmlSpace="preserve"
                            width={20}
                            height={20}
                            className="translate-x-[-3px]"
                        >
                            <path
                                fill="none"
                                stroke="#fff"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeMiterlimit="10"
                                strokeWidth="2"
                                d="M14.5 22V7M7 14.5h15"
                            ></path>
                        </svg>
                    </i>
                    Create
                </button>
            </div>

            <div className="bg-block p-6 rounded-3xl shadow-xl">
                <div className="grid grid-cols-1 gap-6">
                    {data &&
                        data
                            // ?.filter((actor) => actor.fullName.toLowerCase().includes(query.toLowerCase()))
                            .map((bookingForm) => (
                                <BookingForm
                                    key={bookingForm._id}
                                    CMND={bookingForm.CMND}
                                    booking_date={bookingForm.booking_date}
                                    flight_id={bookingForm.flight_id}
                                    full_name={bookingForm.full_name}
                                    phone_number={bookingForm.phone_number}
                                    price={bookingForm.price}
                                    seat_class={bookingForm.seat_class}
                                    status={bookingForm.status}
                                    user_id={bookingForm.user_id}
                                    _id={bookingForm._id}
                                />
                            ))}
                </div>
            </div>
            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="border border-blue p-8 bg-background relative rounded-xl max-h-[810px] max-w-[662px]  overflow-y-scroll no-scrollbar">
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
                                <div className="text-white font-semibold text-xl">Create new booking form</div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                                <div className="flex gap-2 flex-col">
                                    <label htmlFor="fullName" className="flex gap-1 mb-1 items-center">
                                        Full name
                                        <IsRequired />
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        placeholder="Full name . . ."
                                        {...register("fullName")}
                                        className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                    />
                                    {<span className="text-deepRed">{errors.fullName?.message}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="identificationNumber" className="flex gap-1 mb-1 items-center">
                                            Identification number
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="text"
                                            id="identificationNumber"
                                            placeholder="Identification number . . ."
                                            {...register("identificationNumber")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.identificationNumber?.message}</span>}
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="phoneNumber" className="flex gap-1 mb-1 items-center">
                                            Phone number
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="text"
                                            id="phoneNumber"
                                            placeholder="Phone number . . ."
                                            {...register("phoneNumber")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.phoneNumber?.message}</span>}
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <label htmlFor="user" className="flex gap-1 mb-1 items-center">
                                        User
                                        <IsRequired />
                                    </label>
                                    <Tippy
                                        visible={userVisible}
                                        interactive
                                        onClickOutside={() => setUserVisible(false)}
                                        offset={[0, 0]}
                                        placement="bottom"
                                        render={(attrs) => (
                                            <ul
                                                className={`border border-primary rounded-lg p-2 max-h-[300px] w-[440px] overflow-y-scroll no-scrollbar bg-background ${
                                                    userVisible ? "border-t-0 rounded-tl-none rounded-tr-none" : ""
                                                }`}
                                                {...attrs}
                                            >
                                                {userData &&
                                                    userData.map((user) => (
                                                        <li
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setUserVisible(false);
                                                            }}
                                                            key={user._id}
                                                            className={`cursor-pointer py-2 px-4 hover:bg-primary text-left rounded-lg flex items-center p-2 ${
                                                                user._id === selectedUser?._id
                                                                    ? "text-blue pointer-events-none"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {user.email} - {user.fullname}
                                                        </li>
                                                    ))}
                                            </ul>
                                        )}
                                    >
                                        <div
                                            className={`hover:border-primary py-3 px-4 border-blue border bg-background cursor-pointer w-[440px] mt-1 ${
                                                userVisible
                                                    ? "rounded-tl-lg rounded-tr-lg border-primary"
                                                    : "rounded-lg"
                                            }   flex justify-between items-center`}
                                            onClick={() => setUserVisible(!userVisible)}
                                        >
                                            {Object.keys(selectedUser).length === 0
                                                ? "Choose an user"
                                                : `${selectedUser.email} -
                                                            ${selectedUser.fullname}`}
                                            <i className={`${userVisible ? "rotate-180" : ""}`}>
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
                                    {
                                        <span className="text-deepRed">
                                            {formSubmitted &&
                                                Object.keys(selectedUser).length === 0 &&
                                                "User is required."}
                                        </span>
                                    }
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <label htmlFor="flight" className="flex gap-1 mb-1 items-center">
                                        Flight
                                        <IsRequired />
                                    </label>
                                    <Tippy
                                        visible={flightVisible}
                                        interactive
                                        onClickOutside={() => setFlightVisible(false)}
                                        offset={[0, 0]}
                                        placement="bottom"
                                        render={(attrs) => (
                                            <ul
                                                className={`border border-primary rounded-lg p-2 max-h-[300px] w-[440px] overflow-y-scroll no-scrollbar bg-background ${
                                                    flightVisible ? "border-t-0 rounded-tl-none rounded-tr-none" : ""
                                                }`}
                                                {...attrs}
                                            >
                                                {flightData &&
                                                    flightData.map((flight) => (
                                                        <li
                                                            onClick={() => {
                                                                setSelectedFlight(flight);
                                                                setFlightVisible(false);
                                                            }}
                                                            key={flight._id}
                                                            className={`cursor-pointer py-2 px-4 hover:bg-primary text-left rounded-lg flex items-center p-2 ${
                                                                flight._id === selectedFlight?._id
                                                                    ? "text-blue pointer-events-none"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {flight.departure_airport.address} -{" "}
                                                            {flight.destination_airport.address} (
                                                            {formatDateTime(flight.departure_datetime)})
                                                        </li>
                                                    ))}
                                            </ul>
                                        )}
                                    >
                                        <div
                                            className={`hover:border-primary py-3 px-4 border-blue border bg-background cursor-pointer w-[440px] mt-1 ${
                                                flightVisible
                                                    ? "rounded-tl-lg rounded-tr-lg border-primary"
                                                    : "rounded-lg"
                                            }   flex justify-between items-center`}
                                            onClick={() => setFlightVisible(!flightVisible)}
                                        >
                                            {Object.keys(selectedFlight).length === 0
                                                ? "Choose a flight"
                                                : `${selectedFlight.departure_airport.address} -
                                                            ${selectedFlight.destination_airport.address} (
                                                                ${formatDateTime(selectedFlight.departure_datetime)})`}
                                            <i className={`${flightVisible ? "rotate-180" : ""}`}>
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
                                    {
                                        <span className="text-deepRed">
                                            {formSubmitted &&
                                                Object.keys(selectedFlight).length === 0 &&
                                                "Flight is required."}
                                        </span>
                                    }
                                </div>

                                {Object.keys(selectedFlight).length > 0 && (
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="ticketClass" className="flex gap-1 mb-1 items-center">
                                            Ticket class
                                            <IsRequired />
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                disabled={!selectedFlight.seats[0].status}
                                                onClick={() => setTicketClass("First class")}
                                                className={`py-3 px-4 border-blue border cursor-pointer rounded-lg mt-1 hover:border-primary ${
                                                    ticketClass === "First class" && "bg-primary border-primary"
                                                }   flex justify-between items-center`}
                                            >
                                                First class (
                                                {selectedFlight.seats[0].count - selectedFlight.seats[0].booked_seats}{" "}
                                                seats)
                                            </button>
                                            <button
                                                type="button"
                                                disabled={!selectedFlight.seats[1].status}
                                                onClick={() => setTicketClass("Second class")}
                                                className={`py-3 px-4 border-blue border cursor-pointer rounded-lg hover:border-primary mt-1 ${
                                                    ticketClass === "Second class" && "bg-primary border-primary"
                                                }   flex justify-between items-center`}
                                            >
                                                Second class (
                                                {selectedFlight.seats[1].count - selectedFlight.seats[1].booked_seats}{" "}
                                                seats)
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <button
                                    className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                    type="submit"
                                    onClick={() => {
                                        setFormSubmitted(true);
                                    }}
                                >
                                    Create booking form
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    );
}

export default BookingForms;
