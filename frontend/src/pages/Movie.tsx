import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "~/utils/axios";
import usePortal from "react-cool-portal";
import { convertNormalDate } from "~/utils/convertNormalDate";
import IsRequired from "~/icons/IsRequired";
import * as yup from "yup";
import Tippy from "@tippyjs/react/headless";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";
import convertReleaseDate from "~/utils/convertDate";
import { convertToBase64 } from "~/utils/convertToBase64";
import Rating from "react-rating";

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

function Movie() {
    const [data, setData] = useState<IMovieData>();
    const { id } = useParams();
    const { Portal, show, hide } = usePortal({ defaultShow: false });
    const [isActive, setActive] = useState(false);
    const [deleteMoviePosterIds, setDeleteMoviePosterIds] = useState<string[]>([]);
    const [rating, setRating] = useState<number>(5);
    const [reviewContent, setReviewContent] = useState<string>("");
    const [deletingReview, setDeletingReview] = useState<boolean[]>([]);
    const {
        control,
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<IMovie>({
        resolver: yupResolver(schema),
        defaultValues: {
            moviePosters: [{ isThumb: false }],
            name: "",
            duration: 0,
            description: "",
            trailerLink: "",
            releaseDate: new Date(),
            nation: "",
            director: ""
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "moviePosters"
    });
    const [allCategories, setAllCategories] = useState(
        Array<{
            id: string;
            name: string;
        }>
    );
    const [movieCategoryIds, setMovieCategoryIds] = useState<string[]>([]);
    const [movieCategories, setMovieCategories] = useState<
        Array<{
            id: string;
            name: string;
        }>
    >([]);
    const [allParticipants, setAllParticipants] = useState(
        Array<{
            id: string;
            fullName: string;
            profilePicture: string;
        }>
    );
    const [movieParticipantIds, setMovieParticipantIds] = useState<string[]>([]);
    const [movieParticipants, setMovieParticipants] = useState<
        Array<{
            id: string;
            fullName: string;
            profilePicture: string;
        }>
    >([]);
    const [moviePosters, setMoviePosters] = useState<
        Array<{
            isThumb: boolean;
            link: string;
            id: string;
            movieId: string;
        }>
    >([]);
    const [participantsMenuVisible, setParticipantsMenuVisible] = useState(false);
    const dispatch = useAppDispatch();
    const [activeVisible, setActiveVisible] = useState(false);
    const [reviews, setReviews] = useState<
        Array<{
            id: string;
            description: string;
            star: number;
            movieId: number;
            createdUser: {
                firstName: string;
                lastName: string;
            };
        }>
    >();

    useEffect(() => {
        (async () => {
            await axios
                .get(`/movies/${id}`, { headers: { "Content-Type": "application/json" } })
                .then((response) => {
                    setData(response.data);
                    setMovieCategoryIds(
                        response.data.movieCategories.map(
                            (movie: { categoryId: string; category: { name: string } }) => movie.categoryId
                        )
                    );
                    setMovieCategories(
                        response.data.movieCategories.map(
                            (movie: { categoryId: string; category: { name: string } }) => ({
                                id: movie.categoryId,
                                name: movie.category.name
                            })
                        )
                    );
                    setMovieParticipantIds(
                        response.data.movieParticipants.map(
                            (actor: { peopleId: string; people: { fullName: string; profilePicture: string } }) =>
                                actor.peopleId
                        )
                    );
                    setMovieParticipants(
                        response.data.movieParticipants.map(
                            (actor: { peopleId: string; people: { fullName: string; profilePicture: string } }) => ({
                                id: actor.peopleId,
                                fullName: actor.people.fullName,
                                profilePicture: actor.people.profilePicture
                            })
                        )
                    );
                    setMoviePosters(
                        response.data.moviePosters.map(
                            (poster: { isThumb: boolean; link: string; id: string; movieId: string }) => ({
                                id: poster.id,
                                link: poster.link,
                                isThumb: poster.isThumb,
                                movieId: poster.movieId
                            })
                        )
                    );

                    setActive(response.data.isActive);
                    setValue("name", response.data.name || "");
                    setValue("description", response.data.description || "");
                    setValue("duration", response.data.duration || 0);
                    setValue("trailerLink", response.data.trailerLink || "");
                    setValue("releaseDate", response.data.releaseDate || new Date());
                    setValue("nation", response.data.nation || "");
                    setValue("director", response.data.director || "");
                    if (response.data.reviews.length > 0) {
                        setDeletingReview(Array(response.data.reviews.length - 1).fill(false));
                    }
                })
                .catch((error) => console.error(error));
        })();
    }, [id, setValue]);

    const onSubmit: SubmitHandler<IMovie> = async (formData) => {
        hide();
        dispatch(startLoading());
        const name = formData.name;
        const duration = formData.duration;
        const description = formData.description;
        const trailerLink = formData.trailerLink;
        const releaseDate = convertReleaseDate(formData.releaseDate);
        const nation = formData.nation;
        const director = formData.director;
        const addMovieCategoryIds = movieCategoryIds.filter(
            (id) => !data?.movieCategories.map((item) => item.categoryId).includes(id)
        );
        const deleteMovieCategoryIds = data?.movieCategories
            .map((item) => item.categoryId)
            .filter((id) => !movieCategoryIds.includes(id));
        const addMovieParticipantIds = movieParticipantIds.filter(
            (id) => !data?.movieParticipants.map((item) => item.peopleId).includes(id)
        );
        const deleteMovieParticipantIds = data?.movieParticipants
            .map((item) => item.peopleId)
            .filter((id) => !movieParticipantIds.includes(id));
        const base64Promises = formData.moviePosters.map(async (poster) => ({
            ...poster,
            base64: await convert(poster.base64[0])
        }));
        const thumbnailMoviePosterId = moviePosters.filter((item) => item.isThumb === true)[0].id;

        Promise.all(base64Promises)
            .then((updatedPosters) => {
                axios
                    .patch(
                        `/movies/${id}`,
                        {
                            ...(data?.name !== name && { name }),
                            ...(data?.duration !== duration && { duration }),
                            ...(data?.description !== description && { description }),
                            ...(data?.trailerLink !== trailerLink && { trailerLink }),
                            ...(data?.releaseDate !== releaseDate && { releaseDate }),
                            ...(data?.isActive !== isActive && { isActive }),
                            ...(data?.director !== director && { director }),
                            ...(data?.nation !== nation && { nation }),
                            ...(addMovieCategoryIds.length > 0 && { addMovieCategoryIds }),
                            ...(Array.isArray(deleteMovieCategoryIds) &&
                                deleteMovieCategoryIds?.length > 0 && { deleteMovieCategoryIds }),
                            ...(addMovieParticipantIds.length > 0 && { addMovieParticipantIds }),
                            ...(moviePosters.some(
                                (item, index) => item.isThumb !== data?.moviePosters[index].isThumb
                            ) && {
                                thumbnailMoviePosterId
                            }),
                            ...(Array.isArray(deleteMovieParticipantIds) &&
                                deleteMovieParticipantIds?.length > 0 && { deleteMovieParticipantIds }),
                            ...(updatedPosters[0].base64 && { addMoviePosters: updatedPosters }),
                            ...(deleteMoviePosterIds.length > 0 && { deleteMoviePosterIds })
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
                        setTimeout(() => window.location.reload(), 2000);
                    })
                    .catch((error) => {
                        dispatch(stopLoading());
                        dispatch(sendMessage("Updated failed!"));
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error("Failed to convert base64:", error);
            });
    };

    const postReview = async () => {
        dispatch(startLoading());
        await axios
            .post(
                "/reviews/",
                {
                    movieId: id,
                    star: rating,
                    description: reviewContent
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
                dispatch(sendMessage("Added sucessfully!"));
                setTimeout(() => window.location.reload(), 2000);
            })
            .catch((error) => {
                dispatch(stopLoading());
                dispatch(sendMessage("Added failed!"));
                console.error(error);
            });
    };

    const deleteReview = async (reviewId: string) => {
        dispatch(startLoading());
        await axios
            .delete(`/reviews/${reviewId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.accessToken}`
                }
            })
            .then(() => {
                dispatch(stopLoading());
                dispatch(sendMessage("Deleted sucessfully!"));
                setTimeout(() => window.location.reload(), 2000);
            })
            .catch((error) => {
                dispatch(stopLoading());
                dispatch(sendMessage("Deleted failed!"));
                console.error(error);
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
                .then((response) => setAllCategories(response.data))
                .catch((error) => console.error(error));
        })();

        (async () => {
            await axios
                .get("/people/no-pagination", {
                    headers: { "Content-Type": "application/json" }
                })
                .then((response) => setAllParticipants(response.data))
                .catch((error) => console.error(error));
        })();

        (async () => {
            await axios
                .get(`/reviews/${id}`, {
                    headers: { "Content-Type": "application/json" }
                })
                .then((response) => setReviews(response.data))
                .catch((error) => console.error(error));
        })();
    }, [id]);

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
                    <div className="flex w-full gap-6">
                        <div className="w-1/2 relative">
                            <div
                                className="relative rounded-xl overflow-hidden pb-[56.25%]"
                                dangerouslySetInnerHTML={{ __html: data.trailerLink }}
                            ></div>
                        </div>
                        <div className="w-1/2 flex flex-col gap-2">
                            <div className="text-primary flex items-center text-xl font-semibold">
                                {data.name}
                                <span className="ml-3 shadow-lg rounded-lg pl-2 bg-background border text-[13px] text-white border-blue flex justify-center items-center">
                                    {Math.round(data.avrStars * 10) / 10}/5
                                    <i>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 25 25"
                                            width={24}
                                            height={24}
                                            id="star"
                                        >
                                            <linearGradient
                                                id="a"
                                                x1="3.063"
                                                x2="16.937"
                                                y1="11"
                                                y2="11"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop offset="0" stopColor="#ffc80b"></stop>
                                                <stop offset="1" stopColor="#e89318"></stop>
                                            </linearGradient>
                                            <path
                                                fill="url(#a)"
                                                transform="translate(0 1.5)"
                                                d="m10.4 4.7 1.8 3.6c.1.1.2.2.4.3l3.9.6c.4.1.6.6.3.9L14 12.9c-.1.1-.2.3-.1.4l.7 3.9c.1.4-.4.7-.7.5l-3.5-1.8c-.1-.1-.3-.1-.5 0l-3.5 1.8c-.4.2-.8-.1-.7-.5l.7-3.9c0-.2 0-.3-.1-.4l-3.1-3c-.3-.3-.1-.8.3-.8l3.9-.6c.2 0 .3-.1.4-.3l1.8-3.6c.1-.3.7-.3.8.1z"
                                            ></path>
                                        </svg>
                                    </i>
                                </span>
                            </div>
                            <div className="flex gap-2 mb-4">
                                {data.movieCategories.map((movieCategory) => (
                                    <span
                                        className="py-1 px-2 text-[13px] bg-background whitespace-nowrap inline gap-1 items-center rounded-md border border-blue"
                                        key={movieCategory.id}
                                    >
                                        {movieCategory.category.name}
                                    </span>
                                ))}
                            </div>
                            <div className="flex">
                                <div className="w-1/2">
                                    <span className="text-blue font-medium">Director:</span> {data.director}
                                </div>
                                <div className="">
                                    <span className="text-blue font-medium">Duration:</span> {data.duration} minutes
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-1/2">
                                    <span className="text-blue font-medium">Nationality:</span> {data.nation}
                                </div>
                                <div className="">
                                    <span className="text-blue font-medium">Release date: </span>
                                    {convertNormalDate(data.releaseDate)}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-1/2">
                                    <span className="text-blue font-medium">Active:</span>{" "}
                                    {data.isActive ? "True" : "False"}
                                </div>
                                <div className="">
                                    <span className="text-blue font-medium">Total reviews:</span> {data.totalReviews}
                                </div>
                            </div>{" "}
                            <div className="flex">
                                <div className="">
                                    <span className="text-blue font-medium">Description: </span>
                                    {data.description}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="text-blue font-medium text-lg">Posters</div>
                        <div className="flex gap-6 items-center">
                            <div className="relative">
                                <img
                                    src={data.moviePosters.filter((poster) => poster.isThumb === true)[0].link}
                                    alt="poster"
                                    className="rounded-xl h-[250px]"
                                />
                                <span className="absolute top-2 right-2 shadow-lg rounded-lg p-2 bg-background_80 flex justify-center items-center">
                                    Thumbnail
                                </span>
                            </div>
                            {data.moviePosters
                                .filter((poster) => poster.isThumb === false)
                                .map((poster, index) => (
                                    <img key={index} src={poster.link} className="rounded-xl h-[250px]" />
                                ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="text-blue font-medium text-lg">Top Cast</div>
                        <div className="grid grid-cols-4 gap-6">
                            {data.movieParticipants.map((actor) => (
                                <a
                                    href={`/actors/${actor.id}`}
                                    key={actor.id}
                                    className={`cursor-pointer bg-background shadow-xl py-2 px-4 border border-blue hover:border-primary hover:bg-primary text-left rounded-xl flex justify-between items-center p-2 `}
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={actor.people.profilePicture}
                                            alt="participant avatar"
                                            className="w-10 rounded-full aspect-square mr-4"
                                        />
                                        <span className="whitespace-nowrap overflow-hidden font-medium text-ellipsis w-[200px]">
                                            {actor.people.fullName}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="text-blue font-medium text-lg">Reviews</div>
                        <div className="flex flex-col gap-6">
                            {reviews &&
                                (reviews.length > 0 ? (
                                    reviews?.map((review, index) => (
                                        <Tippy
                                            key={review.id}
                                            visible={deletingReview[index] === true}
                                            onClickOutside={() => {
                                                const updatedDeletingReview = Array(deletingReview.length).fill(false);
                                                setDeletingReview(updatedDeletingReview);
                                            }}
                                            offset={[0, -120]}
                                            interactive
                                            render={() => (
                                                <div className="border border-blue rounded-xl bg-background relative">
                                                    <button
                                                        onClick={() => {
                                                            const updatedDeletingReview = Array(
                                                                deletingReview.length
                                                            ).fill(false);
                                                            setDeletingReview(updatedDeletingReview);
                                                        }}
                                                        className="absolute right-1 top-1 border border-blue rounded-full p-1 hover:border-primary hover:bg-primary"
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
                                                    <div className="p-6 mt-2 text-[15px]">
                                                        <div className="flex flex-col gap-2 items-center">
                                                            <span className="mr-2 mb-2">
                                                                Do you want to delete this review?
                                                            </span>
                                                            <div className="flex gap-6">
                                                                <button
                                                                    onClick={() => deleteReview(review.id)}
                                                                    className="px-5 py-2 border border-blue hover:border-mdRed hover:bg-mdRed rounded-lg"
                                                                >
                                                                    Delete
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const updatedDeletingReview = Array(
                                                                            deletingReview.length
                                                                        ).fill(false);
                                                                        setDeletingReview(updatedDeletingReview);
                                                                    }}
                                                                    className="px-5 py-2 border border-blue hover:border-primary hover:bg-primary rounded-lg"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        >
                                            <div>
                                                <div
                                                    className={`bg-background p-4 rounded-xl border border-blue relative ${
                                                        deletingReview[index] === true ? "border-primary" : ""
                                                    }`}
                                                >
                                                    <div className="absolute top-2 right-2 flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                const updatedDeletingReview = Array(
                                                                    deletingReview.length
                                                                ).fill(false);
                                                                updatedDeletingReview[index] = true;
                                                                setDeletingReview(updatedDeletingReview);
                                                            }}
                                                            className={`rounded-lg p-1 border-blue border hover:border-mdRed  hover:bg-mdRed bg-block flex items-center justify-center ${
                                                                deletingReview[index] === true
                                                                    ? "border-mdRed bg-mdRed"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <i className="">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 32 32"
                                                                    width={24}
                                                                    height={24}
                                                                    id="delete"
                                                                >
                                                                    <path
                                                                        className="fill-white"
                                                                        d="M24.2,12.193,23.8,24.3a3.988,3.988,0,0,1-4,3.857H12.2a3.988,3.988,0,0,1-4-3.853L7.8,12.193a1,1,0,0,1,2-.066l.4,12.11a2,2,0,0,0,2,1.923h7.6a2,2,0,0,0,2-1.927l.4-12.106a1,1,0,0,1,2,.066Zm1.323-4.029a1,1,0,0,1-1,1H7.478a1,1,0,0,1,0-2h3.1a1.276,1.276,0,0,0,1.273-1.148,2.991,2.991,0,0,1,2.984-2.694h2.33a2.991,2.991,0,0,1,2.984,2.694,1.276,1.276,0,0,0,1.273,1.148h3.1A1,1,0,0,1,25.522,8.164Zm-11.936-1h4.828a3.3,3.3,0,0,1-.255-.944,1,1,0,0,0-.994-.9h-2.33a1,1,0,0,0-.994.9A3.3,3.3,0,0,1,13.586,7.164Zm1.007,15.151V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Zm4.814,0V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Z"
                                                                    ></path>
                                                                </svg>
                                                            </i>
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="text-blue font-medium text-[15px]">
                                                            <div>
                                                                {review.createdUser.firstName +
                                                                    " " +
                                                                    review.createdUser.lastName}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            {Array(review.star)
                                                                .fill(null)
                                                                .map((_, index) => (
                                                                    <i key={index}>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16"
                                                                            height="16"
                                                                            id="star"
                                                                        >
                                                                            <path
                                                                                fill="#f8b84e"
                                                                                d="M-1220 1212.362c-11.656 8.326-86.446-44.452-100.77-44.568-14.324-.115-89.956 51.449-101.476 42.936-11.52-8.513 15.563-95.952 11.247-109.61-4.316-13.658-76.729-69.655-72.193-83.242 4.537-13.587 96.065-14.849 107.721-23.175 11.656-8.325 42.535-94.497 56.86-94.382 14.323.116 43.807 86.775 55.327 95.288 11.52 8.512 103.017 11.252 107.334 24.91 4.316 13.658-68.99 68.479-73.527 82.066-4.536 13.587 21.133 101.451 9.477 109.777z"
                                                                                color="#000"
                                                                                overflow="visible"
                                                                                transform="matrix(.04574 0 0 .04561 68.85 -40.34)"
                                                                            ></path>
                                                                        </svg>
                                                                    </i>
                                                                ))}
                                                            {review.star < 5 &&
                                                                Array(5 - review.star)
                                                                    .fill(null)
                                                                    .map((_, index) => (
                                                                        <i key={index}>
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="16"
                                                                                height="16"
                                                                                id="star"
                                                                            >
                                                                                <path
                                                                                    fill="#ccc"
                                                                                    d="M-1220 1212.362c-11.656 8.326-86.446-44.452-100.77-44.568-14.324-.115-89.956 51.449-101.476 42.936-11.52-8.513 15.563-95.952 11.247-109.61-4.316-13.658-76.729-69.655-72.193-83.242 4.537-13.587 96.065-14.849 107.721-23.175 11.656-8.325 42.535-94.497 56.86-94.382 14.323.116 43.807 86.775 55.327 95.288 11.52 8.512 103.017 11.252 107.334 24.91 4.316 13.658-68.99 68.479-73.527 82.066-4.536 13.587 21.133 101.451 9.477 109.777z"
                                                                                    color="#000"
                                                                                    overflow="visible"
                                                                                    transform="matrix(.04574 0 0 .04561 68.85 -40.34)"
                                                                                ></path>
                                                                            </svg>
                                                                        </i>
                                                                    ))}
                                                        </div>
                                                    </div>
                                                    {review.description && (
                                                        <div className="mt-3">{review.description}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </Tippy>
                                    ))
                                ) : (
                                    <span>No reviews.</span>
                                ))}

                            <div className="flex flex-col gap-2">
                                <div className="text-blue font-medium text-lg">New review</div>
                                <div className="flex items-center gap-2 mb-2">
                                    Rating:
                                    <Rating
                                        className="!flex gap-1"
                                        initialRating={rating}
                                        onChange={(value) => setRating(value)}
                                        emptySymbol={
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" id="star">
                                                <path
                                                    fill="#ccc"
                                                    d="M-1220 1212.362c-11.656 8.326-86.446-44.452-100.77-44.568-14.324-.115-89.956 51.449-101.476 42.936-11.52-8.513 15.563-95.952 11.247-109.61-4.316-13.658-76.729-69.655-72.193-83.242 4.537-13.587 96.065-14.849 107.721-23.175 11.656-8.325 42.535-94.497 56.86-94.382 14.323.116 43.807 86.775 55.327 95.288 11.52 8.512 103.017 11.252 107.334 24.91 4.316 13.658-68.99 68.479-73.527 82.066-4.536 13.587 21.133 101.451 9.477 109.777z"
                                                    color="#000"
                                                    overflow="visible"
                                                    transform="matrix(.04574 0 0 .04561 68.85 -40.34)"
                                                ></path>
                                            </svg>
                                        }
                                        fullSymbol={
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" id="star">
                                                <path
                                                    fill="#f8b84e"
                                                    d="M-1220 1212.362c-11.656 8.326-86.446-44.452-100.77-44.568-14.324-.115-89.956 51.449-101.476 42.936-11.52-8.513 15.563-95.952 11.247-109.61-4.316-13.658-76.729-69.655-72.193-83.242 4.537-13.587 96.065-14.849 107.721-23.175 11.656-8.325 42.535-94.497 56.86-94.382 14.323.116 43.807 86.775 55.327 95.288 11.52 8.512 103.017 11.252 107.334 24.91 4.316 13.658-68.99 68.479-73.527 82.066-4.536 13.587 21.133 101.451 9.477 109.777z"
                                                    color="#000"
                                                    overflow="visible"
                                                    transform="matrix(.04574 0 0 .04561 68.85 -40.34)"
                                                ></path>
                                            </svg>
                                        }
                                    />
                                </div>
                                <textarea
                                    onChange={(e) => setReviewContent(e.target.value)}
                                    placeholder="New review . . ."
                                    className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                />
                                <div className="flex mt-4 justify-end">
                                    <button
                                        onClick={() => {
                                            postReview();
                                        }}
                                        className={`rounded-xl bg-background border-blue border hover:border-primary 
                                   hover:bg-primary flex items-center justify-center p-3`}
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
                                        Add new review
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                                    <div className="text-white font-semibold text-xl">Update movie</div>
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
                                                placeholder="Ex: United States, France, . . ."
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
                                        <textarea
                                            id="description"
                                            rows={4}
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
                                        <textarea
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
                                                Nationality
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
                                                offset={[0, -149]}
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
                                                                isActive === false
                                                                    ? "text-blue pointer-events-none"
                                                                    : ""
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
                                            {movieCategories?.map((category) => (
                                                <span
                                                    className="py-1 px-2 text-[13px] whitespace-nowrap flex gap-1 items-center rounded-md border border-blue"
                                                    key={category.id}
                                                >
                                                    {category.name}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setMovieCategoryIds(
                                                                movieCategoryIds.filter((id) => id !== category.id)
                                                            );
                                                            setMovieCategories(
                                                                movieCategories.filter(
                                                                    (item) => item.id !== category.id
                                                                )
                                                            );
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
                                            ))}
                                        </div>
                                        <div className="text-blue mt-1">All categories</div>
                                        <div className="flex gap-2 items-center overflow-x-scroll no-scrollbar mb-2">
                                            {allCategories &&
                                                allCategories.map((category) => (
                                                    <span
                                                        onClick={() => {
                                                            setMovieCategoryIds([...movieCategoryIds, category.id]);
                                                            setMovieCategories([
                                                                ...movieCategories,
                                                                { id: category.id, name: category.name }
                                                            ]);
                                                        }}
                                                        className={`py-1 px-2 text-[13px] whitespace-nowrap rounded-md border border-blue hover:border-primary hover:bg-primary cursor-pointer ${
                                                            movieCategoryIds?.some((id) => id === category.id)
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
                                        <ul className="grid grid-cols-2 gap-4">
                                            {movieParticipants?.map((participant) => (
                                                <li
                                                    key={participant.id}
                                                    className={`cursor-pointer py-2 px-4 border border-blue hover:border-primary text-left rounded-lg flex justify-between items-center p-2 `}
                                                >
                                                    <div className="flex items-center">
                                                        <img
                                                            src={participant.profilePicture}
                                                            alt="participant avatar"
                                                            className="w-8 rounded-full aspect-square mr-3"
                                                        />
                                                        {participant.fullName}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setMovieParticipantIds(
                                                                movieParticipantIds.filter(
                                                                    (id) => id !== participant.id
                                                                )
                                                            );
                                                            setMovieParticipants(
                                                                movieParticipants.filter(
                                                                    (item) => item.id !== participant.id
                                                                )
                                                            );
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
                                                    {allParticipants &&
                                                        allParticipants.map((participant) => (
                                                            <li
                                                                onClick={() => {
                                                                    setMovieParticipantIds([
                                                                        ...movieParticipantIds,
                                                                        participant.id
                                                                    ]);
                                                                    setMovieParticipants([
                                                                        ...movieParticipants,
                                                                        {
                                                                            id: participant.id,
                                                                            fullName: participant.fullName,
                                                                            profilePicture: participant.profilePicture
                                                                        }
                                                                    ]);
                                                                }}
                                                                key={participant.id}
                                                                className={`cursor-pointer py-2 px-4 text-[13px] hover:bg-primary text-left rounded-lg flex items-center p-2 ${
                                                                    movieParticipantIds.some(
                                                                        (id) => id === participant.id
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
                                    <div className="text-blue text-[15px] mb-2">Movie Posters</div>
                                    <div className="flex gap-6 items-center flex-col">
                                        {moviePosters.map((poster) => (
                                            <div key={poster.id} className="w-full flex gap-4">
                                                <div className="relative w-full">
                                                    <img src={poster.link} alt="poster" className="rounded-xl w-full" />
                                                    {poster.isThumb && (
                                                        <span className="absolute top-2 left-2 shadow-lg rounded-lg p-2 bg-background_80 flex justify-center items-center">
                                                            Thumbnail
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setMoviePosters(
                                                                moviePosters.filter((item) => item.id !== poster.id)
                                                            );
                                                            setDeleteMoviePosterIds([
                                                                ...deleteMoviePosterIds,
                                                                poster.id
                                                            ]);
                                                        }}
                                                        type="button"
                                                        className="absolute top-2 right-2 bg-background_80 p-2 rounded-full shadow-lg hover:bg-primary"
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
                                                </div>
                                                <div className="flex gap-2 flex-1 items-center">
                                                    <input
                                                        id="poster-thumb"
                                                        name="poster-thumb"
                                                        type="radio"
                                                        className="w-[20px] h-[20px]"
                                                        checked={poster.isThumb}
                                                        onChange={() =>
                                                            setMoviePosters(
                                                                moviePosters.map((item) => {
                                                                    if (item.id === poster.id) {
                                                                        return { ...item, isThumb: true };
                                                                    }
                                                                    return { ...item, isThumb: false };
                                                                })
                                                            )
                                                        }
                                                    />
                                                    <label htmlFor="poster-thumb" className="flex gap-1 items-center">
                                                        Thumbnail
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-blue text-[15px]">New Posters</div>
                                    {fields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="grid grid-cols-2 gap-4 justify-center items-center"
                                        >
                                            <div className="flex flex-col gap-2">
                                                <label
                                                    htmlFor={`poster-${index}`}
                                                    className="flex gap-1 mb-1 items-center"
                                                >
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
                                                        type="radio"
                                                        id={`thumb-${index}`}
                                                        className="w-[20px] h-[20px]"
                                                        {...register(`moviePosters.${index}.isThumb` as const)}
                                                    />
                                                    <label
                                                        htmlFor={`thumb-${index}`}
                                                        className="flex gap-1 items-center"
                                                    >
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
                                        Update movie
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

export default Movie;
