import { useState, useEffect } from "react";
import axios from "~/utils/axios";
import ScheduleItem from "~/components/ScheduleItem";
import React from "react";
import SkeletonItem from "./SkeletonItem";
import ToolTip from "@tippyjs/react";
import { useAppSelector } from "~/hook";

interface Props {
    type: string;
    deletingMode: boolean;
    reloadFlag: boolean;
    categoryId: string;
}

const flightData: {
    flightCode: string;
    ticketPrice: number;
    departureAirport: string;
    arrivalAirport: string;
    dateTime: string;
    flightDuration: string;
    seatQuantityClass1: number;
    seatQuantityClass2: number;
    layover: {
        stt: number;
        airport: string;
        stopTime: string;
        note: string;
    }[];
}[] = [
    {
        flightCode: "VN123",
        ticketPrice: 100,
        departureAirport: "HAN",
        arrivalAirport: "SGN",
        dateTime: "2024-04-13 08:00",
        flightDuration: "2 hours",
        seatQuantityClass1: 10,
        seatQuantityClass2: 20,
        layover: [
            {
                stt: 1,
                airport: "DAD",
                stopTime: "1 hour",
                note: ""
            },
            {
                stt: 2,
                airport: "CXR",
                stopTime: "30 minutes",
                note: "Refueling"
            }
        ]
    },
    {
        flightCode: "VN456",
        ticketPrice: 120,
        departureAirport: "SGN",
        arrivalAirport: "DAD",
        dateTime: "2024-04-13 10:00",
        flightDuration: "1.5 hours",
        seatQuantityClass1: 8,
        seatQuantityClass2: 15,
        layover: [
            {
                stt: 1,
                airport: "HUI",
                stopTime: "45 minutes",
                note: ""
            }
        ]
    },
    {
        flightCode: "VN789",
        ticketPrice: 150,
        departureAirport: "DAD",
        arrivalAirport: "HAN",
        dateTime: "2024-04-13 12:00",
        flightDuration: "1 hour",
        seatQuantityClass1: 5,
        seatQuantityClass2: 10,
        layover: []
    },
    {
        flightCode: "VN246",
        ticketPrice: 110,
        departureAirport: "HAN",
        arrivalAirport: "DAD",
        dateTime: "2024-04-13 14:00",
        flightDuration: "1.5 hours",
        seatQuantityClass1: 12,
        seatQuantityClass2: 18,
        layover: [
            {
                stt: 1,
                airport: "SGN",
                stopTime: "1 hour",
                note: ""
            }
        ]
    },
    {
        flightCode: "VN135",
        ticketPrice: 130,
        departureAirport: "DAD",
        arrivalAirport: "SGN",
        dateTime: "2024-04-13 16:00",
        flightDuration: "2 hours",
        seatQuantityClass1: 6,
        seatQuantityClass2: 12,
        layover: [
            {
                stt: 1,
                airport: "HAN",
                stopTime: "45 minutes",
                note: ""
            }
        ]
    }
];

const ScheduleList: React.FC<Props> = ({ type, deletingMode, reloadFlag, categoryId }) => {
    const [data, setData] = useState(flightData);
    const [loading, setLoading] = useState(false);
    // const { query } = useAppSelector((state) => state.searching!);

    // useEffect(() => {
    //     setLoading(true);
    //     (async () => {
    //         await axios
    //             .get(
    //                 `/movies?page=1&take=20${
    //                     categoryId !== "" ? `&categoryId=${categoryId}` : ""
    //                 }&filterMovies=${type}`,
    //                 { headers: { "Content-Type": "application/json" } }
    //             )
    //             .then((response) => {
    //                 setData(response.data.data);
    //                 setLoading(false);
    //             })
    //             .catch((error) => console.error(error));
    //     })();
    // }, [type, reloadFlag, categoryId]);

    return (
        <div className="mb-10">
            <div className="bg-block p-6 rounded-3xl shadow-xl">
                <ul className="w-full grid grid-cols-1 gap-8">
                    {loading && <SkeletonItem />}
                    {!loading &&
                        (data.length > 0 ? (
                            data
                                // .filter((movie) => movie.name.toLowerCase().includes(query.toLowerCase()))
                                .map((item) => (
                                    <ScheduleItem
                                        flightCode={item.flightCode}
                                        key={item.flightCode}
                                        arrivalAirport={item.arrivalAirport}
                                        dateTime={item.dateTime}
                                        ticketPrice={item.ticketPrice}
                                        departureAirport={item.departureAirport}
                                        flightDuration={item.flightDuration}
                                        seatQuantityClass1={item.seatQuantityClass1}
                                        seatQuantityClass2={item.seatQuantityClass2}
                                        layover={item.layover}
                                    />
                                ))
                        ) : (
                            <li className="w-[calc((100%-96px)/5)] shadow-sm border border-blue aspect-square rounded-xl flex items-center justify-center group hover:border-primary">
                                <ToolTip content="Create a new movie">
                                    <button className="">
                                        <i>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                id="add"
                                                x="0"
                                                y="0"
                                                width={92}
                                                height={92}
                                                version="1.1"
                                                viewBox="0 0 29 29"
                                                xmlSpace="preserve"
                                            >
                                                <path
                                                    className="fill-blue group-hover:fill-primary"
                                                    d="M14.5 27.071c-6.893 0-12.5-5.607-12.5-12.5s5.607-12.5 12.5-12.5S27 7.678 27 14.571s-5.607 12.5-12.5 12.5zm0-23c-5.79 0-10.5 4.71-10.5 10.5s4.71 10.5 10.5 10.5S25 20.36 25 14.571s-4.71-10.5-10.5-10.5z"
                                                ></path>
                                                <path
                                                    className="fill-blue group-hover:fill-primary"
                                                    d="M14.5 21.571a1 1 0 0 1-1-1v-12a1 1 0 0 1 2 0v12a1 1 0 0 1-1 1z"
                                                ></path>
                                                <path
                                                    className="fill-blue group-hover:fill-primary"
                                                    d="M20.5 15.571h-12a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z"
                                                ></path>
                                            </svg>
                                        </i>
                                    </button>
                                </ToolTip>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default ScheduleList;
