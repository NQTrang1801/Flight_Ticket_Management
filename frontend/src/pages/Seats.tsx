import axios from "~/utils/axios";
import { useState, useEffect } from "react";
import usePortal from "react-cool-portal";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsRequired from "~/icons/IsRequired";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";
import SeatItem from "~/components/SeatItem";
import getNumsOfCol from "~/utils/getNumsOfCol";
import { toast } from "react-toastify";

const schema = yup.object().shape({
    numberOfRow: yup.string().required("Number of row is required."),
    numberOfColumn: yup.string().required("Number of column is required.")
});

interface Props {
    id: string;
}

const Seats: React.FC<Props> = ({ id }) => {
    const [data, setData] = useState<Array<ISeats>>();
    const [numsOfCol, setNumsOfCol] = useState<number>(0);
    const [updating, setUpdating] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState<
        {
            id: string;
            seatRow: string;
            type: string;
        }[]
    >([]);
    const { Portal, show, hide } = usePortal({
        defaultShow: false
    });

    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ISeatsValidation>({
        resolver: yupResolver(schema)
    });

    const onSubmit: SubmitHandler<ISeatsValidation> = async (formData) => {
        hide();
        dispatch(startLoading());
        const numberOfRow = formData.numberOfRow;
        const numberOfColumn = formData.numberOfColumn;

        (async () => {
            axios
                .post(
                    "/seats",
                    {
                        roomId: id,
                        numberOfRow,
                        numberOfColumn
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.accessToken}`
                        }
                    }
                )
                .then(() => {
                    dispatch(stopLoading());
                    dispatch(sendMessage("Created sucessfully!"));
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                })
                .catch((error) => {
                    dispatch(stopLoading());
                    dispatch(sendMessage("Created failed!"));
                    console.error(error);
                });
        })();
    };
    const handleUpdate = async () => {
        dispatch(startLoading());

        await axios
            .patch(
                `/seats/update-to-type-couple`,
                {
                    firstSeatId: selectedSeats[0].id,
                    secondSeatId: selectedSeats[1].id
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.accessToken}`
                    }
                }
            )
            .then(() => {
                dispatch(stopLoading());
                dispatch(sendMessage("Updated sucessfully!"));
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((error) => {
                dispatch(stopLoading());
                dispatch(sendMessage("Updated failed!"));
                console.error(error);
            });
    };

    const handleDelete = async () => {
        hide();
        dispatch(startLoading());
        await axios
            .delete(`/seats/${id}`, {
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

    useEffect(() => {
        (async () => {
            await axios
                .get(`/seats?page=1&take=200&roomId=${id}`, { headers: { "Content-Type": "application/json" } })
                .then((response) => {
                    setData(response.data.data.reverse());
                    if (response.data.data.length > 0) setNumsOfCol(getNumsOfCol(response.data.data));
                })
                .catch((err) => console.error(err));
        })();
    }, [id]);

    const handleChooseSeat = (
        selectedSeat: {
            id: string;
            seatRow: string;
            type: string;
        },
        newSeat: {
            id: string;
            seatRow: string;
            type: string;
        }
    ) => {
        if (selectedSeat.seatRow === newSeat.seatRow) {
            if (
                Math.abs(parseInt(selectedSeat.id) - parseInt(newSeat.id)) === 1 &&
                selectedSeat.type !== "couple" &&
                newSeat.type !== "couple"
            )
                return true;
            else return false;
        }
        return false;
    };

    console.log(data);

    return (
        data && (
            <>
                <div className="bg-block p-6 border border-blue rounded-3xl">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-xl font-medium">Seats</div>
                        <div className="flex gap-3 items-center">
                            <button
                                onClick={() => {
                                    show();
                                }}
                                className="bg-block rounded-xl border-blue border hover:border-primary hover:bg-primary flex items-center justify-center p-3"
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
                                Create seats
                            </button>
                            <button
                                onClick={() => {
                                    setUpdating(!updating);
                                    setSelectedSeats([]);
                                }}
                                className={`bg-block rounded-xl border-blue border hover:border-primary hover:bg-primary flex items-center justify-center p-3 ${
                                    updating ? "border-primary bg-primary" : ""
                                }`}
                            >
                                <i className="mr-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 6.35 6.35"
                                        id="up-arrow"
                                    >
                                        <path
                                            d="m 3.1671875,0.5344269 a 0.26460996,0.26460996 0 0 0 -0.179688,0.078125 L 0.60664052,2.9934112 a 0.26460996,0.26460996 0 0 0 0.1875,0.4511719 H 1.8527345 V 5.552005 a 0.26460996,0.26460996 0 0 0 0.263672,0.2636719 h 2.117187 A 0.26460996,0.26460996 0 0 0 4.4992185,5.552005 V 3.4445831 h 1.056641 a 0.26460996,0.26460996 0 0 0 0.1875,-0.4511719 l -2.38086,-2.3808593 a 0.26460996,0.26460996 0 0 0 -0.195312,-0.078125 z m 0.00781,0.6386719 1.744141,1.7421874 h -0.685547 a 0.26460996,0.26460996 0 0 0 -0.263672,0.265625 V 5.28638 h -1.58789 V 3.1809112 a 0.26460996,0.26460996 0 0 0 -0.265625,-0.265625 h -0.683594 z"
                                            className="fill-white"
                                        ></path>
                                    </svg>
                                </i>
                                Update to couple
                            </button>
                            <button
                                onClick={() => handleDelete()}
                                className={`bg-block rounded-xl border-blue border hover:border-mdRed hover:bg-mdRed flex items-center justify-center p-3`}
                            >
                                <i className="mr-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 32 32"
                                        width={20}
                                        height={20}
                                        id="delete"
                                    >
                                        <path
                                            className="fill-white"
                                            d="M24.2,12.193,23.8,24.3a3.988,3.988,0,0,1-4,3.857H12.2a3.988,3.988,0,0,1-4-3.853L7.8,12.193a1,1,0,0,1,2-.066l.4,12.11a2,2,0,0,0,2,1.923h7.6a2,2,0,0,0,2-1.927l.4-12.106a1,1,0,0,1,2,.066Zm1.323-4.029a1,1,0,0,1-1,1H7.478a1,1,0,0,1,0-2h3.1a1.276,1.276,0,0,0,1.273-1.148,2.991,2.991,0,0,1,2.984-2.694h2.33a2.991,2.991,0,0,1,2.984,2.694,1.276,1.276,0,0,0,1.273,1.148h3.1A1,1,0,0,1,25.522,8.164Zm-11.936-1h4.828a3.3,3.3,0,0,1-.255-.944,1,1,0,0,0-.994-.9h-2.33a1,1,0,0,0-.994.9A3.3,3.3,0,0,1,13.586,7.164Zm1.007,15.151V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Zm4.814,0V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Z"
                                        ></path>
                                    </svg>
                                </i>
                                Delete all
                            </button>
                        </div>
                    </div>
                    {updating && (
                        <div className="shadow-xl rounded-xl bg-block mb-6">
                            <div className="bg-primary h-6 rounded-tr-xl rounded-tl-xl"></div>
                            <div className="flex gap-6 items-center p-6 text-[15px]">
                                <div>Select 2 seats below to update to couple.</div>
                                <div className="flex gap-6">
                                    <button
                                        className={`px-5 py-2 border border-blue hover:border-primary hover:bg-primary rounded-lg ${
                                            selectedSeats.length !== 2 ? "opacity-50 pointer-events-none" : ""
                                        }`}
                                        onClick={() => handleUpdate()}
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => {
                                            setUpdating(false);
                                            setSelectedSeats([]);
                                        }}
                                        className="px-5 py-2 border border-blue hover:border-primary hover:bg-primary rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="w-full border-b-4 border-primary mt-16 mb-2"></div>
                    <div className="w-full text-center mb-32 text-lg">Screen</div>
                    {numsOfCol === 0 ? (
                        <span>No seats.</span>
                    ) : (
                        <ul
                            className="grid gap-6 w-full"
                            style={{ gridTemplateColumns: `repeat(${numsOfCol}, minmax(0, 1fr))` }}
                        >
                            {data.map((seat, index) =>
                                updating ? (
                                    <div
                                        key={seat.id}
                                        className={`cursor-pointer relative rounded-lg p-2 border border-blue  hover:bg-primary hover:border-primary ${
                                            seat.type === "couple" && "bg-pink border-pink pointer-events-none"
                                        } ${
                                            selectedSeats.map((selectedSeat) => selectedSeat.id).includes(seat.id)
                                                ? "border-primary bg-primary"
                                                : ""
                                        } ${
                                            selectedSeats.length === 1 &&
                                            !handleChooseSeat(selectedSeats[0], {
                                                id: seat.id,
                                                seatRow: seat.seatRow,
                                                type: seat.type
                                            }) &&
                                            "opacity-50 pointer-events-none"
                                        }`}
                                        onClick={() => {
                                            if (selectedSeats.length <= 1)
                                                setSelectedSeats([
                                                    ...selectedSeats,
                                                    { id: seat.id, seatRow: seat.seatRow, type: seat.type }
                                                ]);
                                            else {
                                                const arr = [{ id: seat.id, seatRow: seat.seatRow, type: seat.type }];
                                                setSelectedSeats(arr);
                                            }
                                        }}
                                    >
                                        <SeatItem
                                            id={seat.id}
                                            numberOfColumn={seat.seatColumn}
                                            numberOfRow={seat.seatRow}
                                        />
                                        {data[index + 1]?.pairWith === seat.id && (
                                            <li className="absolute top-[-17px] right-[-24px] text-6xl">-</li>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        key={seat.id}
                                        className={`p-2 border border-blue relative rounded-lg ${
                                            seat.type === "couple" && "bg-pink border-pink"
                                        }`}
                                    >
                                        <SeatItem
                                            id={seat.id}
                                            numberOfColumn={seat.seatColumn}
                                            numberOfRow={seat.seatRow}
                                        />
                                        {data[index + 1]?.pairWith === seat.id && (
                                            <li className="absolute top-[-17px] right-[-24px] text-6xl">-</li>
                                        )}
                                    </div>
                                )
                            )}
                        </ul>
                    )}
                </div>
                <Portal>
                    <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                        <div className="flex items-center justify-center">
                            <div className="border border-blue p-8 bg-background relative rounded-xl max-h-[810px] w-[500px] max-w-[662px]  overflow-y-scroll no-scrollbar">
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
                                    <div className="text-white font-semibold text-xl">Create a seat</div>
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                                    <div className="text-blue text-[15px]">Seat Information</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex gap-2 flex-col">
                                            <label htmlFor="numberOfRow" className="flex gap-1 mb-1 items-center">
                                                Number of row
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="text"
                                                id="numberOfRow"
                                                placeholder="Number of rows . . ."
                                                {...register("numberOfRow")}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                            {<span className="text-deepRed">{errors.numberOfRow?.message}</span>}
                                        </div>
                                        <div className="flex gap-2 flex-col">
                                            <label htmlFor="numberOfColumn" className="flex gap-1 mb-1 items-center">
                                                Number of column
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="text"
                                                id="numberOfColumn"
                                                placeholder="Number of columns . . ."
                                                {...register("numberOfColumn")}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                            {<span className="text-deepRed">{errors.numberOfColumn?.message}</span>}
                                        </div>
                                    </div>
                                    <div className="outline outline-1 outline-border my-2"></div>
                                    <button
                                        className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                        type="submit"
                                    >
                                        Create seats
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </Portal>
            </>
        )
    );
};

export default Seats;
