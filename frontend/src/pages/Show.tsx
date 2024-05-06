import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "~/utils/axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";
import { useAppDispatch } from "~/hook";
import usePortal from "react-cool-portal";
import IsRequired from "~/icons/IsRequired";
import Tippy from "@tippyjs/react/headless";
import convertReleaseDate from "~/utils/convertDate";
import compareDate from "~/utils/compareDate";
import getHourMinuteFromISOString from "~/utils/getHourMinuteFromISOString";
import getFormattedDateTime from "~/utils/getFormattedDateTime";

const schema = yup.object().shape({
    startTime: yup.date().required("Start time is required.").typeError("Start time must be a date.")
});

function Show() {
    const [data, setData] = useState<IShows>();
    const [time, setTime] = useState("");
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { Portal, show, hide } = usePortal({ defaultShow: false });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<IShowsValidation>({
        resolver: yupResolver(schema),
        defaultValues: {
            startTime: new Date()
        }
    });

    const [moviesData, setMoviesData] = useState<Array<IMovieData>>([]);
    const [movieShow, setMovieShow] = useState<IMovieData>();
    const [selectedMovie, setSelectedMovie] = useState<{ id: string; name: string; director: string }>({
        id: "",
        name: "",
        director: ""
    });
    const [theatersData, setTheatersData] = useState<Array<ITheaters>>([]);
    const [theaterShow, setTheaterShow] = useState<ITheaters>();
    const [roomsData, setRoomsData] = useState<Array<IRooms>>([]);
    const [selectedRoom, setSelectedRoom] = useState<{ id: string; name: string; type: string }>({
        id: "",
        name: "",
        type: ""
    });
    const [moviesMenuVisible, setMoviesMenuVisible] = useState(false);
    const [roomsMenuVisible, setRoomsMenuVisible] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`/showings/${id}`, {
                    headers: { "Content-Type": "application/json" }
                });
                setData(response.data);
                setSelectedMovie(response.data.movie);
                setSelectedRoom(response.data.room);
                setTime(getHourMinuteFromISOString(response.data.startTime));
                setValue("startTime", convertReleaseDate(response.data.startTime) || new Date());
            } catch (error) {
                console.error(error);
            }
        })();

        (async () => {
            await axios
                .get(`/movies?page=1&take=20`, { headers: { "Content-Type": "application/json" } })
                .then((response) => {
                    setMoviesData(response.data.data.filter((movie) => !compareDate(movie.releaseDate)));
                })
                .catch((error) => console.error(error));
        })();

        (async () => {
            await axios
                .get("/theaters?page=1&take=20", { headers: { "Content-Type": "application/json" } })
                .then((response) => {
                    setTheatersData(response.data.data);
                })
                .catch((err) => console.error(err));
        })();

        (async () => {
            await axios
                .get("/rooms?page=1&take=20", { headers: { "Content-Type": "application/json" } })
                .then((response) => {
                    setRoomsData(response.data.data);
                })
                .catch((err) => console.error(err));
        })();
    }, [id, setValue]);

    useEffect(() => {
        if (moviesData.length > 0 && theatersData.length > 0) {
            setMovieShow(moviesData.find((movie) => movie.id === data?.movieId));
            setTheaterShow(theatersData.find((theater) => theater.id === data?.room.theaterId));
        }
    }, [moviesData, theatersData, data]);

    const onSubmit: SubmitHandler<IShowsValidation> = async (formData) => {
        hide();
        dispatch(startLoading());
        const startTime = `${convertReleaseDate(formData.startTime)} ${time}:00`;

        const movieId = selectedMovie?.id;
        const roomId = selectedRoom?.id;

        (async () => {
            try {
                await axios.patch(
                    `/showings/${id}`,
                    {
                        startTime: startTime,
                        ...(data?.movieId !== movieId && { movieId }),
                        ...(data?.room.id !== roomId && { roomId })
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.accessToken}`
                        }
                    }
                );
                dispatch(stopLoading());
                dispatch(sendMessage("Updated successfully!"));
                setTimeout(() => window.location.reload(), 2000);
            } catch (error) {
                dispatch(stopLoading());
                dispatch(sendMessage("Updated failed!"));
                console.error(error);
            }
        })();
    };

    return (
        data && (
            <>
                <div className="flex justify-end items-center mb-6">
                    <div className="flex gap-3 items-center">
                        <button
                            onClick={() => {
                                show();
                            }}
                            className={`rounded-xl bg-block border-blue border hover:border-primary 
                           hover:bg-primary flex items-center justify-center p-3 w-[112px]`}
                        >
                            <i className="mr-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width={20}
                                    height={20}
                                    id="edit"
                                >
                                    <path
                                        className="fill-white"
                                        d="M5,18H9.24a1,1,0,0,0,.71-.29l6.92-6.93h0L19.71,8a1,1,0,0,0,0-1.42L15.47,2.29a1,1,0,0,0-1.42,0L11.23,5.12h0L4.29,12.05a1,1,0,0,0-.29.71V17A1,1,0,0,0,5,18ZM14.76,4.41l2.83,2.83L16.17,8.66,13.34,5.83ZM6,13.17l5.93-5.93,2.83,2.83L8.83,16H6ZM21,20H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"
                                    ></path>
                                </svg>
                            </i>
                            Update
                        </button>
                    </div>
                </div>
                <div className="bg-block p-6 rounded-3xl shadow-xl flex flex-col gap-6">
                    <div className="flex gap-6 justify-center">
                        <div className="rounded-xl overflow-hidden w-2/3">
                            <img
                                src={movieShow?.moviePosters.filter((poster) => poster.isThumb === true)[0].link}
                                alt="movie poster"
                                className="rounded-xl w-full h-full group-hover:scale-110 transition-transform duration-300 ease-linear"
                            />
                        </div>
                        <div className="flex w-1/3 flex-col">
                            <div className="text-lg text-primary font-medium">{movieShow?.name}</div>
                            <div className="text-[13px]">{movieShow?.director}</div>
                            <div className="flex gap-2 items-center mt-4">
                                <div>
                                    <div className="text-blue font-medium">
                                        {theaterShow?.name} - {theaterShow?.city}
                                    </div>
                                    <div className="">{theaterShow?.address}</div>
                                    <div>Start time: {getFormattedDateTime(data.startTime)}</div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center mt-4">
                                <div>
                                    <div className="text-blue font-medium capitalize">{data.room.name}</div>
                                    <div className="">
                                        <span className="text-blue font-medium">Room type: </span>
                                        {data.room.type}
                                    </div>
                                    <div className="">
                                        <span className="text-blue font-medium">Capacity: </span>
                                        {data.room.capacity}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Portal>
                    <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                        <div className="flex items-center justify-center">
                            <div className="border border-blue p-8 bg-background relative rounded-xl w-[450px] max-w-[662px] no-scrollbar">
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
                                    <div className="text-white font-semibold text-xl">Update show</div>
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                                    <div className="text-blue text-[15px]">Show Information</div>
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="movieParticipantIds" className="flex gap-1 mb-1 items-center">
                                            Movie
                                            <IsRequired />
                                        </label>
                                        <div>
                                            <Tippy
                                                visible={moviesMenuVisible}
                                                interactive
                                                onClickOutside={() => setMoviesMenuVisible(false)}
                                                offset={[0, 0]}
                                                placement="bottom"
                                                render={(attrs) => (
                                                    <ul
                                                        className={`border border-primary rounded-lg p-2 max-h-[300px] w-[384px] overflow-y-scroll no-scrollbar bg-background ${
                                                            moviesMenuVisible
                                                                ? "border-t-0 rounded-tl-none rounded-tr-none"
                                                                : ""
                                                        }`}
                                                        {...attrs}
                                                    >
                                                        {moviesData &&
                                                            moviesData.map((movie) => (
                                                                <li
                                                                    onClick={() => {
                                                                        setSelectedMovie(movie);
                                                                        setMoviesMenuVisible(false);
                                                                    }}
                                                                    key={movie.id}
                                                                    className={`cursor-pointer capitalize py-2 px-4 text-[13px] hover:bg-primary text-left rounded-lg flex items-center p-2 ${
                                                                        selectedMovie?.id === movie.id
                                                                            ? "text-blue pointer-events-none"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    {movie.name} - {movie.director}
                                                                </li>
                                                            ))}
                                                    </ul>
                                                )}
                                            >
                                                <div
                                                    className={`hover:border-primary py-3 px-4 border-blue border bg-background cursor-pointer w-[384px] mt-1 ${
                                                        moviesMenuVisible
                                                            ? "rounded-tl-lg rounded-tr-lg border-primary"
                                                            : "rounded-lg"
                                                    }   flex justify-between items-center`}
                                                    onClick={() => setMoviesMenuVisible(!moviesMenuVisible)}
                                                >
                                                    {selectedMovie.id === "" ? (
                                                        <span className="mr-2">All movies</span>
                                                    ) : (
                                                        <span className="mr-2">
                                                            {selectedMovie.name + " - " + selectedMovie.director}
                                                        </span>
                                                    )}
                                                    <i className={`${moviesMenuVisible ? "rotate-180" : ""}`}>
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
                                        <label htmlFor="movieParticipantIds" className="flex gap-1 mb-1 items-center">
                                            Room
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
                                                        className={`border border-primary rounded-lg p-2 max-h-[300px] w-[384px] overflow-y-scroll no-scrollbar bg-background ${
                                                            roomsMenuVisible
                                                                ? "border-t-0 rounded-tl-none rounded-tr-none"
                                                                : ""
                                                        }`}
                                                        {...attrs}
                                                    >
                                                        {roomsData &&
                                                            roomsData.map((room) => (
                                                                <li
                                                                    onClick={() => {
                                                                        setSelectedRoom(room);
                                                                        setRoomsMenuVisible(false);
                                                                    }}
                                                                    key={room.id}
                                                                    className={`cursor-pointer capitalize py-2 px-4 text-[13px] hover:bg-primary text-left rounded-lg flex items-center p-2 ${
                                                                        selectedRoom?.id === room.id
                                                                            ? "text-blue pointer-events-none"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    {room.name} - {room.type}
                                                                </li>
                                                            ))}
                                                    </ul>
                                                )}
                                            >
                                                <div
                                                    className={`hover:border-primary py-3 px-4 border-blue border bg-background cursor-pointer w-[384px] mt-1 ${
                                                        roomsMenuVisible
                                                            ? "rounded-tl-lg rounded-tr-lg border-primary"
                                                            : "rounded-lg"
                                                    }   flex justify-between items-center`}
                                                    onClick={() => setRoomsMenuVisible(!roomsMenuVisible)}
                                                >
                                                    {selectedRoom.id === "" ? (
                                                        <span className="mr-2">All rooms</span>
                                                    ) : (
                                                        <span className="mr-2">
                                                            {selectedRoom.name + " - " + selectedRoom.type}
                                                        </span>
                                                    )}
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
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="releaseDate" className="flex gap-1 mb-1 items-center">
                                            Start time
                                            <IsRequired />
                                        </label>
                                        <div className="grid grid-cols-2 gap-6">
                                            <input
                                                type="date"
                                                pattern="\d{4}-\d{2}-\d{2}"
                                                id="releaseDate"
                                                {...register("startTime")}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                            <input
                                                type="time"
                                                id="releaseDate"
                                                value={time}
                                                onChange={(e) => setTime(e.target.value)}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                        </div>
                                        {<span className="text-deepRed">{errors.startTime?.message}</span>}
                                    </div>
                                    <div className="outline outline-1 outline-border my-2"></div>
                                    <button
                                        className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                        type="submit"
                                    >
                                        Update show
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </Portal>
            </>
        )
    );
}

export default Show;
