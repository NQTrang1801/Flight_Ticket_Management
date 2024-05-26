import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import { useState, useEffect } from "react";
import usePortal from "react-cool-portal";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import axios from "~/utils/axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsRequired from "~/icons/IsRequired";
import { useAppDispatch, useAppSelector } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";
import convertDate from "~/utils/convertDate";
import ScheduleItem from "~/components/administrator/ScheduleItem";
import shortenAirportName from "~/utils/shortenAirportName";

const schema = yup.object().shape({
    flightNumber: yup.string().required("Flight number is required."),
    duration: yup.number().required("Duration is required.").typeError("Duration must be a number."),
    ticketPrice: yup.number().required("Ticket price is required.").typeError("Ticket price must be a number."),
    departureDate: yup.date().required("Departure date is required.").typeError("Date is required."),
    departureTime: yup.string().required("Time is required.").typeError("Time is required."),
    firstClassCapacity: yup
        .number()
        .required("Seating capacity is required.")
        .typeError("Seating capacity must be a number."),

    secondClassCapacity: yup
        .number()
        .required("Seating capacity is required.")
        .typeError("Seating capacity must be a number."),

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
    const { query } = useAppSelector((state) => state.searching!);

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

    const [filteredDepartureAirport, setFilteredDepartureAirport] = useState<{
        address: string;
        code: string;
        country: string;
        name: string;
        _id: string;
    }>({ address: "", code: "", country: "", name: "", _id: "" });

    const [filteredArrivalAirport, setFilteredArrivalAirport] = useState<{
        address: string;
        code: string;
        country: string;
        name: string;
        _id: string;
    }>({ address: "", code: "", country: "", name: "", _id: "" });

    const [filteredDepartureAirportVisible, setFilteredDepartureAirportVisible] = useState(false);
    const [filteredArrivalAirportVisible, setFilteredArrivalAirportVisible] = useState(false);

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
        dispatch(startLoading());

        const flight_code =
            airportData?.filter((airport) => airport._id === departureAirport.id)[0].code +
            "-" +
            airportData?.filter((airport) => airport._id === arrivalAirport.id)[0].code;

        const flight_number = data.flightNumber;
        const ticket_price = data.ticketPrice;
        const departure_airport = departureAirport.id;
        const destination_airport = arrivalAirport.id;
        const duration = data.duration;
        const departure_datetime = `${convertDate(data.departureDate)} ${data.departureTime}:00`;

        const firstClassCapacity = data.firstClassCapacity;

        const secondClassCapacity = data.secondClassCapacity;

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
                                booked_seats: 0,
                                status: firstClassCapacity === 0 ? false : true
                            },
                            {
                                class: "2",
                                count: secondClassCapacity,
                                booked_seats: 0,
                                status: secondClassCapacity === 0 ? false : true
                            }
                        ],
                        transit_airports
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
                setTimeout(() => window.location.reload(), 1000);
            } catch (error) {
                dispatch(stopLoading());
                dispatch(sendMessage(`Created failed! ${error.response.data.message}`, "error"));
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

                setData(flightResponse.data);

                const airportResponse = await axios.get("airport/all", {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                });
                setAirportData(airportResponse.data);

                dispatch(stopLoading());
            } catch (error) {
                console.error(error);
            }
        })();
    }, [dispatch]);

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <div>
                        <Tippy
                            visible={filteredDepartureAirportVisible}
                            interactive
                            onClickOutside={() => setFilteredDepartureAirportVisible(false)}
                            offset={[0, 0]}
                            placement="bottom"
                            render={(attrs) => (
                                <ul
                                    className={`border border-primary rounded-xl p-2 w-[250px] bg-background ${
                                        filteredDepartureAirportVisible
                                            ? "border-t-0 rounded-tl-none rounded-tr-none"
                                            : ""
                                    }`}
                                    {...attrs}
                                >
                                    <li
                                        onClick={() => {
                                            setFilteredDepartureAirport({
                                                address: "",
                                                code: "",
                                                country: "",
                                                name: "",
                                                _id: ""
                                            });
                                            setFilteredDepartureAirportVisible(false);
                                        }}
                                        className={`cursor-pointer py-2 px-4 hover:bg-primary text-left rounded-xl flex items-center p-2 ${
                                            filteredDepartureAirport?._id === "" ? "text-blue pointer-events-none" : ""
                                        }`}
                                    >
                                        All airports
                                    </li>
                                    {airportData?.map((airport) => (
                                        <li
                                            onClick={() => {
                                                setFilteredDepartureAirport(airport);
                                                setFilteredDepartureAirportVisible(false);
                                            }}
                                            key={airport._id}
                                            className={`cursor-pointer py-2 px-4 hover:bg-primary text-left rounded-xl flex items-center p-2 ${
                                                filteredDepartureAirport?._id === airport._id
                                                    ? "text-blue pointer-events-none"
                                                    : ""
                                            }`}
                                        >
                                            {shortenAirportName(airport.name)}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        >
                            <div
                                className={`hover:border-primary py-3 px-4 border-blue border bg-background cursor-pointer w-[250px] ${
                                    filteredDepartureAirportVisible
                                        ? "rounded-tl-xl rounded-tr-xl border-primary"
                                        : "rounded-xl"
                                }   flex justify-between items-center`}
                                onClick={() => setFilteredDepartureAirportVisible(!filteredDepartureAirportVisible)}
                            >
                                Departure:{" "}
                                {filteredDepartureAirport._id !== ""
                                    ? shortenAirportName(filteredDepartureAirport.name)
                                    : "All airports"}
                                <i className={`${filteredDepartureAirportVisible ? "rotate-180" : ""}`}>
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
                    <div>
                        <Tippy
                            visible={filteredArrivalAirportVisible}
                            interactive
                            onClickOutside={() => setFilteredArrivalAirportVisible(false)}
                            offset={[0, 0]}
                            placement="bottom"
                            render={(attrs) => (
                                <ul
                                    className={`border border-primary rounded-xl p-2 w-[250px] bg-background ${
                                        filteredArrivalAirportVisible
                                            ? "border-t-0 rounded-tl-none rounded-tr-none"
                                            : ""
                                    }`}
                                    {...attrs}
                                >
                                    <li
                                        onClick={() => {
                                            setFilteredArrivalAirport({
                                                address: "",
                                                code: "",
                                                country: "",
                                                name: "",
                                                _id: ""
                                            });
                                            setFilteredArrivalAirportVisible(false);
                                        }}
                                        className={`cursor-pointer py-2 px-4 hover:bg-primary text-left rounded-xl flex items-center p-2 ${
                                            filteredArrivalAirport?._id === "" ? "text-blue pointer-events-none" : ""
                                        }`}
                                    >
                                        All airports
                                    </li>
                                    {airportData?.map((airport) => (
                                        <li
                                            onClick={() => {
                                                setFilteredArrivalAirport(airport);
                                                setFilteredArrivalAirportVisible(false);
                                            }}
                                            key={airport._id}
                                            className={`cursor-pointer py-2 px-4 hover:bg-primary text-left rounded-xl flex items-center p-2 ${
                                                filteredArrivalAirport?._id === airport._id
                                                    ? "text-blue pointer-events-none"
                                                    : ""
                                            }`}
                                        >
                                            {shortenAirportName(airport.name)}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        >
                            <div
                                className={`hover:border-primary py-3 px-4 border-blue border bg-background cursor-pointer w-[250px] ${
                                    filteredArrivalAirportVisible
                                        ? "rounded-tl-xl rounded-tr-xl border-primary"
                                        : "rounded-xl"
                                }   flex justify-between items-center`}
                                onClick={() => setFilteredArrivalAirportVisible(!filteredArrivalAirportVisible)}
                            >
                                Arrival:{" "}
                                {filteredArrivalAirport._id !== ""
                                    ? shortenAirportName(filteredArrivalAirport.name)
                                    : "All airports"}
                                <i className={`${filteredArrivalAirportVisible ? "rotate-180" : ""}`}>
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
                            data
                                .filter((flight) => flight.flight_number.toLowerCase().includes(query.toLowerCase()))
                                .filter((flight) => {
                                    const departureMatch = filteredDepartureAirport._id
                                        ? flight.departure_airport._id === filteredDepartureAirport._id
                                        : true;
                                    const arrivalMatch = filteredArrivalAirport._id
                                        ? flight.destination_airport._id === filteredArrivalAirport._id
                                        : true;
                                    return departureMatch && arrivalMatch;
                                })
                                .map((schedule) => (
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
                                        ticket_price={schedule.ticket_price}
                                        transit_airports={schedule.transit_airports}
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
                                <div className="grid grid-cols-2 gap-4">
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

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex gap-2 flex-col">
                                        <div className="flex gap-2 flex-col">
                                            <label
                                                htmlFor="firstClassCapacity"
                                                className="flex gap-1 mb-1 items-center"
                                            >
                                                First class seats
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
                                    </div>

                                    <div className="flex gap-2 flex-col">
                                        <div className="flex gap-2 flex-col">
                                            <label
                                                htmlFor="secondClassCapacity"
                                                className="flex gap-1 mb-1 items-center"
                                            >
                                                Second class seats
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
