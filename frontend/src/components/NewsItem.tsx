import React from "react";
import { useState, useRef } from "react";
import axios from "~/utils/axios";
import usePortal from "react-cool-portal";
import { toast } from "react-toastify";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";

interface Props {
    title: string;
    shortDesc: string;
    id: string;
    deletingMode?: boolean;
    newsPicture: string;
}

const NewsItem: React.FC<Props> = ({ title, shortDesc, id, newsPicture, deletingMode = false }) => {
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
            .delete(`/news/${selectedId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.accessToken}`
                }
            })
            .then(() => {
                dispatch(stopLoading());
                window.location.reload();
                toast("Deleted successfully!");
            })
            .catch((error) => {
                console.error(error);
                toast("Deleted failed!");
                hide();
            });
    };

    return (
        <>
            {deletingMode ? (
                <li
                    onClick={() => {
                        setSelectedId(id);
                        show();
                        overlayRef.current?.classList.replace("hidden", "flex");
                    }}
                    className="w-full h-[250px] flex gap-6 bg-background border rounded-xl overflow-hidden border-blue hover:border-primary relative"
                >
                    <div className="w-1/3 absolute top-0 left-0 bottom-0 right-0">
                        <img src={newsPicture} alt="news picture" className="w-full h-full" />
                    </div>
                    <div className="ml-[calc(33%+16px)] p-6 flex flex-col justify-center">
                        <div className="text-blue text-lg font-medium hover:text-primary">{title}</div>
                        <div className="mt-2">
                            <div>{shortDesc}</div>
                        </div>
                        <div className="mt-6">
                            <div className="inline-block mt-4 border border-blue py-3 px-6 text-[15px] font-medium rounded-lg hover:border-primary hover:bg-primary">
                                Read more
                            </div>
                        </div>
                    </div>
                </li>
            ) : (
                <li className="w-full h-[250px] flex gap-6 bg-background border rounded-xl overflow-hidden border-blue hover:border-primary relative">
                    <a href={`/news/${id}`} className="w-1/3 absolute top-0 left-0 bottom-0 right-0">
                        <img src={newsPicture} alt="news picture" className="w-full h-full" />
                    </a>
                    <div className="ml-[calc(33%+16px)] p-6 flex flex-col justify-center">
                        <a href={`/news/${id}`} className="text-blue text-lg font-medium hover:text-primary">
                            {title}
                        </a>
                        <div className="mt-2">
                            <div>{shortDesc}</div>
                        </div>
                        <div className="mt-6">
                            <a
                                href={`/news/${id}`}
                                className="inline-block mt-4 border border-blue py-3 px-6 text-[15px] font-medium rounded-lg hover:border-primary hover:bg-primary"
                            >
                                Read more
                            </a>
                        </div>
                    </div>
                </li>
            )}
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
                                Delete news <span className="text-blue">"{title}"</span>?
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

export default NewsItem;
