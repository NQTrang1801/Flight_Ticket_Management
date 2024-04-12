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
import Room from "./Room";
import RoomCreating from "./RoomCreating";
import RoomDeleting from "./RoomDeleting";

const schema = yup.object().shape({
    name: yup.string().required("Name is required."),
    city: yup.string().required("City is required."),
    address: yup.string().required("Address is required.")
});

function Theater() {
    const [data, setData] = useState<ITheaters>();
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { Portal, show, hide } = usePortal({ defaultShow: false });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<ITheatersValidation>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            city: "",
            address: ""
        }
    });

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`/theaters/${id}`, {
                    headers: { "Content-Type": "application/json" }
                });
                setData(response.data);
                setValue("name", response.data.name || "");
                setValue("city", response.data.city || "");
                setValue("address", response.data.address || "");
            } catch (error) {
                console.error(error);
            }
        })();
    }, [id, setValue]);

    const onSubmit: SubmitHandler<ITheatersValidation> = async (formData) => {
        hide();
        dispatch(startLoading());
        const name = formData.name;
        const city = formData.city;
        const address = formData.address;

        (async () => {
            try {
                await axios.patch(
                    `/theaters/${id}`,
                    {
                        ...(data?.name !== name && { name }),
                        ...(data?.address !== address && { address }),
                        ...(data?.city !== city && { city })
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

    console.log(data);

    return (
        data && (
            <>
                <div className="bg-block p-6 rounded-3xl shadow-xl flex flex-col gap-2 mb-12">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <div className="text-xl font-medium flex gap-2 items-center">Theater</div>
                            <div className="text-xl text-medium text-primary flex gap-2">
                                {data.name}
                                <span className="px-2 text-[13px] text-white bg-background whitespace-nowrap inline gap-1 items-center rounded-md border border-blue">
                                    {data.rooms.length} rooms
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3 items-center">
                            <button
                                onClick={() => {
                                    show();
                                }}
                                className={`rounded-xl bg-block border-blue border hover:border-primary 
                           hover:bg-primary flex items-center justify-center p-3`}
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
                                Update theater
                            </button>
                            <RoomCreating id={data.id} />
                            <RoomDeleting rooms={data.rooms} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-center mt-4">
                        <div className="flex gap-2 items-center">
                            <i>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width={36}
                                    height={36}
                                    id="location"
                                >
                                    <path
                                        className="fill-white group-hover:fill-primary"
                                        d="M12,2a8,8,0,0,0-8,8c0,5.4,7.05,11.5,7.35,11.76a1,1,0,0,0,1.3,0C13,21.5,20,15.4,20,10A8,8,0,0,0,12,2Zm0,17.65c-2.13-2-6-6.31-6-9.65a6,6,0,0,1,12,0C18,13.34,14.13,17.66,12,19.65ZM12,6a4,4,0,1,0,4,4A4,4,0,0,0,12,6Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,12Z"
                                    ></path>
                                </svg>
                            </i>
                            <div>
                                <div className="">{data.city} City</div>
                                <div className="">{data.address}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-12">
                    {data.rooms.map((room) => (
                        <Room key={room.id} id={room.id} />
                    ))}
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
                                    <div className="text-white font-semibold text-xl">Update theater</div>
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                                    <div className="text-blue text-[15px]">Theater Information</div>
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
                                        <label htmlFor="city" className="flex gap-1 mb-1 items-center">
                                            City
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            placeholder="City . . ."
                                            {...register("city")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.city?.message}</span>}
                                    </div>
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="address" className="flex gap-1 mb-1 items-center">
                                            Address
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            placeholder="Address . . ."
                                            {...register("address")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.address?.message}</span>}
                                    </div>
                                    <div className="outline outline-1 outline-border my-2"></div>
                                    <button
                                        className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                        type="submit"
                                    >
                                        Update theater
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

export default Theater;
