import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "~/utils/axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";
import { useAppDispatch } from "~/hook";
import convertReleaseDate from "~/utils/convertReleaseDate";
import usePortal from "react-cool-portal";
import IsRequired from "~/icons/IsRequired";
import { convertToBase64 } from "~/utils/convertToBase64";
import { convertNormalDate } from "~/utils/convertNormalDate";

const schema = yup.object().shape({
    title: yup.string().required("Title is required."),
    shortDesc: yup.string().required("Short description is required."),
    fullDesc: yup.string().required("Full description is required."),
    base64NewsPictures: yup.array().of(yup.mixed()).required()
});

function NewsDetail() {
    const [data, setData] = useState<INewsData>();
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { Portal, show, hide } = usePortal({ defaultShow: false });
    const [deleteNewsPictureIds, setDeleteNewsPictureIds] = useState<string[]>([]);
    const [newsPictures, setNewsPictures] = useState<
        Array<{
            id: string;
            link: string;
            movieId: string;
        }>
    >([]);

    const {
        control,
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<INewsValidation>({
        resolver: yupResolver(schema),
        defaultValues: {
            title: "",
            shortDesc: "",
            fullDesc: ""
        }
    });

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
            try {
                const response = await axios.get(`/news/${id}`, {
                    headers: { "Content-Type": "application/json" }
                });
                setData(response.data);
                setNewsPictures(response.data.newsPictures);
                setValue("title", response.data.title || "");
                setValue("shortDesc", response.data.shortDesc || "");
                setValue("fullDesc", response.data.fullDesc || "");
            } catch (error) {
                console.error(error);
            }
        })();
    }, [id, setValue]);

    const onSubmit: SubmitHandler<INewsValidation> = async (formData) => {
        hide();
        dispatch(startLoading());
        const title = formData.title;
        const shortDesc = formData.shortDesc;
        const fullDesc = formData.fullDesc;
        const base64Promises = formData.base64NewsPictures.map(async (picture) => await convert(picture[0]));

        Promise.all(base64Promises)
            .then((pictures) => {
                axios
                    .patch(
                        `/news/${id}`,
                        {
                            ...(data?.title !== title && { title }),
                            ...(data?.shortDesc !== shortDesc && { shortDesc }),
                            ...(data?.fullDesc !== fullDesc && { fullDesc }),
                            ...(Array.isArray(pictures) && pictures.length > 0 && { base64NewsPictures: pictures }),
                            ...(deleteNewsPictureIds.length > 0 && { deleteNewsPictureIds })
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
            })
            .catch((error) => {
                console.error("Failed to convert base64:", error);
            });
    };

    const { fields, append, remove } = useFieldArray({
        control,
        name: "base64NewsPictures"
    });

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
                <div className="bg-block p-8 rounded-3xl shadow-xl flex flex-col gap-6">
                    <div>
                        <div className="text-primary font-medium text-xl mb-2">{data.title}</div>
                        <div>
                            <span className="mr-1 font-medium text-blue">Created at:</span>
                            {convertNormalDate(convertReleaseDate(data.createdAt))}
                        </div>
                    </div>
                    <div>{data.shortDesc}</div>
                    <div className="flex flex-col gap-8 justify-center px-32">
                        {data.newsPictures.map((image) => (
                            <img key={image.id} src={image.link} alt="news picture" className="rounded-xl w-full" />
                        ))}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: data.fullDesc }}></div>
                </div>
                <Portal>
                    <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                        <div className="flex items-center justify-center">
                            <div className="border border-blue p-8 bg-background relative rounded-xl max-h-[810px] w-[810px] max-w-[662px]  overflow-y-scroll no-scrollbar">
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
                                    <div className="text-white font-semibold text-xl">Create a news</div>
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                                    <div className="text-blue text-[15px]">News Information</div>
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="title" className="flex gap-1 mb-1 items-center">
                                            Title
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            placeholder="Title . . ."
                                            {...register("title")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.title?.message}</span>}
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="shortDesc" className="flex gap-1 mb-1 items-center">
                                            Short description
                                            <IsRequired />
                                        </label>
                                        <textarea
                                            rows={3}
                                            id="shortDesc"
                                            placeholder="Short description . . ."
                                            {...register("shortDesc")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.shortDesc?.message}</span>}
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="fullDesc" className="flex gap-1 mb-1 items-center">
                                            Full description
                                            <IsRequired />
                                        </label>
                                        <textarea
                                            rows={10}
                                            id="fullDesc"
                                            placeholder="Short description . . ."
                                            {...register("fullDesc")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.fullDesc?.message}</span>}
                                    </div>
                                    <div className="text-blue text-[15px]">News Pictures</div>
                                    <div className="flex gap-6 items-center flex-col">
                                        {newsPictures.map((picture) => (
                                            <div key={picture.id} className="w-full flex gap-4">
                                                <div className="relative w-full">
                                                    <img
                                                        src={picture.link}
                                                        alt="picture"
                                                        className="rounded-xl w-full"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            setNewsPictures(
                                                                newsPictures.filter((item) => item.id !== picture.id)
                                                            );
                                                            setDeleteNewsPictureIds([
                                                                ...deleteNewsPictureIds,
                                                                picture.id
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
                                            </div>
                                        ))}
                                    </div>
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex w-full justify-center items-center">
                                            <div className="w-2/3 flex flex-col gap-2 mr-[16px]">
                                                <label
                                                    htmlFor={`picture-${index}`}
                                                    className="flex gap-1 mb-1 items-center"
                                                >
                                                    Picture link
                                                    <IsRequired />
                                                </label>
                                                <input
                                                    type="file"
                                                    placeholder="Picture link..."
                                                    id={`picture-${index}`}
                                                    {...register(`base64NewsPictures.${index}` as const)}
                                                    className="bg-[rgba(141,124,221,0.1)] text-sm focus:border-primary focus:border focus:border-1 border border-blue border-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                                />
                                            </div>
                                            <button
                                                className="border w-1/3 border-1 border-blue rounded-lg px-5 py-[15px] mt-[31px] hover:border-primary hover:bg-primary"
                                                type="button"
                                                onClick={() => remove(index)}
                                            >
                                                Delete this field
                                            </button>
                                            {
                                                <span className="text-deepRed mt-[-8px]">
                                                    {errors?.base64NewsPictures?.[index]?.message}
                                                </span>
                                            }
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-center mt-2">
                                        <button
                                            type="button"
                                            className="outline outline-1 outline-blue px-5 py-3 rounded-lg hover:outline-primary hover:bg-primary"
                                            onClick={() => append(File)}
                                        >
                                            Add new picture
                                        </button>
                                    </div>
                                    <div className="outline outline-1 outline-border my-2"></div>
                                    <button
                                        className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                        type="submit"
                                    >
                                        Update news
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

export default NewsDetail;
