import React from "react";
import { useState, useRef } from "react";
import axios from "~/utils/axios";
import usePortal from "react-cool-portal";
import { toast } from "react-toastify";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import getFormattedDateTime from "~/utils/getFormattedDateTime";

interface Props {
    id: string;
    movie: IMovieData;
    deletingMode: boolean;
    startTime: string;
    theater: ITheaters;
}

const ShowItem: React.FC<Props> = ({ id, movie, startTime, theater, deletingMode = false }) => {
    const [selectedId, setSelectedId] = useState(String);
    const overlayRef = useRef<HTMLDivElement>(null);
    const { Portal, hide, show } = usePortal({
        defaultShow: false
    });
    const dispatch = useAppDispatch();

    const handleDelete = async () => {
        hide();
        dispatch(startLoading());
        await axios
            .delete(`/showings/${selectedId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.accessToken}`
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

    return (
        <>
            <li className="rounded-xl border border-blue hover:border-primary hover:bg-background p-4">
                {deletingMode ? (
                    <div
                        className="cursor-pointer"
                        onClick={() => {
                            setSelectedId(id);
                            show();
                            overlayRef.current?.classList.replace("hidden", "flex");
                        }}
                    >
                        <div className="group overflow-hidden rounded-xl shadow-sm">
                            <div className="flex flex-col gap-2 justify-center">
                                <div className="rounded-xl overflow-hidden w-full h-[200px]">
                                    <img
                                        src={movie?.moviePosters.filter((poster) => poster.isThumb === true)[0].link}
                                        alt="movie poster"
                                        className="rounded-xl w-full h-full group-hover:scale-110 transition-transform duration-300 ease-linear"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-center">
                                        <div className="text-base text-blue">{movie?.name}</div>
                                        <div className="text-[13px]">{movie?.director}</div>
                                    </div>
                                    <div className="flex gap-2 items-center mt-4">
                                        <i>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                width={36}
                                                height={36}
                                                id="location"
                                            >
                                                <path
                                                    className="fill-white group-hover:fill-primary"
                                                    d="M12,2a8,8,0,0,0-8,8c0,5.4,7.05,11.5,7.35,11.76a1,1,0,0,0,1.3,0C13,21.5,20,15.4,20,10A8,8,0,0,0,12,2Zm0,17.65c-2.13-2-6-6.31-6-9.65a6,6,0,0,1,12,0C18,13.34,14.13,17.66,12,19.65ZM12,6a4,4,0,1,0,4,4A4,4,0,0,0,12,6Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,12Z"
                                                ></path>
                                            </svg>
                                        </i>
                                        <div>
                                            <div className="text-blue font-medium">
                                                {theater?.name} - {theater?.city}
                                            </div>
                                            <div className="">{theater?.address}</div>
                                            <div>Start time: {getFormattedDateTime(startTime)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <a href={`/shows/${id}`} className="">
                        <div className="group overflow-hidden rounded-xl shadow-sm">
                            <div className="flex flex-col gap-2 justify-center">
                                <div className="rounded-xl overflow-hidden w-full h-[200px]">
                                    <img
                                        src={movie?.moviePosters.filter((poster) => poster.isThumb === true)[0].link}
                                        alt="movie poster"
                                        className="rounded-xl w-full h-full group-hover:scale-110 transition-transform duration-300 ease-linear"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-center">
                                        <div className="text-base text-blue">{movie?.name}</div>
                                        <div className="text-[13px]">{movie?.director}</div>
                                    </div>
                                    {}
                                    <div className="flex gap-2 items-center mt-4">
                                        <i>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                width={36}
                                                height={36}
                                                id="location"
                                            >
                                                <path
                                                    className="fill-white group-hover:fill-primary"
                                                    d="M12,2a8,8,0,0,0-8,8c0,5.4,7.05,11.5,7.35,11.76a1,1,0,0,0,1.3,0C13,21.5,20,15.4,20,10A8,8,0,0,0,12,2Zm0,17.65c-2.13-2-6-6.31-6-9.65a6,6,0,0,1,12,0C18,13.34,14.13,17.66,12,19.65ZM12,6a4,4,0,1,0,4,4A4,4,0,0,0,12,6Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,12Z"
                                                ></path>
                                            </svg>
                                        </i>
                                        <div>
                                            <div className="text-blue font-medium">
                                                {theater?.name} - {theater?.city}
                                            </div>
                                            <div className="">{theater?.address}</div>
                                            <div>Start time: {getFormattedDateTime(startTime)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                )}
            </li>
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
                            <p className="mb-4 mt-4 text-[15px]">Delete this show?</p>
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

export default ShowItem;
