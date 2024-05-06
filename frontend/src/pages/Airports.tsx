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
import Tippy from "@tippyjs/react/headless";
import Airport from "~/components/Airport";

const schema = yup.object().shape({
    name: yup.string().required("Name is required."),
    address: yup.string().required("Address is required."),
    country: yup.string().required("Country is required."),
    code: yup.string().required("Code is required."),
    terminals: yup.number().default(1),
    capacity: yup.number().default(2000)
});

function Airports() {
    const [data, setData] = useState<AirportData[]>();
    const [deletingMode, setDeletingMode] = useState(false);
    const [updatingMode, setUpdatingMode] = useState(false);
    const { Portal, show, hide } = usePortal({
        defaultShow: false
    });
    const [timezone, setTimezone] = useState("GMT+7");
    const [timezoneVisible, setTimezoneVisible] = useState(false);
    const [latitude, setLatitude] = useState(0.0);
    const [longitude, setLongitude] = useState(0.0);

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
        setTimezone(value);
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

    const dispatch = useAppDispatch();
    const [international, setInternational] = useState(false);
    const [internationalVisible, setInternationalVisible] = useState(false);

    const [status, setStatus] = useState(true);
    const [statusVisible, setStatusVisible] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<AirportData>({
        resolver: yupResolver(schema)
    });

    const onSubmit: SubmitHandler<AirportData> = async (data) => {
        hide();
        dispatch(startLoading());
        const name = data.name;
        const country = data.country;
        const code = data.code;
        const terminals = data.terminals;
        const capacity = data.capacity;
        const address = data.address;

        (async () => {
            try {
                await axios.post(
                    "/airport/511454675/create",
                    {
                        name,
                        country,
                        code,
                        terminals,
                        capacity,
                        address,
                        timezone,
                        isInternational: international,
                        coordinates: {
                            type: "Point",
                            coordinates: [latitude, longitude]
                        },
                        status,
                        rule: []
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.token}`
                        }
                    }
                );
                dispatch(stopLoading());
                dispatch(sendMessage("Created successfully!"));
                setTimeout(() => window.location.reload(), 2000);
            } catch (error) {
                dispatch(stopLoading());
                dispatch(sendMessage(`Created failed! ${error.response.data.message}`));
                console.error(error);
            }
        })();
    };

    useEffect(() => {
        (async () => {
            await axios
                .get("/airport/all", { headers: { "Content-Type": "application/json" } })
                .then((response) => {
                    setData(response.data);
                })
                .catch((err) => console.error(err));
        })();
    }, []);

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => {
                            setDeletingMode(false);
                            setUpdatingMode(false);
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
                        onClick={() => {
                            setDeletingMode(false);
                            setUpdatingMode(!updatingMode);
                        }}
                        className={`bg-block hover:bg-primary hover:border-primary  rounded-xl border-blue border ${
                            updatingMode ? "border-primary bg-primary" : ""
                        } flex items-center justify-center p-3 w-[112px]`}
                    >
                        <i className="mr-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width={20}
                                height={20}
                                id="edit"
                            >
                                <g>
                                    <path
                                        fill="white"
                                        d="M19.4 7.34 16.66 4.6A2 2 0 0 0 14 4.53l-9 9a2 2 0 0 0-.57 1.21L4 18.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 20h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71zM9.08 17.62l-3 .28.27-3L12 9.32l2.7 2.7zM16 10.68 13.32 8l1.95-2L18 8.73z"
                                    ></path>
                                </g>
                            </svg>
                        </i>
                        Update
                    </button>
                </div>
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => {
                            setUpdatingMode(false);
                            setDeletingMode(!deletingMode);
                        }}
                        className={`bg-block hover:bg-mdRed hover:border-mdRed  rounded-xl border-blue border ${
                            deletingMode ? "border-mdRed bg-mdRed" : ""
                        } flex items-center justify-center p-3 w-[112px]`}
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
                    <div className="p-6 text-[15px]">Select a row below to delete.</div>
                </div>
            )}
            {updatingMode && (
                <div className="shadow-xl rounded-xl bg-block mb-6">
                    <div className="bg-primary h-6 rounded-tr-xl rounded-tl-xl"></div>
                    <div className="p-6 text-[15px]">Select a row below to update.</div>
                </div>
            )}
            <div className="bg-block p-6 rounded-3xl shadow-xl">
                <table className="w-full bg-block">
                    <thead>
                        <tr className="text-center bg-primary">
                            <th className="">Code</th>
                            <th className="">Name</th>
                            <th className="">Country</th>
                            <th className="">Address</th>
                            <th className="">Timezone</th>
                            <th className="">Terminals</th>
                            <th className="">Capacity</th>
                            <th className="">Coordinates</th>
                            <th className="">International</th>
                            <th className="">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data &&
                            data
                                // ?.filter((actor) => actor.fullName.toLowerCase().includes(query.toLowerCase()))
                                .map((airport) => (
                                    <Airport
                                        _id={airport._id}
                                        code={airport.code}
                                        key={airport.code}
                                        name={airport.name}
                                        country={airport.country}
                                        address={airport.address}
                                        timezone={airport.timezone}
                                        terminals={airport.terminals}
                                        capacity={airport.capacity}
                                        isInternational={airport.isInternational}
                                        coordinates={airport.coordinates}
                                        status={airport.status}
                                        deletingMode={deletingMode}
                                        updatingMode={updatingMode}
                                    />
                                ))}
                    </tbody>
                </table>
            </div>
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
                                <div className="text-white font-semibold text-xl">Create new airport</div>
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
                                                    className={`flex w-[290px] text-white p-2 rounded-bl-lg rounded-br-lg flex-col bg-background outline-1 outline-border outline justify-center ${
                                                        timezoneVisible ? "outline-primary" : ""
                                                    }`}
                                                >
                                                    {timezones.map((tz) => (
                                                        <div
                                                            key={tz}
                                                            onClick={() => handleSelectTimezone(tz)}
                                                            className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                                timezone === tz ? "text-blue pointer-events-none" : ""
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
                                                {timezone}
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
                                                            setStatus(false);
                                                            setStatusVisible(false);
                                                        }}
                                                        className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                            status === false ? "text-blue pointer-events-none" : ""
                                                        }`}
                                                    >
                                                        False
                                                    </div>
                                                    <div
                                                        onClick={() => {
                                                            setStatus(true);
                                                            setStatusVisible(false);
                                                        }}
                                                        className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-lg ${
                                                            status === true ? "text-blue pointer-events-none" : ""
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
                                                {status === false ? "False" : "True"}
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
                                    Create airport
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    );
}

export default Airports;
