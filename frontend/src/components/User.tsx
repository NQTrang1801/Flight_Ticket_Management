import React from "react";
import { useState, useRef, useEffect } from "react";
import axios from "~/utils/axios";
import usePortal from "react-cool-portal";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import UserUpdating from "./UserUpdating";
import { sendMessage } from "~/actions/message";

interface UserProps {
    email: string;
    fullname: string;
    group_id: string;
    isBlocked: boolean;
    mobile: string;
    // tickets: [];
    _id: string;
}

const User: React.FC<UserProps> = ({ email, fullname, group_id, isBlocked, mobile, _id }) => {
    const [selectedId, setSelectedId] = useState("");
    const [updatingMode, setUpdatingMode] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const { Portal, hide, show } = usePortal({
        defaultShow: false
    });
    const dispatch = useAppDispatch();

    const handleBlockUser = async () => {
        await axios
            .put(`/user/511246447/block-user/${selectedId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                }
            })
            .then(() => {
                dispatch(stopLoading());
                dispatch(sendMessage("Blocked successfully!"));
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((error) => {
                console.error(error);
                dispatch(sendMessage("Blocked failed!"));
                hide();
            });
    };

    const handleUnblockUser = async () => {
        await axios
            .put(`/user/511246447/unblock-user/${selectedId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                }
            })
            .then(() => {
                dispatch(stopLoading());
                dispatch(sendMessage("Unblocked successfully!"));
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((error) => {
                console.error(error);
                dispatch(sendMessage("Unblocked failed!"));
                hide();
            });
    };

    useEffect(() => {
        if (selectedId !== "" && !isBlocked) show();
    }, [selectedId, show, isBlocked]);

    return (
        <>
            <div className="p-6 rounded-xl overflow-hidden shadow-xl border border-primary bg-background relative">
                <div className={`${"bg-blue"} absolute top-0 left-0 right-0 p-2 text-center font-semibold text-base`}>
                    User Account
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
                            if (isBlocked) handleUnblockUser();
                            else setSelectedId(_id);
                        }}
                        className={`${
                            isBlocked && "bg-mdRed border-mdRed hover:bg-blue hover:border-blue"
                        } hover:bg-mdRed hover:border-mdRed rounded-lg border border-blue flex items-center justify-center p-1`}
                    >
                        <i>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 48 48"
                                id="block"
                            >
                                <path fill="none" d="M0 0h48v48H0z"></path>
                                <path
                                    fill="white"
                                    d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zM8 24c0-8.84 7.16-16 16-16 3.7 0 7.09 1.27 9.8 3.37L11.37 33.8C9.27 31.09 8 27.7 8 24zm16 16c-3.7 0-7.09-1.27-9.8-3.37L36.63 14.2C38.73 16.91 40 20.3 40 24c0 8.84-7.16 16-16 16z"
                                ></path>
                            </svg>
                        </i>
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <div>
                        <span className="font-semibold">Email</span>: {email}
                    </div>
                    <div>
                        <span className="font-semibold">Full name</span>: {fullname}
                    </div>
                    <div>
                        <span className="font-semibold">Phone number</span>: 0{mobile}
                    </div>
                    <div>
                        <span className="font-semibold">Group id</span>: {group_id}
                    </div>
                    <div>
                        <span className="font-semibold">Blocked</span>: {isBlocked === false ? "False" : "True"}
                    </div>
                </div>
            </div>
            {updatingMode ? (
                <UserUpdating
                    _id={_id}
                    email={email}
                    fullname={fullname}
                    group_id={group_id}
                    isBlocked={isBlocked}
                    mobile={mobile}
                    // tickets={tickets}
                />
            ) : (
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
                                    Block user <span className="text-blue">"{fullname}"</span>?
                                </p>
                                <div className="flex gap-6">
                                    <button
                                        className="px-5 py-2 border border-blue hover:border-mdRed hover:bg-mdRed rounded-lg"
                                        onClick={() => handleBlockUser()}
                                    >
                                        Block
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
            )}
        </>
    );
};

export default User;
