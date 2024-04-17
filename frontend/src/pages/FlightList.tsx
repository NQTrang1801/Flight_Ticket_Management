import axios from "~/utils/axios";
import { useState, useEffect } from "react";
import usePortal from "react-cool-portal";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsRequired from "~/icons/IsRequired";
import { convertToBase64 } from "~/utils/convertToBase64";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";
import Tippy from "@tippyjs/react/headless";
import convertReleaseDate from "~/utils/convertReleaseDate";
import SkeletonActors from "~/components/SkeletonActors";
import { useAppSelector } from "~/hook";
import Flight from "~/components/Flight";

const schema = yup.object().shape({
    fullName: yup.string().required("Full name is required."),
    dateOfBirth: yup.date().required("Birth date is required.").typeError("Birth date must be a date."),
    biography: yup.string().required("Biography is required."),
    nationality: yup.string().required("Nationality is required.")
});

const flightTickets = [
    {
        index: 1,
        bookingCode: "BM401",
        departureAirport: "HAN",
        arrivalAirport: "SGN",
        departureTime: "2024-04-13 08:00",
        duration: "2 hours",
        availableSeats: 100,
        bookedSeats: 0
    },
    {
        index: 2,
        bookingCode: "BM402",
        departureAirport: "SGN",
        arrivalAirport: "DAD",
        departureTime: "2024-04-13 10:00",
        duration: "1.5 hours",
        availableSeats: 80,
        bookedSeats: 20
    },
    {
        index: 3,
        bookingCode: "BM403",
        departureAirport: "DAD",
        arrivalAirport: "HAN",
        departureTime: "2024-04-13 12:00",
        duration: "1 hour",
        availableSeats: 50,
        bookedSeats: 10
    },
    {
        index: 4,
        bookingCode: "BM404",
        departureAirport: "HAN",
        arrivalAirport: "DAD",
        departureTime: "2024-04-13 14:00",
        duration: "1.5 hours",
        availableSeats: 90,
        bookedSeats: 5
    },
    {
        index: 5,
        bookingCode: "BM405",
        departureAirport: "DAD",
        arrivalAirport: "SGN",
        departureTime: "2024-04-13 16:00",
        duration: "2 hours",
        availableSeats: 70,
        bookedSeats: 30
    }
];

function FlightList() {
    const [data, setData] = useState(flightTickets);
    const [loading, setLoading] = useState(false);
    const [deletingMode, setDeletingMode] = useState(false);
    const { Portal, show, hide } = usePortal({
        defaultShow: false
    });
    const dispatch = useAppDispatch();
    const [selectedFile, setSelectedFile] = useState<File>();
    const [gender, setGender] = useState("male");
    const [genderVisible, setGenderVisible] = useState(false);
    const { query } = useAppSelector((state) => state.searching!);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<IActor>({
        resolver: yupResolver(schema)
    });

    const convert = async (file: File) => {
        if (file) {
            try {
                return await convertToBase64(file);
            } catch (error) {
                console.error("Failed to convert image to base64:", error);
            }
        }
    };

    const onSubmit: SubmitHandler<IActor> = async (data) => {
        hide();
        dispatch(startLoading());
        const fullName = data.fullName;
        const dateOfBirth = convertReleaseDate(data.dateOfBirth);
        const biography = data.biography;
        const nationality = data.nationality;

        (async () => {
            try {
                const base64ProfilePicture = await convert(selectedFile!);
                await axios.post(
                    "/people",
                    {
                        fullName,
                        base64ProfilePicture,
                        dateOfBirth,
                        biography,
                        nationality,
                        gender
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.accessToken}`
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
        setLoading(true);
        (async () => {
            await axios
                .get("/people/no-pagination", { headers: { "Content-Type": "application/json" } })
                .then((response) => {
                    setData(response.data);
                    setLoading(false);
                })
                .catch((err) => console.error(err));
        })();
    }, []);

    return (
        <>
            <div className="flex justify-end items-center mb-6">
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => {
                            setDeletingMode(false);
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
            </div>
            {deletingMode && (
                <div className="shadow-xl rounded-xl bg-block mb-6">
                    <div className="bg-primary h-6 rounded-tr-xl rounded-tl-xl"></div>
                    <div className="p-6 text-[15px]">Select an actor below to delete.</div>
                </div>
            )}
            <div className="bg-block p-6 rounded-3xl shadow-xl">
                <table className="w-full bg-block">
                    <thead>
                        <tr className="text-center bg-primary">
                            <th className="w-32">Index</th>
                            <th className="">Departure airport</th>
                            <th className="">Arrival airport</th>
                            <th className="">Departure time</th>
                            <th className="">Duration</th>
                            <th className="">Available seats</th>
                            <th className="">Booked seats</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data
                            // ?.filter((actor) => actor.fullName.toLowerCase().includes(query.toLowerCase()))
                            .map((flight) => (
                                <Flight
                                    index={flight.index}
                                    key={flight.bookingCode}
                                    departureAirport={flight.departureAirport}
                                    arrivalAirport={flight.arrivalAirport}
                                    departureTime={flight.departureTime}
                                    duration={flight.duration}
                                    bookedSeats={flight.bookedSeats}
                                    availableSeats={flight.availableSeats}
                                />
                            ))}
                    </tbody>
                </table>
            </div>
            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="border border-blue p-8 bg-background relative rounded-xl max-h-[810px] w-[810px] max-w-[662px]  overflow-y-scroll no-scrollbar">
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
                                <div className="text-white font-semibold text-xl">Create new ticket</div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                                <div className="grid grid-cols-2 gap-4">
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
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="nationality" className="flex gap-1 mb-1 items-center">
                                            Nationality
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="text"
                                            id="nationality"
                                            placeholder="Nationality . . ."
                                            {...register("nationality")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.nationality?.message}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="dateOfBirth" className="flex gap-1 mb-1 items-center">
                                            Birthday
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="date"
                                            pattern="\d{4}-\d{2}-\d{2}"
                                            id="dateOfBirth"
                                            {...register("dateOfBirth")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.dateOfBirth?.message}</span>}
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="active" className="flex gap-1 mb-1 items-center">
                                            Gender
                                        </label>
                                        <Tippy
                                            interactive
                                            onClickOutside={() => setGenderVisible(!genderVisible)}
                                            visible={genderVisible}
                                            offset={[0, -149]}
                                            render={(attrs) => (
                                                <div
                                                    {...attrs}
                                                    className={`flex w-[290px] text-white p-2 rounded-bl-lg rounded-br-lg flex-col bg-background outline-1 outline-border outline justify-center ${
                                                        genderVisible ? "outline-primary" : ""
                                                    }`}
                                                >
                                                    <div
                                                        onClick={() => {
                                                            setGender("male");
                                                            setGenderVisible(false);
                                                        }}
                                                        className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                            gender === "male" ? "text-blue pointer-events-none" : ""
                                                        }`}
                                                    >
                                                        Male
                                                    </div>
                                                    <div
                                                        onClick={() => {
                                                            setGender("female");
                                                            setGenderVisible(false);
                                                        }}
                                                        className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                            gender === "female" ? "text-blue pointer-events-none" : ""
                                                        }`}
                                                    >
                                                        Female
                                                    </div>
                                                </div>
                                            )}
                                        >
                                            <div
                                                tabIndex={-1}
                                                onClick={() => setGenderVisible(!genderVisible)}
                                                className={`hover:outline-primary py-3 px-4 outline-blue outline-1 outline bg-[rgba(141,124,221,0.1)] cursor-pointer ${
                                                    genderVisible
                                                        ? "rounded-tl-lg rounded-tr-lg outline-primary"
                                                        : "rounded-lg"
                                                }   flex justify-between items-center`}
                                            >
                                                {gender === "male" ? "Male" : "Female"}
                                                <i className={`${genderVisible ? "rotate-180" : ""}`}>
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
                                <div className="flex gap-2 flex-col">
                                    <label htmlFor="biography" className="flex gap-1 mb-1 items-center">
                                        Biography
                                        <IsRequired />
                                    </label>
                                    <textarea
                                        id="biography"
                                        placeholder="Biography . . ."
                                        {...register("biography")}
                                        className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                    />
                                    {<span className="text-deepRed">{errors.biography?.message}</span>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="picture" className="flex gap-1 mb-1 items-center">
                                        Profile picture
                                        <IsRequired />
                                    </label>
                                    <input
                                        type="file"
                                        id="picture"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                setSelectedFile(e.target.files[0]);
                                            }
                                        }}
                                        className="bg-[rgba(141,124,221,0.1)] text-sm focus:border-primary focus:border focus:border-1 border border-blue border-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                    />
                                </div>
                                <button
                                    className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                    type="submit"
                                >
                                    Create ticket
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    );
}

export default FlightList;
