import axios from "~/utils/axios";
import usePortal from "react-cool-portal";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsRequired from "~/icons/IsRequired";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";

const schema = yup.object().shape({
    name: yup.string().required("Name is required."),
    type: yup.string().required("Type is required.")
});

interface Props {
    id: string;
}

const RoomCreating: React.FC<Props> = ({ id }) => {
    const { Portal, show, hide } = usePortal({
        defaultShow: false
    });
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<IRoomsValidation>({
        resolver: yupResolver(schema)
    });

    const onSubmit: SubmitHandler<IRoomsValidation> = async (formData) => {
        hide();
        dispatch(startLoading());
        const name = formData.name;
        const type = formData.type;

        (async () => {
            axios
                .post(
                    "/rooms",
                    {
                        name,
                        theaterId: id,
                        type,
                        capacity: 0
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

    return (
        <>
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
                Create room
            </button>
            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="border border-blue p-8 bg-background relative rounded-xl max-h-[810px]  max-w-[662px] w-[400px] overflow-y-scroll no-scrollbar">
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
                                <div className="text-white font-semibold text-xl">Create a room</div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                                <div className="text-blue text-[15px]">Room Information</div>
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
                                    <label htmlFor="type" className="flex gap-1 mb-1 items-center">
                                        Type
                                        <IsRequired />
                                    </label>
                                    <input
                                        type="text"
                                        id="type"
                                        placeholder="Type . . ."
                                        {...register("type")}
                                        className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                    />
                                    {<span className="text-deepRed">{errors.type?.message}</span>}
                                </div>

                                <div className="outline outline-1 outline-border my-2"></div>
                                <button
                                    className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                    type="submit"
                                >
                                    Create a room
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    );
};

export default RoomCreating;
