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
import ScheduleList from "~/components/ScheduleList";

const schema = yup.object().shape({
    flightNumber: yup.string().required("Flight number is required."),
    flightCode: yup.string().required("Flight code is required."),
    duration: yup.number().required("Duration is required.").typeError("Duration must be a number."),
    ticketPrice: yup.number().required("Duration is required.").typeError("Duration must be a number."),
    departureDate: yup.date().required("Departure date is required.").typeError("Departure date must be a date."),
    departureTime: yup.date().required("Departure time is required."),
    // releaseDate: yup.date().required("Release date is required.").typeError("Release date must be a date."),
    // nation: yup.string().required("Nation is required."),
    // director: yup.string().required("Director is required."),
    // moviePosters: yup
    //     .array()
    //     .of(
    //         yup.object().shape({
    //             base64: yup.mixed(),
    //             isThumb: yup.boolean().required()
    //         })
    //     )
    //     .required()

    intermediateAirport: yup.array().of(
        yup.object().shape({
            stopDuration: yup
                .number()
                .required("Stop duration is required.")
                .typeError("Stop duration must be a number."),
            note: yup.string()
        })
    )
    // .required("Intermediate is required")
});

function FlightSchedule() {
    const [data, setData] = useState<FlightScheduleData>();
    const [airportData, setAirportData] = useState<AirportProps[]>();

    const [departureAirport, setDepartureAirport] = useState({
        id: "",
        name: ""
    });
    const [arrivalAirport, setArrivalAirport] = useState({
        id: "",
        name: ""
    });

    const [seats, setSeats] = useState([
        { class: "1", count: 0, booked_seats: 0, status: true },
        { class: "2", count: 0, booked_seats: 0, status: true }
    ]);

    const dispatch = useAppDispatch();

    const [status1, setStatus1] = useState(true);
    const [status1Visible, setStatus1Visible] = useState(false);

    const [status2, setStatus2] = useState(true);
    const [status2Visible, setStatus2Visible] = useState(false);

    const [time, setTime] = useState();

    const [visible, setVisible] = useState(false);
    const [activeVisible, setActiveVisible] = useState(false);
    const [deletingMode, setDeletingMode] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("All");
    const [isActive, setActive] = useState(false);
    const [reloadFlag, setReloadFlag] = useState(false);
    const [error, setError] = useState(false);
    const [movieFilteringVisible, setMovieFilteringVisible] = useState(false);
    const [movieFiltering, setMovieFiltering] = useState<{ id: string; name: string }>({
        id: "",
        name: ""
    });
    const [categories, setCategories] = useState(
        Array<{
            id: string;
            name: string;
        }>
    );
    const [movieCategories, setMovieCategories] = useState(
        Array<{
            id: string;
            name: string;
        }>
    );
    const [participants, setParticipants] = useState(
        Array<{
            id: string;
            fullName: string;
            profilePicture: string;
        }>
    );
    const [movieParticipants, setMovieParticipants] = useState(
        Array<{
            id: string;
            fullName: string;
            profilePicture: string;
        }>
    );
    const [departureAirportVisible, setDepartureAirportVisible] = useState(false);
    const [arrivalAirportVisible, setArrivalAirportVisible] = useState(false);

    const { Portal, show, hide } = usePortal({
        defaultShow: false
    });
    const {
        control,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<IMovie>({
        resolver: yupResolver(schema)
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "intermediateAirport"
    });

    const [dropdownStates, setDropdownStates] = useState(fields.map(() => false));

    const [selectedAirports, setSelectedAirports] = useState(Array(fields.length).fill(null));

    const handleAirportSelect = (airport, index) => {
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

    const filterAvailableAirports = (airport) => {
        return selectedAirports.every((selectedAirport) => !selectedAirport || selectedAirport._id !== airport._id);
    };

    const onSubmit: SubmitHandler<AirportProps> = async (data) => {
        hide();
        dispatch(startLoading());
        const name = data.name;
        const country = data.country;
        const code = data.code;
        const terminals = data.terminals;
        const capacity = data.capacity;
        const address = data.address;

        (async () => {
            try {
                await axios.post(
                    "/airport/511454675/create",
                    {
                        name,
                        country,
                        code,
                        terminals,
                        capacity,
                        address,
                        timezone,
                        isInternational: international,
                        coordinates: {
                            type: "Point",
                            coordinates: [latitude, longitude]
                        },
                        status,
                        rule: []
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
            await axios
                .get("/flight/all", { headers: { "Content-Type": "application/json" } })
                .then((response) => {
                    setData(response.data);
                })
                .catch((err) => console.error(err));
        })();

        (async () => {
            await axios
                .get("/airport/all", { headers: { "Content-Type": "application/json" } })
                .then((response) => {
                    setAirportData(response.data);
                })
                .catch((err) => console.error(err));
        })();
    }, []);

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <div>
                        <Tippy
                            visible={visible}
                            interactive
                            onClickOutside={() => setVisible(false)}
                            offset={[0, 0]}
                            render={(attrs) => (
                                <div
                                    {...attrs}
                                    tabIndex={-1}
                                    className={`flex text-white p-2 rounded-bl-xl rounded-br-xl flex-col bg-background border-border border justify-center w-[232px] ${
                                        visible ? "border-primary border-t-0 bg-block" : ""
                                    }`}
                                >
                                    <button
                                        onClick={() => {
                                            setType("");
                                            setVisible(false);
                                            setTitle("All");
                                        }}
                                        className={`py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                            type === "" ? "text-blue pointer-events-none" : ""
                                        }`}
                                    >
                                        All movies
                                    </button>
                                    <button
                                        onClick={() => {
                                            setType("BANNER");
                                            setVisible(false);
                                            setTitle("Banner");
                                        }}
                                        className={`py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                            type === "BANNER" ? "text-blue pointer-events-none" : ""
                                        }`}
                                    >
                                        Banner movies
                                    </button>
                                    <button
                                        onClick={() => {
                                            setType("NOW_PLAYING");
                                            setVisible(false);
                                            setTitle("Now playing");
                                        }}
                                        className={`py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                            type === "NOW_PLAYING" ? "text-blue pointer-events-none" : ""
                                        }`}
                                    >
                                        Now playing movies
                                    </button>
                                    <button
                                        onClick={() => {
                                            setType("TOP_FEATURED");
                                            setVisible(false);
                                            setTitle("Top featured");
                                        }}
                                        className={`py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                            type === "TOP_FEATURED" ? "text-blue pointer-events-none" : ""
                                        }`}
                                    >
                                        Top featured movies
                                    </button>
                                    <button
                                        onClick={() => {
                                            setType("COMING_SOON");
                                            setVisible(false);
                                            setTitle("Coming soon");
                                        }}
                                        className={`py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                            type === "COMING_SOON" ? "text-blue pointer-events-none" : ""
                                        }`}
                                    >
                                        Coming soon movies
                                    </button>
                                </div>
                            )}
                        >
                            <button
                                onClick={() => setVisible(!visible)}
                                className={`hover:border-primary bg-block py-3 px-5 border-blue border ${
                                    visible ? "rounded-tl-xl rounded-tr-xl border-primary" : "rounded-xl"
                                }   flex justify-between items-center w-[232px]`}
                            >
                                <span className="">{title} movies</span>
                                <i className={`${visible ? "rotate-180" : ""}`}>
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
                            </button>
                        </Tippy>
                    </div>
                    <div>
                        <Tippy
                            visible={movieFilteringVisible}
                            interactive
                            onClickOutside={() => setMovieFilteringVisible(false)}
                            offset={[0, 0]}
                            render={(attrs) => (
                                <div
                                    {...attrs}
                                    tabIndex={-1}
                                    className={`flex text-white p-2 rounded-bl-xl rounded-br-xl flex-col bg-background border-border border justify-center w-[170px] ${
                                        movieFilteringVisible ? "border-primary border-t-0 bg-block" : ""
                                    }`}
                                >
                                    <button
                                        onClick={() => {
                                            setMovieFiltering({ id: "", name: "" });
                                            setMovieFilteringVisible(false);
                                        }}
                                        className={`py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                            movieFiltering.id === "" && "text-blue pointer-events-none"
                                        }`}
                                    >
                                        All categories
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => {
                                                setMovieFiltering({ id: category.id, name: category.name });
                                                setMovieFilteringVisible(false);
                                            }}
                                            className={`py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                movieFiltering.id === category.id ? "text-blue pointer-events-none" : ""
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        >
                            <button
                                onClick={() => setMovieFilteringVisible(!movieFilteringVisible)}
                                className={`hover:border-primary bg-block py-3 px-5 border-blue border ${
                                    movieFilteringVisible ? "rounded-tl-xl rounded-tr-xl border-primary" : "rounded-xl"
                                }   flex justify-between items-center w-[170px]`}
                            >
                                {movieFiltering.id !== "" ? (
                                    <span className="">{movieFiltering.name}</span>
                                ) : (
                                    <span className="">All categories</span>
                                )}
                                <i className={`${movieFilteringVisible ? "rotate-180" : ""}`}>
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
                            </button>
                        </Tippy>
                    </div>
                </div>
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => {
                            setDeletingMode(false);
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
            {deletingMode && (
                <div className="shadow-xl rounded-xl bg-block mb-6">
                    <div className="bg-primary h-6 rounded-tr-xl rounded-tl-xl"></div>
                    <div className="p-6 text-[15px]">Select a movie below to delete.</div>
                </div>
            )}
            <ScheduleList
                type={type}
                deletingMode={deletingMode}
                reloadFlag={reloadFlag}
                categoryId={movieFiltering.id}
            />
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
                                            placeholder="Flight number . . ."
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
                                            placeholder="Flight code . . ."
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.flightCode?.message}</span>}
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="ticketPrice" className="flex gap-1 mb-1 items-center">
                                            Ticket price
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="number"
                                            id="ticketPrice"
                                            {...register("ticketPrice")}
                                            placeholder=""
                                            defaultValue="0"
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
                                                <label htmlFor="releaseDate" className="flex gap-1 mb-1 items-center">
                                                    Departure time
                                                    <IsRequired />
                                                </label>
                                                <input
                                                    type="time"
                                                    id="releaseDate"
                                                    value={time}
                                                    onChange={(e) => setTime(e.target.value)}
                                                    className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                                />
                                            </div>
                                        </div>
                                        {<span className="text-deepRed">{errors.startTime?.message}</span>}
                                    </div>
                                    <div className="flex gap-2 flex-col flex-1">
                                        <label htmlFor="duration" className="flex gap-1 mb-1 items-center">
                                            Duration (minutes)
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="number"
                                            id="duration"
                                            {...register("duration")}
                                            placeholder=""
                                            defaultValue="0"
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.duration?.message}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="releaseDate" className="flex gap-1 mb-1 items-center">
                                            Booking deadline
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="date"
                                            pattern="\d{4}-\d{2}-\d{2}"
                                            id="releaseDate"
                                            {...register("startTime")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="releaseDate" className="flex gap-1 mb-1 items-center">
                                            Cancellation deadline
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="date"
                                            pattern="\d{4}-\d{2}-\d{2}"
                                            id="releaseDate"
                                            {...register("startTime")}
                                            className="bg-[rgba(141,124,221,0.1)] col-span-2 text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
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
                                                }   flex justify-between items-center`}
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
                                                }   flex justify-between items-center`}
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
                                    </div>
                                </div>
                                <div className="outline outline-1 outline-border my-2"></div>
                                <div className="text-blue text-[15px]">First class</div>
                                <div className="flex gap-2 flex-col">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="flex gap-2 flex-col">
                                            <label className="flex gap-1 mb-1 items-center">
                                                Seating capacity
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="number"
                                                id="count_1"
                                                defaultValue="0"
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                        </div>

                                        <div className="flex gap-2 flex-col">
                                            <label className="flex gap-1 mb-1 items-center">
                                                Booked seats
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="number"
                                                id="booked_seats_1"
                                                defaultValue="0"
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                        </div>
                                        <div className="flex gap-2 flex-col">
                                            <label className="flex gap-1 mb-1 items-center">
                                                Status
                                                <IsRequired />
                                            </label>

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
                                <div className="text-blue text-[15px]">Second class</div>
                                <div className="flex gap-2 flex-col">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="flex gap-2 flex-col">
                                            <label className="flex gap-1 mb-1 items-center">
                                                Seating capacity
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="number"
                                                id="count_2"
                                                defaultValue="0"
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                        </div>

                                        <div className="flex gap-2 flex-col">
                                            <label className="flex gap-1 mb-1 items-center">
                                                Booked seats
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="number"
                                                id="booked_seats_2"
                                                defaultValue="0"
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                        </div>
                                        <div className="flex gap-2 flex-col">
                                            <label className="flex gap-1 mb-1 items-center">
                                                Status
                                                <IsRequired />
                                            </label>
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
                                                    type="number"
                                                    id={`stop_duration_${index}`}
                                                    {...register(`intermediateAirport.${index}.stopDuration` as const)}
                                                    defaultValue="0"
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
                                                placeholder="Note . . ."
                                                {...register(`intermediateAirport.${index}.note` as const)}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                            <div className="absolute top-2 right-2">
                                                <button
                                                    className="border border-1 border-blue rounded-full p-1 hover:border-primary hover:bg-primary flex justify-center"
                                                    type="button"
                                                    onClick={() => remove(index)}
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
