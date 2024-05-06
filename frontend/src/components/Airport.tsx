import React from "react";
import { useState, useRef, useEffect } from "react";
import axios from "~/utils/axios";
import usePortal from "react-cool-portal";
import { toast } from "react-toastify";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import AirportUpdating from "./AirportUpdating";

interface AirportProps {
    _id: string;
    code: string;
    name: string;
    country: string;
    address: string;
    timezone: string;
    terminals: number;
    capacity: number;
    isInternational: boolean;
    coordinates: {
        type: string;
        coordinates: number[];
    };
    status: boolean;
    deletingMode: boolean;
    updatingMode: boolean;
}

const Airport: React.FC<AirportProps> = ({
    code,
    name,
    country,
    address,
    timezone,
    terminals,
    capacity,
    isInternational,
    coordinates,
    status,
    deletingMode,
    updatingMode,
    _id
}) => {
    const [selectedId, setSelectedId] = useState("");
    const overlayRef = useRef<HTMLDivElement>(null);
    const { Portal, hide, show } = usePortal({
        defaultShow: false
    });
    const dispatch = useAppDispatch();

    const handleDelete = async () => {
        hide();
        dispatch(startLoading());
        await axios
            .delete(`/airport/511627675/${selectedId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.token}`
                }
            })
            .then(() => {
                dispatch(stopLoading());
                toast("Deleted successfully!");
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((error) => {
                console.error(error);
                toast("Deleted failed!");
                hide();
            });
    };

    useEffect(() => {
        if (selectedId !== "") show();
    }, [selectedId, show]);

    let content;
    if (deletingMode) {
        content = (
            <tr className="text-center capitalize hover:bg-hover cursor-pointer" onClick={() => setSelectedId(_id)}>
                <td>{code}</td>
                <td>{name}</td>
                <td>{country}</td>
                <td>{address}</td>
                <td>{timezone}</td>
                <td>{terminals}</td>
                <td>{capacity}</td>
                <td>{coordinates.coordinates.join(", ")}</td>
                <td>{isInternational == false ? "False" : "True"}</td>
                <td>{status === false ? "False" : "True"}</td>
            </tr>
        );
    } else if (updatingMode) {
        content = (
            <AirportUpdating
                code={code}
                _id={_id}
                name={name}
                address={address}
                terminals={terminals}
                country={country}
                capacity={capacity}
                coordinates={coordinates}
                timezone={timezone}
                isInternational={isInternational}
                status={status}
            />
        );
    } else {
        content = (
            <tr className={`text-center`}>
                <td>{code}</td>
                <td>{name}</td>
                <td>{country}</td>
                <td>{address}</td>
                <td>{timezone}</td>
                <td>{terminals}</td>
                <td>{capacity}</td>
                <td>{coordinates.coordinates.join(", ")}</td>
                <td>{isInternational == false ? "False" : "True"}</td>
                <td>{status === false ? "False" : "True"}</td>
            </tr>
        );
    }

    return (
        <>
            {content}
            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="rounded-xl py-6 px-12 border border-primary bg-background flex flex-col items-center justify-center relative">
                            <button
                                onClick={() => {
                                    hide();
                                    overlayRef.current?.classList.replace("flex", "hidden");
                                }}
                                className="absolute right-3 top-3 border border-blue rounded-full p-1 hover:border-primary hover:bg-primary"
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
                            <p className="mb-4 mt-4 text-[15px]">
                                Delete <span className="text-blue">"{name}"</span>?
                            </p>
                            <div className="flex gap-6">
                                <button
                                    className="px-5 py-2 border border-blue hover:border-mdRed hover:bg-mdRed rounded-lg"
                                    onClick={() => handleDelete()}
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        hide();
                                        overlayRef.current?.classList.replace("flex", "hidden");
                                    }}
                                    className="px-5 py-2 border border-blue hover:border-primary hover:bg-primary rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    );
};

export default Airport;
