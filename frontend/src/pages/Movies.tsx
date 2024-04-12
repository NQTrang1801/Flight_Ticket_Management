import MoviesList from "~/components/MoviesList";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import { useState, useEffect } from "react";
import usePortal from "react-cool-portal";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import axios from "~/utils/axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsRequired from "~/icons/IsRequired";
import convertReleaseDate from "~/utils/convertReleaseDate";
import { convertToBase64 } from "~/utils/convertToBase64";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";

const schema = yup.object().shape({
    name: yup.string().required("Name is required."),
    duration: yup.number().required("Duration is required.").typeError("Duration must be a number."),
    description: yup.string().required("Description is required."),
    trailerLink: yup.string().required("Trailer link is required."),
    releaseDate: yup.date().required("Release date is required.").typeError("Release date must be a date."),
    nation: yup.string().required("Nation is required."),
    director: yup.string().required("Director is required."),
    moviePosters: yup
        .array()
        .of(
            yup.object().shape({
                base64: yup.mixed(),
                isThumb: yup.boolean().required()
            })
        )
        .required()
});

function Movies() {
    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState(false);
    const [activeVisible, setActiveVisible] = useState(false);
    const [deletingMode, setDeletingMode] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("All");
    const [isActive, setActive] = useState(false);
    const [reloadFlag, setReloadFlag] = useState(false);
    const [error, setError] = useState(false);
    const [movieFilteringVisible, setMovieFilteringVisible] = useState(false);
    const [movieFiltering, setMovieFiltering] = useState<{ id: string; name: string }>({
        id: "",
        name: ""
    });
    const [categories, setCategories] = useState(
        Array<{
            id: string;
            name: string;
        }>
    );
    const [movieCategories, setMovieCategories] = useState(
        Array<{
            id: string;
            name: string;
        }>
    );
    const [participants, setParticipants] = useState(
        Array<{
            id: string;
            fullName: string;
            profilePicture: string;
        }>
    );
    const [movieParticipants, setMovieParticipants] = useState(
        Array<{
            id: string;
            fullName: string;
            profilePicture: string;
        }>
    );
    const [participantsMenuVisible, setParticipantsMenuVisible] = useState(false);

    const { Portal, show, hide } = usePortal({
        defaultShow: false
    });
    const {
        control,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<IMovie>({
        resolver: yupResolver(schema),
        defaultValues: {
            moviePosters: [{ isThumb: false }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "moviePosters"
    });

    const onSubmit: SubmitHandler<IMovie> = async (data) => {
        hide();
        dispatch(startLoading());
        const name = data.name;
        const duration = data.duration;
        const description = data.description;
        const trailerLink = data.trailerLink;
        const releaseDate = convertReleaseDate(data.releaseDate);
        const nation = data.nation;
        const director = data.director;
        const movieCategoryIds = movieCategories.map((category) => category.id);
        const movieParticipantIds = movieParticipants.map((participant) => participant.id);
        const base64Promises = data.moviePosters.map(async (poster) => ({
            ...poster,
            base64: await convert(poster.base64[0])
        }));

        Promise.all(base64Promises)
            .then((updatedPosters) => {
                const validArr = updatedPosters.filter((poster) => poster.isThumb === true);
                if (validArr.length === 1) setError(false);
                else setError(true);
                if (!error) {
                    axios
                        .post(
                            "/movies",
                            {
                                name,
                                duration,
                                description,
                                trailerLink,
                                releaseDate,
                                nation,
                                totalReviews: 0,
                                avrStars: 0,
                                isActive,
                                director,
                                movieCategoryIds,
                                movieParticipantIds,
                                moviePosters: updatedPosters
                            },
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${
                                        JSON.parse(localStorage.getItem("user")!).data.accessToken
                                    }`
                                }
                            }
                        )
                        .then(() => {
                            dispatch(stopLoading());
                            dispatch(sendMessage("Created sucessfully!"));
                            setReloadFlag(true);
                        })
                        .catch((error) => {
                            dispatch(stopLoading());
                            dispatch(sendMessage("Created failed!"));
                            console.error(error);
                        });
                }
            })
            .catch((error) => {
                console.error("Failed to convert base64:", error);
            });
    };

    const convert = async (file: File) => {
        if (file) {
            try {
                return await convertToBase64(file);
            } catch (error) {
                console.error("Failed to convert image to base64:", error);
            }
        }
    };

    useEffect(() => {
        (async () => {
            await axios
                .get("/categories/no-pagination", {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then((response) => setCategories(response.data))
                .catch((error) => console.error(error));
        })();

        (async () => {
            await axios
                .get("/people/no-pagination", {
                    headers: { "Content-Type": "application/json" }
                })
                .then((response) => setParticipants(response.data))
                .catch((error) => console.error(error));
        })();
    }, []);

    useEffect(() => {
        if (reloadFlag) {
            setReloadFlag(true);
        }
    }, [reloadFlag]);

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <div>
                        <Tippy
                            visible={visible}
                            interactive
                            onClickOutside={() => setVisible(false)}
                            offset={[0, 0]}
                            render={(attrs) => (
                                <div
                                    {...attrs}
                                    tabIndex={-1}
                                    className={`flex text-white p-2 rounded-bl-xl rounded-br-xl flex-col bg-background border-border border justify-center w-[232px] ${
                                        visible ? "border-primary border-t-0 bg-block" : ""
                                    }`}
                                >
                                    <button
                                        onClick={() => {
                                            setType("");
                                            setVisible(false);
                                            setTitle("All");
                                        }}
                                        className={`py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                            type === "" ? "text-blue pointer-events-none" : ""
                                        }`}
                                    >
                                        All movies
                                    </button>
                                    <button
                                        onClick={() => {
                                            setType("BANNER");
                                            setVisible(false);
                                            setTitle("Banner");
                                        }}
                                        className={`py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                            type === "BANNER" ? "text-blue pointer-events-none" : ""
                                        }`}
                                    >
                                        Banner movies
                                    </button>
                                    <button
                                        onClick={() => {
                                            setType("NOW_PLAYING");
                                            setVisible(false);
                                            setTitle("Now playing");
                                        }}
                                        className={`py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                            type === "NOW_PLAYING" ? "text-blue pointer-events-none" : ""
                                        }`}
                                    >
                                        Now playing movies
                                    </button>
                                    <button
                                        onClick={() => {
                                            setType("TOP_FEATURED");
                                            setVisible(false);
                                            setTitle("Top featured");
                                        }}
                                        className={`py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                            type === "TOP_FEATURED" ? "text-blue pointer-events-none" : ""
                                        }`}
                                    >
                                        Top featured movies
                                    </button>
                                    <button
                                        onClick={() => {
                                            setType("COMING_SOON");
                                            setVisible(false);
                                            setTitle("Coming soon");
                                        }}
                                        className={`py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                            type === "COMING_SOON" ? "text-blue pointer-events-none" : ""
                                        }`}
                                    >
                                        Coming soon movies
                                    </button>
                                </div>
                            )}
                        >
                            <button
                                onClick={() => setVisible(!visible)}
                                className={`hover:border-primary bg-block py-3 px-5 border-blue border ${
                                    visible ? "rounded-tl-xl rounded-tr-xl border-primary" : "rounded-xl"
                                }   flex justify-between items-center w-[232px]`}
                            >
                                <span className="">{title} movies</span>
                                <i className={`${visible ? "rotate-180" : ""}`}>
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
                            </button>
                        </Tippy>
                    </div>
                    <div>
                        <Tippy
                            visible={movieFilteringVisible}
                            interactive
                            onClickOutside={() => setMovieFilteringVisible(false)}
                            offset={[0, 0]}
                            render={(attrs) => (
                                <div
                                    {...attrs}
                                    tabIndex={-1}
                                    className={`flex text-white p-2 rounded-bl-xl rounded-br-xl flex-col bg-background border-border border justify-center w-[170px] ${
                                        movieFilteringVisible ? "border-primary border-t-0 bg-block" : ""
                                    }`}
                                >
                                    <button
                                        onClick={() => {
                                            setMovieFiltering({ id: "", name: "" });
                                            setMovieFilteringVisible(false);
                                        }}
                                        className={`py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                            movieFiltering.id === "" && "text-blue pointer-events-none"
                                        }`}
                                    >
                                        All categories
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => {
                                                setMovieFiltering({ id: category.id, name: category.name });
                                                setMovieFilteringVisible(false);
                                            }}
                                            className={`py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                movieFiltering.id === category.id ? "text-blue pointer-events-none" : ""
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        >
                            <button
                                onClick={() => setMovieFilteringVisible(!movieFilteringVisible)}
                                className={`hover:border-primary bg-block py-3 px-5 border-blue border ${
                                    movieFilteringVisible ? "rounded-tl-xl rounded-tr-xl border-primary" : "rounded-xl"
                                }   flex justify-between items-center w-[170px]`}
                            >
                                {movieFiltering.id !== "" ? (
                                    <span className="">{movieFiltering.name}</span>
                                ) : (
                                    <span className="">All categories</span>
                                )}
                                <i className={`${movieFilteringVisible ? "rotate-180" : ""}`}>
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
                            </button>
                        </Tippy>
                    </div>
                </div>
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => {
                            setDeletingMode(false);
                            show();
                        }}
                        className="rounded-xl bg-block border-blue border hover:border-primary hover:bg-primary flex items-center justify-center p-3 w-[112px]"
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
                    <button
                        onClick={() => setDeletingMode(!deletingMode)}
                        className={`rounded-xl border-blue border hover:border-primary ${
                            deletingMode ? "border-mdRed bg-mdRed" : ""
                        } hover:bg-primary bg-block flex items-center justify-center p-3 w-[112px]`}
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
                        Delete
                    </button>
                </div>
            </div>
            {deletingMode && (
                <div className="shadow-xl rounded-xl bg-block mb-6">
                    <div className="bg-primary h-6 rounded-tr-xl rounded-tl-xl"></div>
                    <div className="p-6 text-[15px]">Select a movie below to delete.</div>
                </div>
            )}
            <MoviesList
                type={type}
                deletingMode={deletingMode}
                reloadFlag={reloadFlag}
                categoryId={movieFiltering.id}
            />
            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="border border-blue p-8 bg-background relative rounded-xl max-h-[810px] max-w-[662px] overflow-y-scroll no-scrollbar">
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
                                <div className="text-white font-semibold text-xl">Create a new movie</div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                                <div className="text-blue text-[15px]">Movie Information</div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="name" className="flex gap-1 mb-1 items-center">
                                            Name
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder="Name . . ."
                                            {...register("name")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.name?.message}</span>}
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="director" className="flex gap-1 mb-1 items-center">
                                            Director
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="text"
                                            id="director"
                                            {...register("director")}
                                            placeholder="Ex: Christopher Nolan . . ."
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.director?.message}</span>}
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <label htmlFor="description" className="flex gap-1 mb-1 items-center">
                                        Description
                                        <IsRequired />
                                    </label>
                                    <input
                                        type="text"
                                        id="description"
                                        {...register("description")}
                                        placeholder="Description . . ."
                                        className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                    />
                                    {<span className="text-deepRed">{errors.description?.message}</span>}
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <label htmlFor="trailerLink" className="flex gap-1 mb-1 items-center">
                                        Trailer link
                                        <IsRequired />
                                    </label>
                                    <input
                                        type="text"
                                        id="trailerLink"
                                        {...register("trailerLink")}
                                        placeholder="Trailer link . . ."
                                        className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                    />
                                    {<span className="text-deepRed">{errors.trailerLink?.message}</span>}
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex gap-2 flex-col flex-1">
                                        <label htmlFor="nation" className="flex gap-1 mb-1 items-center">
                                            Nation
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="text"
                                            id="nation"
                                            {...register("nation")}
                                            placeholder="Ex: United States . . ."
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.nation?.message}</span>}
                                    </div>
                                    <div className="flex gap-2 flex-col flex-1">
                                        <label htmlFor="duration" className="flex gap-1 mb-1 items-center">
                                            Duration
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="number"
                                            id="duration"
                                            {...register("duration")}
                                            placeholder="Ex: 180"
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.duration?.message}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="releaseDate" className="flex gap-1 mb-1 items-center">
                                            Release date
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="date"
                                            pattern="\d{4}-\d{2}-\d{2}"
                                            id="releaseDate"
                                            {...register("releaseDate")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.releaseDate?.message}</span>}
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="active" className="flex gap-1 mb-1 items-center">
                                            Active
                                        </label>
                                        <Tippy
                                            interactive
                                            onClickOutside={() => setActiveVisible(!activeVisible)}
                                            visible={activeVisible}
                                            offset={[0, 0]}
                                            placement="bottom"
                                            render={(attrs) => (
                                                <div
                                                    {...attrs}
                                                    className={`flex w-[290px] text-white p-2 rounded-bl-lg rounded-br-lg flex-col bg-background outline-1 outline-border outline justify-center ${
                                                        activeVisible ? "outline-primary" : ""
                                                    }`}
                                                >
                                                    <div
                                                        onClick={() => {
                                                            setActive(true);
                                                            setActiveVisible(false);
                                                        }}
                                                        className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                            isActive === true ? "text-blue pointer-events-none" : ""
                                                        }`}
                                                    >
                                                        True
                                                    </div>
                                                    <div
                                                        onClick={() => {
                                                            setActive(false);
                                                            setActiveVisible(false);
                                                        }}
                                                        className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                            isActive === false ? "text-blue pointer-events-none" : ""
                                                        }`}
                                                    >
                                                        False
                                                    </div>
                                                </div>
                                            )}
                                        >
                                            <div
                                                tabIndex={-1}
                                                onClick={() => setActiveVisible(!activeVisible)}
                                                className={`hover:outline-primary py-3 px-4 outline-blue outline-1 outline bg-[rgba(141,124,221,0.1)] cursor-pointer ${
                                                    activeVisible
                                                        ? "rounded-tl-lg rounded-tr-lg outline-primary"
                                                        : "rounded-lg"
                                                }   flex justify-between items-center`}
                                            >
                                                {isActive === false ? "False" : "True"}
                                                <i className={`${activeVisible ? "rotate-180" : ""}`}>
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
                                    <label htmlFor="movieCategoryIds" className="flex gap-1 mb-1 items-center">
                                        Categories
                                        <IsRequired />
                                    </label>
                                    <div className="flex gap-2 items-center overflow-x-scroll no-scrollbar">
                                        {movieCategories &&
                                            (movieCategories.length > 0 ? (
                                                movieCategories.map((movieCategory) => (
                                                    <span
                                                        className="py-1 px-2 text-[13px] whitespace-nowrap flex gap-1 items-center rounded-md border border-blue"
                                                        key={movieCategory.id}
                                                    >
                                                        {movieCategory.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const filteredArray = movieCategories.filter(
                                                                    (obj) => obj.id !== movieCategory.id
                                                                );
                                                                setMovieCategories(filteredArray);
                                                            }}
                                                        >
                                                            <i>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    width={12}
                                                                    height={12}
                                                                    id="close"
                                                                >
                                                                    <path
                                                                        className="fill-white"
                                                                        d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
                                                                    ></path>
                                                                </svg>
                                                            </i>
                                                        </button>
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs">Click on tags below to add categories.</span>
                                            ))}
                                    </div>
                                    <div className="text-blue mt-1">All categories</div>
                                    <div className="flex gap-2 items-center overflow-x-scroll no-scrollbar mb-2">
                                        {categories &&
                                            categories.map((category) => (
                                                <span
                                                    onClick={() => {
                                                        setMovieCategories([...movieCategories, category]);
                                                    }}
                                                    className={`py-1 px-2 text-[13px] whitespace-nowrap rounded-md border border-blue hover:border-primary hover:bg-primary cursor-pointer ${
                                                        movieCategories.some((obj) => obj.id === category.id)
                                                            ? "opacity-50 pointer-events-none"
                                                            : ""
                                                    }`}
                                                    key={category.id}
                                                >
                                                    {category.name}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <label htmlFor="movieParticipantIds" className="flex gap-1 mb-1 items-center">
                                        Actors
                                        <IsRequired />
                                    </label>
                                    {movieParticipants && movieParticipants.length > 0 ? (
                                        <ul className="grid grid-cols-2 gap-4">
                                            {movieParticipants.map((movieParticipant) => (
                                                <li
                                                    key={movieParticipant.id}
                                                    className={`cursor-pointer py-2 px-4 border border-blue hover:border-primary text-left rounded-lg flex justify-between items-center p-2 `}
                                                >
                                                    <div className="flex items-center">
                                                        <img
                                                            src={movieParticipant.profilePicture}
                                                            alt="participant avatar"
                                                            className="w-8 rounded-full aspect-square mr-3"
                                                        />
                                                        {movieParticipant.fullName}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const filteredArray = movieParticipants.filter(
                                                                (obj) => obj.id !== movieParticipant.id
                                                            );
                                                            setMovieParticipants(filteredArray);
                                                        }}
                                                    >
                                                        <i>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                width={16}
                                                                height={16}
                                                                id="close"
                                                            >
                                                                <path
                                                                    className="fill-white"
                                                                    d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
                                                                ></path>
                                                            </svg>
                                                        </i>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-xs">Click on all actors below to add actor.</span>
                                    )}
                                    <div className="text-blue mt-1">All actors</div>
                                    <Tippy
                                        visible={participantsMenuVisible}
                                        interactive
                                        onClickOutside={() => setParticipantsMenuVisible(false)}
                                        offset={[0, -346]}
                                        render={(attrs) => (
                                            <ul
                                                className={`border border-primary rounded-lg p-2 max-h-[300px] w-[290px] overflow-y-scroll no-scrollbar bg-background ${
                                                    participantsMenuVisible
                                                        ? "border-t-0 rounded-tl-none rounded-tr-none"
                                                        : ""
                                                }`}
                                                {...attrs}
                                            >
                                                {participants &&
                                                    participants.map((participant) => (
                                                        <li
                                                            onClick={() =>
                                                                setMovieParticipants([
                                                                    ...movieParticipants,
                                                                    participant
                                                                ])
                                                            }
                                                            key={participant.id}
                                                            className={`cursor-pointer py-2 px-4 text-[13px] hover:bg-primary text-left rounded-lg flex items-center p-2 ${
                                                                movieParticipants.some(
                                                                    (movieParticipant) =>
                                                                        movieParticipant.id === participant.id
                                                                )
                                                                    ? "text-blue pointer-events-none"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <img
                                                                src={participant.profilePicture}
                                                                alt="participant avatar"
                                                                className="w-8 rounded-full aspect-square mr-3"
                                                            />
                                                            {participant.fullName}
                                                        </li>
                                                    ))}
                                            </ul>
                                        )}
                                    >
                                        <div
                                            className={`hover:border-primary py-3 px-4 border-blue border bg-background cursor-pointer w-[290px] mt-1 ${
                                                participantsMenuVisible
                                                    ? "rounded-tl-lg rounded-tr-lg border-primary"
                                                    : "rounded-lg"
                                            }   flex justify-between items-center`}
                                            onClick={() => setParticipantsMenuVisible(!participantsMenuVisible)}
                                        >
                                            All actors
                                            <i className={`${participantsMenuVisible ? "rotate-180" : ""}`}>
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
                                <div className="outline outline-1 outline-border my-2"></div>
                                <div className="text-blue text-[15px]">Movie Posters</div>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-2 gap-4 justify-center items-center">
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor={`poster-${index}`} className="flex gap-1 mb-1 items-center">
                                                Poster link
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="file"
                                                placeholder="Poster link..."
                                                id={`poster-${index}`}
                                                {...register(`moviePosters.${index}.base64` as const)}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:border-primary focus:border focus:border-1 border border-blue border-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                        </div>
                                        <div className="flex gap-2 mt-8">
                                            <div className="flex gap-2 flex-1 items-center">
                                                <input
                                                    type="checkbox"
                                                    className="w-[20px] h-[20px]"
                                                    {...register(`moviePosters.${index}.isThumb` as const)}
                                                />
                                                <label htmlFor={`poster-${index}`} className="flex gap-1 items-center">
                                                    Thumbnail
                                                </label>
                                            </div>
                                            <button
                                                className="border border-1 border-blue rounded-lg px-5 py-3 hover:border-primary hover:bg-primary"
                                                type="button"
                                                onClick={() => remove(index)}
                                            >
                                                Delete this field
                                            </button>
                                        </div>
                                        {
                                            <span className="text-deepRed mt-[-8px]">
                                                {errors?.moviePosters?.[index]?.base64?.message}
                                            </span>
                                        }
                                    </div>
                                ))}
                                <div className="flex items-center justify-center">
                                    {error && <span className="text-deepRed">A movie must have only one poster.</span>}
                                    <button
                                        type="button"
                                        className="outline outline-1 outline-blue px-5 py-3 rounded-lg hover:outline-primary hover:bg-primary"
                                        onClick={() => append({ isThumb: false })}
                                    >
                                        Add new poster
                                    </button>
                                </div>
                                <div className="outline outline-1 outline-border my-2"></div>
                                <button
                                    className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                    type="submit"
                                >
                                    Create movie
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    );
}

export default Movies;
