import axios from "~/utils/axios";
import { useState, useEffect } from "react";
import usePortal from "react-cool-portal";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsRequired from "~/icons/IsRequired";
import { convertToBase64 } from "~/utils/convertToBase64";
import { useAppDispatch, useAppSelector } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";
import NewsItem from "~/components/NewsItem";

const schema = yup.object().shape({
    title: yup.string().required("Title is required."),
    shortDesc: yup.string().required("Short description is required."),
    fullDesc: yup.string().required("Full description is required."),
    base64NewsPictures: yup.array().of(yup.mixed()).required()
});

function News() {
    const [data, setData] = useState<Array<INews>>();
    const [deletingMode, setDeletingMode] = useState(false);
    const { Portal, show, hide } = usePortal({
        defaultShow: false
    });
    const dispatch = useAppDispatch();
    const { query } = useAppSelector((state) => state.searching!);
    const {
        control,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<INewsValidation>({
        resolver: yupResolver(schema),
        defaultValues: {
            base64NewsPictures: [File]
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

    const { fields, append, remove } = useFieldArray({
        control,
        name: "base64NewsPictures"
    });

    const onSubmit: SubmitHandler<INewsValidation> = async (data) => {
        hide();
        dispatch(startLoading());
        const title = data.title;
        const shortDesc = data.shortDesc;
        const fullDesc = data.fullDesc;
        const base64Promises = data.base64NewsPictures.map(async (picture) => await convert(picture[0]));

        Promise.all(base64Promises)
            .then((pictures) => {
                axios
                    .post(
                        "/news",
                        {
                            title,
                            shortDesc,
                            fullDesc,
                            base64NewsPictures: pictures
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
            })
            .catch((error) => {
                console.error("Failed to convert base64:", error);
            });
    };

    useEffect(() => {
        (async () => {
            await axios
                .get("/news?page=1&take=10", { headers: { "Content-Type": "application/json" } })
                .then((response) => {
                    setData(response.data.data);
                })
                .catch((err) => console.error(err));
        })();
    }, []);

    return (
        <>
            <div className="flex justify-end items-center mb-6">
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => {
                            setDeletingMode(false);
                            show();
                        }}
                        className="bg-block rounded-xl border-blue border hover:border-primary hover:bg-primary flex items-center justify-center p-3 w-[112px]"
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
                        className={`bg-block rounded-xl border-blue border hover:border-primary ${
                            deletingMode ? "border-mdRed bg-mdRed" : ""
                        } hover:bg-primary flex items-center justify-center p-3 w-[112px]`}
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
                    <div className="p-6 text-[15px]">Select a news below to delete.</div>
                </div>
            )}
            <div className="bg-block p-6 rounded-3xl shadow-xl">
                <ul className="flex flex-col gap-8 w-full">
                    {data
                        ?.filter((news) => news.title.toLowerCase().includes(query.toLowerCase()))
                        .map((news) => (
                            <NewsItem
                                key={news.id}
                                id={news.id}
                                shortDesc={news.shortDesc}
                                title={news.title}
                                newsPicture={news.newsPictures[news.newsPictures.length - 1].link}
                                deletingMode={deletingMode}
                            />
                        ))}
                </ul>
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
                                    Create news
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    );
}

export default News;
