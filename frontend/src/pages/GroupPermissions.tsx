import axios from "~/utils/axios";
import { useState, useEffect } from "react";
import usePortal from "react-cool-portal";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsRequired from "~/icons/IsRequired";
import { useAppDispatch, useAppSelector } from "~/hook";
import { sendMessage } from "~/actions/message";
import Permission from "../components/Permission";

const schema = yup.object().shape({
    groupCode: yup.string().required("Group code is required."),
    groupName: yup.string().required("Group name is required.")
});

function GroupPermissions() {
    const [groupPermissionData, setGroupPermissionData] = useState<GroupPermissionData[]>();
    const { query } = useAppSelector((state) => state.searching!);

    const { Portal, hide, show } = usePortal({
        defaultShow: false
    });

    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<GroupPermissionValidation>({
        resolver: yupResolver(schema)
    });

    const onSubmit: SubmitHandler<GroupPermissionValidation> = async (formData) => {
        (async () => {
            const groupName = formData.groupName;
            const groupCode = formData.groupCode;

            try {
                await axios.post(
                    "/group/511454413/create",
                    {
                        groupCode,
                        groupName
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                        }
                    }
                );

                dispatch(sendMessage("Created successfully!", "success"));
                const timer = setTimeout(() => {
                    window.location.reload();
                }, 2000);
                return () => clearTimeout(timer);
            } catch (error) {
                dispatch(sendMessage("Created failed!", "error"));
                console.error(error);
            }
        })();
    };

    useEffect(() => {
        (async () => {
            await axios
                .get("/group/511320413/all", {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                })
                .then((response) => {
                    setGroupPermissionData(response.data);
                })
                .catch((err) => console.error(err));
        })();

        (async () => {
            await axios
                .get("/permission/511320990/all", {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                })
                .then((response) => {
                    console.log(response.data);
                })
                .catch((err) => console.error(err));
        })();
    }, []);

    return (
        <>
            <div className="flex justify-end items-center mb-6">
                <button
                    onClick={() => {
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
            </div>
            <div className="bg-block p-6 rounded-3xl shadow-xl">
                <table className="w-full bg-block">
                    <thead>
                        <tr className="text-center bg-primary">
                            <th className="">Index</th>
                            <th className="">Group code</th>
                            <th className="">Group name</th>
                            <th className="">Function</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupPermissionData &&
                            groupPermissionData
                                ?.filter((group) => group.groupName.toLowerCase().includes(query.toLowerCase()))
                                .map((group, index) => (
                                    <Permission
                                        key={group._id}
                                        _id={group._id}
                                        groupName={group.groupName}
                                        groupCode={group.groupCode}
                                        index={index + 1}
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
                                <div className="text-white font-semibold text-xl">Create new group</div>
                            </div>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex justify-center items-center flex-col gap-6 w-[300px]"
                            >
                                <div className="flex flex-col gap-2 w-full">
                                    <label htmlFor="groupCode" className="flex  items-center gap-1 mb-1">
                                        Group code
                                        <IsRequired />
                                    </label>
                                    <input
                                        id="groupCode"
                                        type="text"
                                        placeholder="Group code . . ."
                                        {...register("groupCode")}
                                        className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1  px-4 py-3 rounded-lg  placeholder:text-disabled"
                                    />
                                    {errors.groupCode && (
                                        <span className="text-deepRed">{errors.groupCode.message}</span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <label htmlFor="groupName" className="flex items-center gap-1 mb-1">
                                        Group name
                                        <IsRequired />
                                    </label>
                                    <input
                                        id="groupName"
                                        type="text"
                                        placeholder="Group name . . ."
                                        {...register("groupName")}
                                        className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1  px-4 py-3 rounded-lg  placeholder:text-disabled"
                                    />
                                    {errors.groupName && (
                                        <span className="text-deepRed">{errors.groupName.message}</span>
                                    )}
                                </div>

                                <button
                                    className="py-3 w-full px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                    type="submit"
                                >
                                    Create group permission
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    );
}

export default GroupPermissions;
