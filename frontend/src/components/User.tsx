import React from "react";
import { useState, useEffect } from "react";
import axios from "~/utils/axios";
import { useAppDispatch } from "~/hook";
import UserUpdating from "./UserUpdating";
import { sendMessage } from "~/actions/message";
import { startLoading, stopLoading } from "~/actions/loading";
import shortenAirportName from "~/utils/shortenAirportName";
import Tippy from "@tippyjs/react/headless";
import usePortal from "react-cool-portal";
import formatDateTime from "~/utils/formatDateTime";

interface UserProps {
    email: string;
    fullname: string;
    group_name: string | undefined;
    isBlocked: boolean;
    mobile: string;
    // tickets: [];
    address: string;
    _id: string;
    type: string;
}

const User: React.FC<UserProps> = ({ email, fullname, group_name, isBlocked, mobile, _id, address, type }) => {
    const [updatingMode, setUpdatingMode] = useState(false);

    const [ticketData, setTicketData] = useState<TicketData[]>();
    const [flightData, setFlightData] = useState<FlightScheduleData[]>();
    const [groupPermissionData, setGroupPermissionData] = useState<GroupData[]>();

    const { Portal, show, hide } = usePortal({
        defaultShow: false
    });

    const [selectedGroup, setSelectedGroup] = useState<GroupData>({ groupName: "", groupCode: "", _id: "" });
    const [groupVisible, setGroupVisible] = useState(false);

    const userType = JSON.parse(localStorage.getItem("user")!)?.userType.toLowerCase();

    const dispatch = useAppDispatch();

    const handleBlockUser = async (_id: string) => {
        await axios
            .put(
                `/user/511246447/block-user/${_id}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                }
            )
            .then(() => {
                dispatch(sendMessage("Blocked successfully!", "success"));
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((error) => {
                console.error(error);
                dispatch(sendMessage("Blocked failed!", "error"));
            });
    };

    const handleUnblockUser = async (_id: string) => {
        await axios
            .put(
                `/user/511246447/unblock-user/${_id}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                }
            )
            .then(() => {
                dispatch(sendMessage("Unblocked successfully!", "success"));
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((error) => {
                console.error(error);
                dispatch(sendMessage("Unblocked failed!", "error"));
            });
    };

    const updateGroupUser = async (_id: string) => {
        await axios
            .patch(
                `/user/999457447/update-group/${_id}`,
                {
                    group_id: selectedGroup._id
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                }
            )
            .then(() => {
                dispatch(sendMessage("Updated successfully!", "success"));
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((error) => {
                console.error(error);
                dispatch(sendMessage("Updated failed!", "error"));
            });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(startLoading());

                const ticketResponse = await axios.get(`/user/${_id}/tickets`);
                setTicketData(ticketResponse.data);

                const flightPromises = ticketResponse.data.map((ticket: TicketData) =>
                    axios.get(`/flight/${ticket.flight_id._id}`, {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                        }
                    })
                );

                const flightResponses = await Promise.all(flightPromises);

                const allFlightData = flightResponses.map((response) => response.data);

                setFlightData(allFlightData);

                const groupResponse = await axios.get(`/group/511320413/all`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                });
                setGroupPermissionData(groupResponse.data);

                dispatch(stopLoading());
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [_id, dispatch]);

    // console.log(groupPermissionData);

    return (
        <>
            <div
                className={`p-6 rounded-xl overflow-hidden shadow-xl border ${
                    isBlocked ? "border-mdRed" : "border-primary"
                } bg-background relative`}
            >
                <div
                    className={`${
                        isBlocked ? "bg-mdRed" : "bg-primary"
                    } absolute top-0 left-0 right-0 p-2 text-center font-semibold text-base`}
                >
                    {type === "USER" ? "User Account" : "Admin Account"}
                </div>
                <div className="absolute top-14 right-6 flex gap-2">
                    {userType !== "administrator" && (
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
                    )}
                    {userType === "administrator" && (
                        <>
                            <button
                                onClick={() => {
                                    show();
                                }}
                                className="inline-block hover:bg-primary  mx-1 hover:border-primary rounded-lg border border-blue  items-center justify-center p-1"
                            >
                                <i className="">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 6.35 6.35"
                                        id="up-arrow"
                                    >
                                        <path
                                            fill="white"
                                            d="m 3.1671875,0.5344269 a 0.26460996,0.26460996 0 0 0 -0.179688,0.078125 L 0.60664052,2.9934112 a 0.26460996,0.26460996 0 0 0 0.1875,0.4511719 H 1.8527345 V 5.552005 a 0.26460996,0.26460996 0 0 0 0.263672,0.2636719 h 2.117187 A 0.26460996,0.26460996 0 0 0 4.4992185,5.552005 V 3.4445831 h 1.056641 a 0.26460996,0.26460996 0 0 0 0.1875,-0.4511719 l -2.38086,-2.3808593 a 0.26460996,0.26460996 0 0 0 -0.195312,-0.078125 z m 0.00781,0.6386719 1.744141,1.7421874 h -0.685547 a 0.26460996,0.26460996 0 0 0 -0.263672,0.265625 V 5.28638 h -1.58789 V 3.1809112 a 0.26460996,0.26460996 0 0 0 -0.265625,-0.265625 h -0.683594 z"
                                        ></path>
                                    </svg>
                                </i>
                            </button>
                            <button
                                onClick={() => {
                                    if (isBlocked) {
                                        handleUnblockUser(_id);
                                    } else handleBlockUser(_id);
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
                        </>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <div>
                        <span className="font-semibold">Full name</span>: {fullname}
                    </div>
                    <div>
                        <span className="font-semibold">Email</span>: {email}
                    </div>
                    <div>
                        <span className="font-semibold">Phone number</span>: {mobile}
                    </div>
                    <div>
                        <span className="font-semibold">Address</span>: {address}
                    </div>
                    <div>
                        <span className="font-semibold">Group name</span>: {group_name}
                    </div>
                    <div>
                        <span className="font-semibold">Blocked</span>: {isBlocked === false ? "False" : "True"}
                    </div>
                </div>
                <div className="mt-4">
                    <span className="font-semibold">Purchase:</span>
                    <table className="w-full bg-block mt-4">
                        <thead>
                            <tr className={`text-center ${isBlocked ? "bg-mdRed" : "bg-primary"}`}>
                                <th className="">Index</th>
                                <th className="">Passenger name</th>
                                <th className="">Phone number</th>
                                <th className="">Flight number</th>
                                <th className="">Departure</th>
                                <th className="">Arrival</th>
                                <th className="">Departure datetime</th>
                                <th className="">Seating type</th>
                                <th className="">Price</th>
                                <th className="">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ticketData &&
                                flightData?.map((flight, index) => (
                                    <tr key={flight._id} className="text-center">
                                        <td>{index + 1}</td>
                                        <td>
                                            {
                                                ticketData.find((ticket) => ticket.flight_id._id === flight._id)
                                                    ?.full_name
                                            }
                                        </td>
                                        <td>
                                            {
                                                ticketData.find((ticket) => ticket.flight_id._id === flight._id)
                                                    ?.phone_number
                                            }
                                        </td>
                                        <td>{flight.flight_number}</td>
                                        <td>{shortenAirportName(flight.departure_airport.name)}</td>
                                        <td>{shortenAirportName(flight.destination_airport.name)}</td>
                                        <td>{formatDateTime(flight.departure_datetime)}</td>
                                        <td>
                                            {ticketData.find((ticket) => ticket.flight_id._id === flight._id)
                                                ?.seat_class === "1"
                                                ? "First class"
                                                : "Second class"}
                                        </td>
                                        <td>
                                            {ticketData.find((ticket) => ticket.flight_id._id === flight._id)?.price}{" "}
                                            USD
                                        </td>
                                        <td>
                                            {ticketData.find((ticket) => ticket.flight_id._id === flight._id)?.status}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {updatingMode && userType !== "administrator" && (
                <UserUpdating
                    email={email}
                    fullname={fullname}
                    group_id={group_id}
                    isBlocked={isBlocked}
                    address={address}
                    mobile={mobile}
                    // tickets={tickets}
                />
            )}

            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="border border-blue p-8 bg-background relative rounded-xl w-[360px] no-scrollbar">
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
                                <div className="text-white font-semibold text-xl">Update permission</div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-2 flex-col">
                                    <div>
                                        <Tippy
                                            visible={groupVisible}
                                            interactive
                                            onClickOutside={() => setGroupVisible(false)}
                                            offset={[0, 0]}
                                            placement="bottom"
                                            render={(attrs) => (
                                                <ul
                                                    className={`border border-primary rounded-xl p-2  w-[294px] bg-background ${
                                                        groupVisible ? "border-t-0 rounded-tl-none rounded-tr-none" : ""
                                                    }`}
                                                    {...attrs}
                                                >
                                                    {groupPermissionData?.map((group) => (
                                                        <li
                                                            onClick={() => {
                                                                setSelectedGroup(group);
                                                                setGroupVisible(false);
                                                            }}
                                                            key={group._id}
                                                            className={`cursor-pointer py-2 px-4 hover:bg-primary text-left rounded-xl flex items-center p-2 ${
                                                                group._id === selectedGroup._id
                                                                    ? "text-blue pointer-events-none"
                                                                    : ""
                                                            }`}
                                                        >
                                                            Group: {group.groupName}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        >
                                            <div
                                                className={`hover:border-primary py-3 px-4 border-blue border bg-background cursor-pointer w-[294px] ${
                                                    groupVisible
                                                        ? "rounded-tl-xl rounded-tr-xl border-primary"
                                                        : "rounded-xl"
                                                }   flex justify-between items-center`}
                                                onClick={() => setGroupVisible(!groupVisible)}
                                            >
                                                {selectedGroup.groupName !== ""
                                                    ? `Group: ${selectedGroup.groupName}`
                                                    : "Choose a group"}
                                                <i className={`${groupVisible ? "rotate-180" : ""}`}>
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
                                <button
                                    className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                    onClick={() => updateGroupUser(_id)}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    );
};

export default User;
