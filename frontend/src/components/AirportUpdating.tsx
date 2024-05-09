import axios from "~/utils/axios";
import { useState } from "react";
import Tippy from "@tippyjs/react/headless";
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
    address: yup.string().required("Address is required."),
    country: yup.string().required("Country is required."),
    code: yup.string().required("Code is required."),
    terminals: yup.number().default(1),
    capacity: yup.number().default(2000)
});

interface AirportUpdatingProps {
    _id: string;
    code: string;
    name: string;
    country: string;
    address: string;
    timezone: string;
    terminals: number;
    capacity: number;
    isInternational: boolean;
    coordinates: {
        type: string;
        coordinates: number[];
    };
    status: boolean;
}

const AirportUpdating: React.FC<AirportUpdatingProps> = ({
    _id,
    code,
    name,
    country,
    address,
    timezone,
    terminals,
    capacity,
    status,
    isInternational,
    coordinates
}) => {
    const { Portal, hide } = usePortal({
        defaultShow: true
    });

    const [apTimezone, setApTimezone] = useState(timezone);
    const [timezoneVisible, setTimezoneVisible] = useState(false);
    const [latitude, setLatitude] = useState(coordinates.coordinates[0]);
    const [longitude, setLongitude] = useState(coordinates.coordinates[1]);

    const timezones = [
        "GMT-12",
        "GMT-11",
        "GMT-10",
        "GMT-9",
        "GMT-8",
        "GMT-7",
        "GMT-6",
        "GMT-5",
        "GMT-4",
        "GMT-3",
        "GMT-2",
        "GMT-1",
        "GMT+0",
        "GMT+1",
        "GMT+2",
        "GMT+3",
        "GMT+4",
        "GMT+5",
        "GMT+6",
        "GMT+7",
        "GMT+8",
        "GMT+9",
        "GMT+10",
        "GMT+11",
        "GMT+12"
    ];

    const handleSelectTimezone = (value: string) => {
        setApTimezone(value);
        setTimezoneVisible(false);
    };
    const onChangeLatitude = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLatitude(value);
    };
    const onChangeLongitude = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLongitude(value);
    };

    const [international, setInternational] = useState(isInternational);
    const [internationalVisible, setInternationalVisible] = useState(false);

    const [apStatus, setApStatus] = useState(status);
    const [statusVisible, setStatusVisible] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: name,
            country: country,
            address: address,
            terminals: terminals,
            capacity: capacity,
            code: code
        }
    });

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<AirportValidation> = async (formData) => {
        hide();
        dispatch(startLoading());

        const name = formData.name;
        const country = formData.country;
        const code = formData.code;
        const address = formData.address;
        const terminals = formData.terminals;
        const capacity = formData.capacity;

        (async () => {
            axios
                .put(
                    `/airport/511246675/${_id}`,
                    {
                        name,
                        country,
                        code,
                        address,
                        terminals,
                        capacity,
                        status: apStatus,
                        isInternational: international,
                        timezone: apTimezone,
                        coordinates: {
                            type: "Point",
                            coordinates: [latitude, longitude]
                        },
                        rule: []
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.token}`
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
        })();
    };

    return (
        <>
            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="border border-blue p-8 bg-background relative rounded-xl max-h-[810px] max-w-[662px]  overflow-y-scroll no-scrollbar">
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
                                <div className="text-white font-semibold text-xl">Update airport</div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex gap-2 flex-col">
                                            <label htmlFor="code" className="flex gap-1 mb-1 items-center">
                                                Code
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="text"
                                                id="code"
                                                placeholder="Code . . ."
                                                {...register("code")}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                            {<span className="text-deepRed">{errors.code?.message}</span>}
                                        </div>
                                        <div className="flex gap-2 flex-col">
                                            <label htmlFor="country" className="flex gap-1 mb-1 items-center">
                                                Country
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="text"
                                                id="country"
                                                placeholder="Country . . ."
                                                {...register("country")}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                            {<span className="text-deepRed">{errors.country?.message}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
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
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="active" className="flex gap-1 mb-1 items-center">
                                            International airport
                                        </label>
                                        <Tippy
                                            interactive
                                            onClickOutside={() => setInternationalVisible(!internationalVisible)}
                                            visible={internationalVisible}
                                            offset={[0, -149]}
                                            render={(attrs) => (
                                                <div
                                                    {...attrs}
                                                    className={`flex w-[290px] text-white p-2 rounded-bl-lg rounded-br-lg flex-col bg-background outline-1 outline-border outline justify-center ${
                                                        internationalVisible ? "outline-primary" : ""
                                                    }`}
                                                >
                                                    <div
                                                        onClick={() => {
                                                            setInternational(false);
                                                            setInternationalVisible(false);
                                                        }}
                                                        className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                            international === false
                                                                ? "text-blue pointer-events-none"
                                                                : ""
                                                        }`}
                                                    >
                                                        False
                                                    </div>
                                                    <div
                                                        onClick={() => {
                                                            setInternational(true);
                                                            setInternationalVisible(false);
                                                        }}
                                                        className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                            international === true
                                                                ? "text-blue pointer-events-none"
                                                                : ""
                                                        }`}
                                                    >
                                                        True
                                                    </div>
                                                </div>
                                            )}
                                        >
                                            <div
                                                tabIndex={-1}
                                                onClick={() => setInternationalVisible(!internationalVisible)}
                                                className={`hover:outline-primary py-3 px-4 outline-blue outline-1 outline bg-[rgba(141,124,221,0.1)] cursor-pointer ${
                                                    internationalVisible
                                                        ? "rounded-tl-lg rounded-tr-lg outline-primary"
                                                        : "rounded-lg"
                                                }   flex justify-between items-center`}
                                            >
                                                {international === false ? "False" : "True"}
                                                <i className={`${internationalVisible ? "rotate-180" : ""}`}>
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
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="timezone" className="flex gap-1 mb-1 items-center">
                                            Time zone
                                            <IsRequired />
                                        </label>
                                        <Tippy
                                            interactive
                                            onClickOutside={() => setTimezoneVisible(!timezoneVisible)}
                                            visible={timezoneVisible}
                                            offset={[0, 0]}
                                            placement="bottom"
                                            render={(attrs) => (
                                                <div
                                                    {...attrs}
                                                    className={`flex w-[188px] text-white p-2 rounded-bl-lg rounded-br-lg flex-col bg-background outline-1 outline-border outline justify-center ${
                                                        timezoneVisible ? "outline-primary" : ""
                                                    }`}
                                                >
                                                    {timezones.map((tz) => (
                                                        <div
                                                            key={tz}
                                                            onClick={() => handleSelectTimezone(tz)}
                                                            className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                                apTimezone === tz ? "text-blue pointer-events-none" : ""
                                                            }`}
                                                        >
                                                            {tz}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        >
                                            <div
                                                tabIndex={-1}
                                                onClick={() => setTimezoneVisible(!timezoneVisible)}
                                                className={`hover:outline-primary py-3 px-4 outline-blue outline-1 outline bg-[rgba(141,124,221,0.1)] cursor-pointer ${
                                                    timezoneVisible
                                                        ? "rounded-tl-lg rounded-tr-lg outline-primary"
                                                        : "rounded-lg"
                                                }   flex justify-between items-center`}
                                            >
                                                {apTimezone}
                                                <i className={`${timezoneVisible ? "rotate-180" : ""}`}>
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
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="active" className="flex gap-1 mb-1 items-center">
                                            Status
                                        </label>
                                        <Tippy
                                            interactive
                                            onClickOutside={() => setStatusVisible(!statusVisible)}
                                            visible={statusVisible}
                                            offset={[0, 0]}
                                            placement="bottom"
                                            render={(attrs) => (
                                                <div
                                                    {...attrs}
                                                    className={`flex w-[188px] text-white p-2 rounded-bl-lg rounded-br-lg flex-col bg-background outline-1 outline-border outline justify-center ${
                                                        statusVisible ? "outline-primary" : ""
                                                    }`}
                                                >
                                                    <div
                                                        onClick={() => {
                                                            setApStatus(false);
                                                            setStatusVisible(false);
                                                        }}
                                                        className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                            apStatus === false ? "text-blue pointer-events-none" : ""
                                                        }`}
                                                    >
                                                        False
                                                    </div>
                                                    <div
                                                        onClick={() => {
                                                            setApStatus(true);
                                                            setStatusVisible(false);
                                                        }}
                                                        className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                            apStatus === true ? "text-blue pointer-events-none" : ""
                                                        }`}
                                                    >
                                                        True
                                                    </div>
                                                </div>
                                            )}
                                        >
                                            <div
                                                tabIndex={-1}
                                                onClick={() => setStatusVisible(!statusVisible)}
                                                className={`hover:outline-primary py-3 px-4 outline-blue outline-1 outline bg-[rgba(141,124,221,0.1)] cursor-pointer ${
                                                    statusVisible
                                                        ? "rounded-tl-lg rounded-tr-lg outline-primary"
                                                        : "rounded-lg"
                                                }   flex justify-between items-center`}
                                            >
                                                {apStatus === false ? "False" : "True"}
                                                <i className={`${statusVisible ? "rotate-180" : ""}`}>
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
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="terminals" className="flex gap-1 mb-1 items-center">
                                            Terminals
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="number"
                                            id="terminals"
                                            {...register("terminals")}
                                            defaultValue={schema.getDefault().terminals}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.terminals?.message}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="capacity" className="flex gap-1 mb-1 items-center">
                                            Capacity
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="number"
                                            id="capacity"
                                            {...register("capacity")}
                                            defaultValue={schema.getDefault().capacity}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.capacity?.message}</span>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="latitude" className="flex gap-1 mb-1 items-center">
                                                Latitude
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="text"
                                                id="latitude"
                                                value={latitude}
                                                onChange={onChangeLatitude}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="longitude" className="flex gap-1 mb-1 items-center">
                                                Longitude
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="text"
                                                id="longitude"
                                                value={longitude}
                                                onChange={onChangeLongitude}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                    type="submit"
                                >
                                    Update airport
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    );
};

export default AirportUpdating;
