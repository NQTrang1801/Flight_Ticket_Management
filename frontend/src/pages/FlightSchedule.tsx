import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import { useState, useEffect } from "react";
import usePortal from "react-cool-portal";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import axios from "~/utils/axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsRequired from "~/icons/IsRequired";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";
import convertDate from "~/utils/convertDate";
import ScheduleItem from "~/components/ScheduleItem";

const schema = yup.object().shape({
    flightNumber: yup.string().required("Flight number is required."),
    flightCode: yup.string().required("Flight code is required."),
    duration: yup.number().required("Duration is required.").typeError("Duration must be a number."),
    ticketPrice: yup.number().required("Ticket price is required.").typeError("Ticket price must be a number."),
    departureDate: yup.date().required("Departure date is required.").typeError("Date is required."),
    departureTime: yup.string().required("Time is required.").typeError("Time is required."),
    bookingDeadline: yup.date().required("Booking deadline is required.").typeError("Booking deadline is required."),
    cancellationDeadline: yup
        .date()
        .required("Cancellation deadline is required.")
        .typeError("Cancellation deadline is required."),
    firstClassCapacity: yup
        .number()
        .required("Seating capacity is required.")
        .typeError("Seating capacity must be a number."),
    firstClassBookedSeats: yup
        .number()
        .required("Booked seats is required.")
        .typeError("Booked seats must be a number.")
        .max(yup.ref("firstClassCapacity"), "Booked seats must be less than or equal to capacity."),

    secondClassCapacity: yup
        .number()
        .required("Seating capacity is required.")
        .typeError("Seating capacity must be a number."),
    secondClassBookedSeats: yup
        .number()
        .required("Booked seats is required.")
        .typeError("Booked seats must be a number.")
        .max(yup.ref("secondClassCapacity"), "Booked seats must be less than or equal to capacity."),

    intermediateAirport: yup.array().of(
        yup.object().shape({
            stopDuration: yup.number().required("Duration is required.").typeError("Stop duration must be a number."),
            note: yup.string()
        })
    )
});

function FlightSchedule() {
    const [data, setData] = useState<FlightScheduleData[]>();
    const [airportData, setAirportData] = useState<AirportData[]>();
    const [ruleData, setRuleData] = useState<RuleData[]>();

    const [formSubmitted, setFormSubmitted] = useState(false);

    const [departureAirport, setDepartureAirport] = useState({
        id: "",
        name: ""
    });
    const [arrivalAirport, setArrivalAirport] = useState({
        id: "",
        name: ""
    });

    const dispatch = useAppDispatch();

    const [status1, setStatus1] = useState(true);
    const [status1Visible, setStatus1Visible] = useState(false);

    const [status2, setStatus2] = useState(true);
    const [status2Visible, setStatus2Visible] = useState(false);

    const [time, setTime] = useState("");

    const [departureAirportVisible, setDepartureAirportVisible] = useState(false);
    const [arrivalAirportVisible, setArrivalAirportVisible] = useState(false);

    const { Portal, show, hide } = usePortal({
        defaultShow: false,
        clickOutsideToHide: true
    });
    const {
        control,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FlightScheduleValidation>({
        resolver: yupResolver(schema)
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "intermediateAirport"
    });

    const [dropdownStates, setDropdownStates] = useState(fields.map(() => false));

    const [selectedAirports, setSelectedAirports] = useState(Array(fields.length).fill(null));

    const handleAirportSelect = (airport: AirportData, index: number) => {
        setDropdownStates((prevState) => {
            const newState = [...prevState];
            newState[index] = false;
            return newState;
        });
        setSelectedAirports((prevState) => {
            const newState = [...prevState];
            newState[index] = airport;
            return newState;
        });
    };

    const filterAvailableAirports = (airport: AirportData) => {
        return selectedAirports.every((selectedAirport) => !selectedAirport || selectedAirport._id !== airport._id);
    };

    const onSubmit: SubmitHandler<FlightScheduleValidation> = async (data) => {
        hide();
        dispatch(startLoading());

        const flight_code = data.flightCode;
        const flight_number = data.flightNumber;
        const ticket_price = data.ticketPrice;
        const departure_airport = departureAirport.id;
        const destination_airport = arrivalAirport.id;
        const duration = data.duration;
        const departure_datetime = `${convertDate(data.departureDate)} ${data.departureTime}:00`;

        const firstClassCapacity = data.firstClassCapacity;
        const firstClassBookedSeats = data.firstClassBookedSeats;
        const secondClassCapacity = data.secondClassCapacity;
        const secondClassBookedSeats = data.secondClassBookedSeats;

        const airport_ids = selectedAirports.map((selectedAirport) => selectedAirport._id);
        const stopDurations = data.intermediateAirport.map((airport) => airport.stopDuration);
        const notes = data.intermediateAirport.map((airport) => airport.note);

        const transit_airports = airport_ids.map((airportId, index) => ({
            airport_id: airportId,
            stop_duration: stopDurations[index],
            note: notes[index]
        }));

        (async () => {
            try {
                await axios.post(
                    "/flight/511454641/create",
                    {
                        flight_code,
                        flight_number,
                        ticket_price,
                        departure_airport,
                        destination_airport,
                        duration,
                        departure_datetime,
                        seats: [
                            {
                                class: "1",
                                count: firstClassCapacity,
                                booked_seats: firstClassBookedSeats,
                                status: status1
                            },
                            {
                                class: "2",
                                count: secondClassCapacity,
                                booked_seats: secondClassBookedSeats,
                                status: status2
                            }
                        ],
                        transit_airports,
                        rules: {
                            regulation_1: {
                                flight_time: ruleData?.find((rule) => rule.values.min_flight_time),
                                intermediate: ruleData?.find((rule) => rule.values.max_transit_airports)
                            },
                            regulation_2: {
                                tickets: "663649fb67685b9b04acb653"
                            },
                            regulation_3: {
                                booking: "663649fb67685b9b04acb654"
                            }
                        }
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.token}`
                        }
                    }
                );
                dispatch(stopLoading());
                dispatch(sendMessage("Created successfully!"));
                setTimeout(() => window.location.reload(), 2000);
            } catch (error) {
                dispatch(stopLoading());
                dispatch(sendMessage("Created failed!"));
                console.error(error);
            }
        })();
    };

    useEffect(() => {
        (async () => {
            try {
                dispatch(startLoading());

                const flightResponse = await axios.get("/flight/all", {
                    headers: { "Content-Type": "application/json" }
                });

                const airportResponse = await axios.get("/airport/all", {
                    headers: { "Content-Type": "application/json" }
                });
                setAirportData(airportResponse.data);

                const ruleResponse = await axios.get("rule/511320340/all", {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.token}`
                    }
                });
                setRuleData(ruleResponse.data);

                const data = flightResponse.data.map((flight: FlightScheduleData) => ({
                    ...flight,
                    departure_airport_name: airportResponse.data.find(
                        (airport: AirportData) => airport._id === flight.departure_airport
                    )?.name,
                    destination_airport_name: airportResponse.data.find(
                        (airport: AirportData) => airport._id === flight.destination_airport
                    )?.name,
                    transit_airports: flight.transit_airports.map((transit_airport) => ({
                        ...transit_airport,
                        airport_name: airportResponse.data.find(
                            (airport: AirportData) => airport._id === transit_airport.airport_id
                        )?.name
                    }))
                }));

                setData(data);

                dispatch(stopLoading());
            } catch (error) {
                console.error(error);
            }
        })();
    }, [dispatch]);

    return (
        <>
            <div className="flex justify-end items-center mb-6">
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => {
                            show();
                        }}
                        className="rounded-xl bg-block border-blue border hover:border-primary hover:bg-primary flex items-center justify-center p-3 w-[112px]"
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
            </div>

            <div className="mb-10">
                <div className="bg-block p-6 rounded-3xl shadow-xl">
                    <ul className="w-full grid grid-cols-1 gap-8">
                        {data &&
                            data.map((schedule) => (
                                <ScheduleItem
                                    key={schedule._id}
                                    _id={schedule._id}
                                    flight_number={schedule.flight_number}
                                    flight_code={schedule.flight_code}
                                    departure_airport={schedule.departure_airport}
                                    destination_airport={schedule.destination_airport}
                                    departure_datetime={schedule.departure_datetime}
                                    duration={schedule.duration}
                                    seats={schedule.seats}
                                    booking_deadline={schedule.booking_deadline}
                                    cancellation_deadline={schedule.cancellation_deadline}
                                    ticket_price={schedule.ticket_price}
                                    transit_airports={schedule.transit_airports}
                                    departure_airport_name={schedule.departure_airport_name}
                                    destination_airport_name={schedule.destination_airport_name}
                                    rules={schedule.rules}
                                />
                            ))}
                    </ul>
                </div>
            </div>
            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="border border-blue p-8 bg-background relative rounded-xl max-h-[810px] max-w-[662px] overflow-y-scroll no-scrollbar">
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
                                <div className="text-white font-semibold text-xl">Create new schedule</div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                <div className="text-blue text-[15px]">Flight Information</div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="flightNumber" className="flex gap-1 mb-1 items-center">
                                            Flight number
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="text"
                                            id="flightNumber"
                                            placeholder="Ex: MH370"
                                            {...register("flightNumber")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.flightNumber?.message}</span>}
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="flightCode" className="flex gap-1 mb-1 items-center">
                                            Flight code
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="text"
                                            id="flightCode"
                                            {...register("flightCode")}
                                            placeholder="Ex: HAN-SGN"
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.flightCode?.message}</span>}
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="ticketPrice" className="flex gap-1 mb-1 items-center">
                                            Ticket price (USD)
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="text"
                                            id="ticketPrice"
                                            {...register("ticketPrice")}
                                            placeholder="Ex: 1000"
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.ticketPrice?.message}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex gap-2 col-span-2 flex-col">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="departureDate" className="flex gap-1 mb-1 items-center">
                                                    Departure date
                                                    <IsRequired />
                                                </label>
                                                <input
                                                    type="date"
                                                    pattern="\d{4}-\d{2}-\d{2}"
                                                    id="departureDate"
                                                    {...register("departureDate")}
                                                    className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                                />
                                                {<span className="text-deepRed">{errors.departureDate?.message}</span>}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="departureTime" className="flex gap-1 mb-1 items-center">
                                                    Departure time
                                                    <IsRequired />
                                                </label>
                                                <input
                                                    type="time"
                                                    id="departureTime"
                                                    value={time}
                                                    {...register("departureTime")}
                                                    onChange={(e) => {
                                                        setTime(e.target.value);
                                                    }}
                                                    className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                                />
                                                {<span className="text-deepRed">{errors.departureTime?.message}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-col flex-1">
                                        <label htmlFor="duration" className="flex gap-1 mb-1 items-center">
                                            Duration (minutes)
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="text"
                                            id="duration"
                                            {...register("duration")}
                                            placeholder="Ex: 90"
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.duration?.message}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="bookingDeadline" className="flex gap-1 mb-1 items-center">
                                            Booking deadline
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="date"
                                            pattern="\d{4}-\d{2}-\d{2}"
                                            id="bookingDeadline"
                                            {...register("bookingDeadline")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.bookingDeadline?.message}</span>}
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="cancellationDeadline" className="flex gap-1 mb-1 items-center">
                                            Cancellation deadline
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="date"
                                            pattern="\d{4}-\d{2}-\d{2}"
                                            id="cancellationDeadline"
                                            {...register("cancellationDeadline")}
                                            className="bg-[rgba(141,124,221,0.1)] col-span-2 text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.cancellationDeadline?.message}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="movieParticipantIds" className="flex gap-1 mb-1 items-center">
                                            Departure airport
                                            <IsRequired />
                                        </label>
                                        <Tippy
                                            visible={departureAirportVisible}
                                            interactive
                                            onClickOutside={() => setDepartureAirportVisible(false)}
                                            offset={[0, 0]}
                                            placement="bottom"
                                            render={(attrs) => (
                                                <ul
                                                    className={`border border-primary rounded-lg p-2 max-h-[300px] w-[290px] overflow-y-scroll no-scrollbar bg-background ${
                                                        departureAirportVisible
                                                            ? "border-t-0 rounded-tl-none rounded-tr-none"
                                                            : ""
                                                    }`}
                                                    {...attrs}
                                                >
                                                    {airportData &&
                                                        airportData
                                                            .filter((airport) => airport._id !== arrivalAirport.id)
                                                            .map((airport) => (
                                                                <li
                                                                    onClick={() => {
                                                                        setDepartureAirport({
                                                                            name: airport.name,
                                                                            id: airport._id
                                                                        });
                                                                        setDepartureAirportVisible(false);
                                                                    }}
                                                                    key={airport._id}
                                                                    className={`cursor-pointer py-2 px-4 text-[13px] hover:bg-primary text-left rounded-lg flex items-center p-2 ${
                                                                        airport._id === departureAirport.id ||
                                                                        airport._id === arrivalAirport.id
                                                                            ? "text-blue pointer-events-none"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    {airport.name}
                                                                </li>
                                                            ))}
                                                </ul>
                                            )}
                                        >
                                            <div
                                                className={`hover:border-primary py-3 px-4 border-blue border bg-background cursor-pointer w-[290px] mt-1 ${
                                                    departureAirportVisible
                                                        ? "rounded-tl-lg rounded-tr-lg border-primary"
                                                        : "rounded-lg"
                                                }   flex justify-between items-center text-[13px]`}
                                                onClick={() => setDepartureAirportVisible(!departureAirportVisible)}
                                            >
                                                {departureAirport.name === ""
                                                    ? "Choose an airport"
                                                    : departureAirport.name}
                                                <i className={`${departureAirportVisible ? "rotate-180" : ""}`}>
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
                                        {formSubmitted && departureAirport.id === "" && (
                                            <span className="text-deepRed">Departure airport is required.</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="movieParticipantIds" className="flex gap-1 mb-1 items-center">
                                            Arrival airport
                                            <IsRequired />
                                        </label>
                                        <Tippy
                                            visible={arrivalAirportVisible}
                                            interactive
                                            onClickOutside={() => setArrivalAirportVisible(false)}
                                            offset={[0, 0]}
                                            placement="bottom"
                                            render={(attrs) => (
                                                <ul
                                                    className={`border border-primary rounded-lg p-2 max-h-[300px] w-[290px] overflow-y-scroll no-scrollbar bg-background ${
                                                        arrivalAirportVisible
                                                            ? "border-t-0 rounded-tl-none rounded-tr-none"
                                                            : ""
                                                    }`}
                                                    {...attrs}
                                                >
                                                    {airportData &&
                                                        airportData
                                                            .filter((airport) => departureAirport.id !== airport._id)
                                                            .map((airport) => (
                                                                <li
                                                                    onClick={() => {
                                                                        setArrivalAirport({
                                                                            name: airport.name,
                                                                            id: airport._id
                                                                        });
                                                                        setArrivalAirportVisible(false);
                                                                    }}
                                                                    key={airport._id}
                                                                    className={`cursor-pointer py-2 px-4 text-[13px] hover:bg-primary text-left rounded-lg flex items-center p-2 ${
                                                                        airport._id === arrivalAirport.id ||
                                                                        airport._id === departureAirport.id
                                                                            ? "text-blue pointer-events-none"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    {airport.name}
                                                                </li>
                                                            ))}
                                                </ul>
                                            )}
                                        >
                                            <div
                                                className={`hover:border-primary py-3 px-4 border-blue border bg-background cursor-pointer w-[290px] mt-1 ${
                                                    arrivalAirportVisible
                                                        ? "rounded-tl-lg rounded-tr-lg border-primary"
                                                        : "rounded-lg"
                                                }   flex justify-between items-center text-[13px]`}
                                                onClick={() => setArrivalAirportVisible(!arrivalAirportVisible)}
                                            >
                                                {arrivalAirport.name === "" ? "Choose an airport" : arrivalAirport.name}
                                                <i className={`${arrivalAirportVisible ? "rotate-180" : ""}`}>
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
                                                    arrivalAirport.id === "" &&
                                                    "Arrival airport is required."}
                                            </span>
                                        }
                                    </div>
                                </div>
                                <div className="outline outline-1 outline-border my-2"></div>
                                <div className="text-blue text-[15px]">First class seats</div>
                                <div className="flex gap-2 flex-col">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="flex gap-2 flex-col">
                                            <label
                                                htmlFor="firstClassCapacity"
                                                className="flex gap-1 mb-1 items-center"
                                            >
                                                Seating capacity
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="text"
                                                id="firstClassCapacity"
                                                placeholder="Ex: 20"
                                                {...register("firstClassCapacity")}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                            {<span className="text-deepRed">{errors.firstClassCapacity?.message}</span>}
                                        </div>

                                        <div className="flex gap-2 flex-col">
                                            <label
                                                htmlFor="firstClassBookedSeats"
                                                className="flex gap-1 mb-1 items-center"
                                            >
                                                Booked seats
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="text"
                                                id="firstClassBookedSeats"
                                                placeholder="Ex: 10"
                                                {...register("firstClassBookedSeats")}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                            {
                                                <span className="text-deepRed">
                                                    {errors.firstClassBookedSeats?.message}
                                                </span>
                                            }
                                        </div>
                                        <div className="flex gap-2 flex-col">
                                            <label className="flex gap-1 mb-1 items-center">Status</label>
                                            <Tippy
                                                interactive
                                                onClickOutside={() => setStatus1Visible(!status1Visible)}
                                                visible={status1Visible}
                                                offset={[0, 0]}
                                                placement="bottom"
                                                render={(attrs) => (
                                                    <div
                                                        {...attrs}
                                                        className={`flex w-[188px] text-white p-2 rounded-bl-lg rounded-br-lg flex-col bg-background outline-1 outline-border outline justify-center ${
                                                            status1Visible ? "outline-primary" : ""
                                                        }`}
                                                    >
                                                        <div
                                                            onClick={() => {
                                                                setStatus1(false);
                                                                setStatus1Visible(false);
                                                            }}
                                                            className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                                status1 === false ? "text-blue pointer-events-none" : ""
                                                            }`}
                                                        >
                                                            False
                                                        </div>
                                                        <div
                                                            onClick={() => {
                                                                setStatus1(true);
                                                                setStatus1Visible(false);
                                                            }}
                                                            className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                                status1 === true ? "text-blue pointer-events-none" : ""
                                                            }`}
                                                        >
                                                            True
                                                        </div>
                                                    </div>
                                                )}
                                            >
                                                <div
                                                    tabIndex={-1}
                                                    onClick={() => setStatus1Visible(!status1Visible)}
                                                    className={`hover:outline-primary py-3 px-4 outline-blue outline-1 outline bg-[rgba(141,124,221,0.1)] cursor-pointer ${
                                                        status1Visible
                                                            ? "rounded-tl-lg rounded-tr-lg outline-primary"
                                                            : "rounded-lg"
                                                    }   flex justify-between items-center`}
                                                >
                                                    {status1 === false ? "False" : "True"}
                                                    <i className={`${status1Visible ? "rotate-180" : ""}`}>
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
                                    </div>
                                </div>
                                <div className="text-blue text-[15px]">Second class seats</div>
                                <div className="flex gap-2 flex-col">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="flex gap-2 flex-col">
                                            <label
                                                htmlFor="secondClassCapacity"
                                                className="flex gap-1 mb-1 items-center"
                                            >
                                                Seating capacity
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="text"
                                                id="secondClassCapacity"
                                                placeholder="Ex: 80"
                                                {...register("secondClassCapacity")}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                            {
                                                <span className="text-deepRed">
                                                    {errors.secondClassCapacity?.message}
                                                </span>
                                            }
                                        </div>

                                        <div className="flex gap-2 flex-col">
                                            <label
                                                htmlFor="secondClassBookedSeats"
                                                className="flex gap-1 mb-1 items-center"
                                            >
                                                Booked seats
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="text"
                                                id="secondClassBookedSeats"
                                                placeholder="Ex: 60"
                                                {...register("secondClassBookedSeats")}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                            {
                                                <span className="text-deepRed">
                                                    {errors.secondClassBookedSeats?.message}
                                                </span>
                                            }
                                        </div>
                                        <div className="flex gap-2 flex-col">
                                            <label className="flex gap-1 mb-1 items-center">Status</label>
                                            <Tippy
                                                interactive
                                                onClickOutside={() => setStatus2Visible(!status2Visible)}
                                                visible={status2Visible}
                                                offset={[0, 0]}
                                                placement="bottom"
                                                render={(attrs) => (
                                                    <div
                                                        {...attrs}
                                                        className={`flex w-[188px] text-white p-2 rounded-bl-lg rounded-br-lg flex-col bg-background outline-1 outline-border outline justify-center ${
                                                            status2Visible ? "outline-primary" : ""
                                                        }`}
                                                    >
                                                        <div
                                                            onClick={() => {
                                                                setStatus2(false);
                                                                setStatus2Visible(false);
                                                            }}
                                                            className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                                status2 === false ? "text-blue pointer-events-none" : ""
                                                            }`}
                                                        >
                                                            False
                                                        </div>
                                                        <div
                                                            onClick={() => {
                                                                setStatus2(true);
                                                                setStatus2Visible(false);
                                                            }}
                                                            className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                                status2 === true ? "text-blue pointer-events-none" : ""
                                                            }`}
                                                        >
                                                            True
                                                        </div>
                                                    </div>
                                                )}
                                            >
                                                <div
                                                    tabIndex={-1}
                                                    onClick={() => setStatus2Visible(!status2Visible)}
                                                    className={`hover:outline-primary py-3 px-4 outline-blue outline-1 outline bg-[rgba(141,124,221,0.1)] cursor-pointer ${
                                                        status2Visible
                                                            ? "rounded-tl-lg rounded-tr-lg outline-primary"
                                                            : "rounded-lg"
                                                    }   flex justify-between items-center`}
                                                >
                                                    {status2 === false ? "False" : "True"}
                                                    <i className={`${status2Visible ? "rotate-180" : ""}`}>
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
                                    </div>
                                </div>
                                <div className="outline outline-1 outline-border my-2"></div>
                                <div className="text-blue text-[15px]">Intermediate Airports</div>
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="p-6 relative rounded-xl border grid grid-rows-2 gap-4 mb-2 border-primary"
                                    >
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex col-span-2 gap-4">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex gap-2 flex-col">
                                                        <label
                                                            htmlFor="movieParticipantIds"
                                                            className="flex gap-1 mb-1 items-center"
                                                        >
                                                            Airport {index + 1}
                                                            <IsRequired />
                                                        </label>
                                                        <Tippy
                                                            trigger="click"
                                                            visible={dropdownStates[index]}
                                                            interactive
                                                            onClickOutside={() =>
                                                                setDropdownStates((prevState) =>
                                                                    prevState.map((state, i) =>
                                                                        i === index ? false : state
                                                                    )
                                                                )
                                                            }
                                                            offset={[0, 0]}
                                                            placement="bottom"
                                                            render={(attrs) => (
                                                                <ul
                                                                    className={`border border-primary rounded-lg p-2 max-h-[300px] w-[358px] overflow-y-scroll no-scrollbar bg-background ${
                                                                        dropdownStates[index]
                                                                            ? "border-t-0 rounded-tl-none rounded-tr-none"
                                                                            : ""
                                                                    }`}
                                                                    {...attrs}
                                                                >
                                                                    {airportData &&
                                                                        airportData
                                                                            .filter(
                                                                                (airport) =>
                                                                                    airport._id !==
                                                                                        departureAirport.id &&
                                                                                    airport._id !== arrivalAirport.id
                                                                            )
                                                                            .filter(filterAvailableAirports)
                                                                            .map((airport) => (
                                                                                <li
                                                                                    onClick={() =>
                                                                                        handleAirportSelect(
                                                                                            airport,
                                                                                            index
                                                                                        )
                                                                                    }
                                                                                    key={airport._id}
                                                                                    className={`cursor-pointer py-2 px-4 text-[13px] hover:bg-primary text-left rounded-lg flex items-center p-2`}
                                                                                >
                                                                                    {airport.name}
                                                                                </li>
                                                                            ))}
                                                                </ul>
                                                            )}
                                                        >
                                                            <div
                                                                className={`hover:border-primary py-3 px-4 border-blue border bg-background cursor-pointer w-[358px] ${
                                                                    dropdownStates[index]
                                                                        ? "rounded-tl-lg rounded-tr-lg border-primary"
                                                                        : "rounded-lg"
                                                                }   flex justify-between items-center`}
                                                                onClick={() =>
                                                                    setDropdownStates((prevState) => {
                                                                        const newState = [...prevState];
                                                                        newState[index] = !newState[index];
                                                                        return newState;
                                                                    })
                                                                }
                                                            >
                                                                {selectedAirports[index]
                                                                    ? selectedAirports[index].name
                                                                    : "Choose an airport"}
                                                                <i
                                                                    className={`${
                                                                        dropdownStates[index] ? "rotate-180" : ""
                                                                    }`}
                                                                >
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
                                                                    selectedAirports.length < fields.length &&
                                                                    typeof selectedAirports[index] === "undefined" &&
                                                                    "Airport is required."}
                                                            </span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-col w-full">
                                                <label
                                                    htmlFor={`stop_duration_${index}`}
                                                    className="flex gap-1 mb-1 items-center"
                                                >
                                                    Stop duration
                                                    <IsRequired />
                                                </label>
                                                <input
                                                    type="text"
                                                    id={`stop_duration_${index}`}
                                                    {...register(`intermediateAirport.${index}.stopDuration` as const)}
                                                    placeholder="Ex: 30"
                                                    className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                                />
                                                <span className="text-deepRed">
                                                    {errors?.intermediateAirport?.[index]?.stopDuration?.message}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 flex-col">
                                            <label htmlFor={`note_${index}`} className="flex gap-1 mb-1 items-center">
                                                Note
                                            </label>
                                            <input
                                                type="text"
                                                id={`note_${index}`}
                                                placeholder="Ex: Refueling"
                                                {...register(`intermediateAirport.${index}.note` as const)}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                            <div className="absolute top-2 right-2">
                                                <button
                                                    className="border border-1 border-blue rounded-full p-1 hover:border-primary hover:bg-primary flex justify-center"
                                                    type="button"
                                                    onClick={() => {
                                                        remove(index);
                                                        setSelectedAirports((prevSelectedAirports) =>
                                                            prevSelectedAirports.filter((_, idx) => idx !== index)
                                                        );
                                                    }}
                                                >
                                                    <i>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            width={16}
                                                            height={16}
                                                            id="close"
                                                        >
                                                            <path
                                                                className="fill-white"
                                                                d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
                                                            ></path>
                                                        </svg>
                                                    </i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center justify-center">
                                    <button
                                        type="button"
                                        className="outline outline-1 outline-blue px-5 py-3 rounded-lg hover:outline-primary hover:bg-primary"
                                        onClick={() => append({ stopDuration: 0, note: "" })}
                                    >
                                        Add new airport
                                    </button>
                                </div>
                                <div className="outline outline-1 outline-border my-2"></div>
                                <button
                                    className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                    type="submit"
                                    onClick={() => {
                                        setFormSubmitted(true);
                                    }}
                                >
                                    Create flight schedule
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    );
}

export default FlightSchedule;
