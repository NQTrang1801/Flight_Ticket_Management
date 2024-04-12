import axios from "~/utils/axios";
import usePortal from "react-cool-portal";
import IsRequired from "~/icons/IsRequired";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";
import Tippy from "@tippyjs/react/headless";
import { useState } from "react";

interface Props {
    rooms: Array<{
        capacity: string;
        id: string;
        name: string;
        theaterId: string;
        type: string;
    }>;
}

const RoomDeleting: React.FC<Props> = ({ rooms }) => {
    const { Portal, show, hide } = usePortal({
        defaultShow: false
    });
    const dispatch = useAppDispatch();
    const [selectedRoom, setSelectedRoom] = useState<{
        id: string;
        name: string;
    }>({
        id: "",
        name: "All rooms"
    });
    const [roomsMenuVisible, setRoomsMenuVisible] = useState(false);
    const onSubmit = async () => {
        hide();
        dispatch(startLoading());

        (async () => {
            axios
                .delete(`/rooms/${selectedRoom.id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.accessToken}`
                    }
                })
                .then(() => {
                    dispatch(stopLoading());
                    dispatch(sendMessage("Deleted sucessfully!"));
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                })
                .catch((error) => {
                    dispatch(stopLoading());
                    dispatch(sendMessage("Deleted failed!"));
                    console.error(error);
                });
        })();
    };

    return (
        <>
            <button
                onClick={() => {
                    show();
                }}
                className="bg-block rounded-xl border-blue border hover:border-primary hover:bg-primary flex items-center justify-center p-3"
            >
                <i className="mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={20} height={20} id="delete">
                        <path
                            className="fill-white"
                            d="M24.2,12.193,23.8,24.3a3.988,3.988,0,0,1-4,3.857H12.2a3.988,3.988,0,0,1-4-3.853L7.8,12.193a1,1,0,0,1,2-.066l.4,12.11a2,2,0,0,0,2,1.923h7.6a2,2,0,0,0,2-1.927l.4-12.106a1,1,0,0,1,2,.066Zm1.323-4.029a1,1,0,0,1-1,1H7.478a1,1,0,0,1,0-2h3.1a1.276,1.276,0,0,0,1.273-1.148,2.991,2.991,0,0,1,2.984-2.694h2.33a2.991,2.991,0,0,1,2.984,2.694,1.276,1.276,0,0,0,1.273,1.148h3.1A1,1,0,0,1,25.522,8.164Zm-11.936-1h4.828a3.3,3.3,0,0,1-.255-.944,1,1,0,0,0-.994-.9h-2.33a1,1,0,0,0-.994.9A3.3,3.3,0,0,1,13.586,7.164Zm1.007,15.151V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Zm4.814,0V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Z"
                        ></path>
                    </svg>
                </i>
                Delete room
            </button>
            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="border border-blue p-8 bg-background relative rounded-xl max-h-[810px] max-w-[662px] no-scrollbar">
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
                                <div className="text-white font-semibold text-xl">Delete a room</div>
                            </div>
                            <form onSubmit={onSubmit} className="flex flex-col gap-3">
                                <div className="text-blue text-[15px]">Room Information</div>
                                <div className="flex gap-2 flex-col">
                                    <label htmlFor="rooms" className="flex gap-1 mb-1 items-center">
                                        Rooms
                                        <IsRequired />
                                    </label>
                                    <div>
                                        <Tippy
                                            visible={roomsMenuVisible}
                                            interactive
                                            onClickOutside={() => setRoomsMenuVisible(false)}
                                            offset={[0, 0]}
                                            placement="bottom"
                                            render={(attrs) => (
                                                <ul
                                                    className={`border border-primary w-[400px] rounded-lg p-2 max-h-[300px] overflow-y-scroll no-scrollbar bg-background ${
                                                        roomsMenuVisible
                                                            ? "border-t-0 rounded-tl-none rounded-tr-none"
                                                            : ""
                                                    }`}
                                                    {...attrs}
                                                >
                                                    {rooms &&
                                                        rooms.map((room) => (
                                                            <li
                                                                onClick={() => {
                                                                    setSelectedRoom(room);
                                                                    setRoomsMenuVisible(false);
                                                                }}
                                                                key={room.id}
                                                                className={`cursor-pointer py-2 px-4 text-[13px] hover:bg-primary text-left rounded-lg flex items-center p-2 ${
                                                                    selectedRoom?.id === room.id
                                                                        ? "text-blue pointer-events-none"
                                                                        : ""
                                                                }`}
                                                            >
                                                                {room.name}
                                                            </li>
                                                        ))}
                                                </ul>
                                            )}
                                        >
                                            <div
                                                className={`hover:border-primary py-3 px-4 border-blue border w-[400px] bg-background cursor-pointer mt-1 ${
                                                    roomsMenuVisible
                                                        ? "rounded-tl-lg rounded-tr-lg border-primary"
                                                        : "rounded-lg"
                                                }   flex justify-between items-center`}
                                                onClick={() => setRoomsMenuVisible(!roomsMenuVisible)}
                                            >
                                                <span className="mr-2">{selectedRoom.name}</span>
                                                <i className={`${roomsMenuVisible ? "rotate-180" : ""}`}>
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
                                <button
                                    className={`py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary ${
                                        selectedRoom.id === "" && "opacity-50 pointer-events-none"
                                    }`}
                                    type="submit"
                                >
                                    Delete room
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    );
};

export default RoomDeleting;
