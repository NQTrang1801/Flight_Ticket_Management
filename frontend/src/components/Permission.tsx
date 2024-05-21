import axios from "~/utils/axios";
import { useState } from "react";
import usePortal from "react-cool-portal";
import IsRequired from "~/icons/IsRequired";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "~/hook";
import { sendMessage } from "~/actions/message";
import PermissionGiving from "./PermissionGiving";
import { startLoading, stopLoading } from "~/actions/loading";

const schema = yup.object().shape({
    groupCode: yup.string().required("Group code is required.")
});

const Permission: React.FC<{ groupCode: string; groupName: string; _id: string; index: number }> = ({
    _id,
    groupCode,
    groupName,
    index
}) => {
    const [givingPermissionMode, setGivingPermissionMode] = useState(false);

    const { Portal, show, hide } = usePortal({
        defaultShow: false
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            groupCode: groupCode
        }
    });

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<{ groupCode: string }> = async (formData) => {
        dispatch(startLoading());

        const groupCode = formData.groupCode;

        (async () => {
            axios
                .put(
                    `/group/511246413/update/${_id}`,
                    {
                        groupCode
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                        }
                    }
                )
                .then(() => {
                    dispatch(stopLoading());
                    dispatch(sendMessage("Updated sucessfully!", "success"));
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                })
                .catch((error) => {
                    dispatch(stopLoading());
                    dispatch(sendMessage("Updated failed!", "error"));
                    console.error(error);
                });
        })();
    };

    const handleDeletePermission = async (_id: string) => {
        await axios
            .delete(`/permission/511627990/delete/${_id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                }
            })
            .then(() => {
                dispatch(sendMessage("Deleted successfully!", "success"));
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((error) => {
                console.error(error);
                dispatch(sendMessage("Deleted failed!", "error"));
            });
    };

    return (
        <>
            <tr className="text-center">
                <td>{index}</td>
                <td>{groupCode}</td>
                <td>{groupName}</td>
                <td className="text-center w-64">
                    <button
                        onClick={() => {
                            setGivingPermissionMode(!givingPermissionMode);
                        }}
                        className="inline-block hover:bg-primary  mx-1 hover:border-primary rounded-lg border border-blue  items-center justify-center p-1"
                    >
                        <i className="">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 6.35 6.35"
                                id="up-arrow"
                            >
                                <path
                                    fill="white"
                                    d="m 3.1671875,0.5344269 a 0.26460996,0.26460996 0 0 0 -0.179688,0.078125 L 0.60664052,2.9934112 a 0.26460996,0.26460996 0 0 0 0.1875,0.4511719 H 1.8527345 V 5.552005 a 0.26460996,0.26460996 0 0 0 0.263672,0.2636719 h 2.117187 A 0.26460996,0.26460996 0 0 0 4.4992185,5.552005 V 3.4445831 h 1.056641 a 0.26460996,0.26460996 0 0 0 0.1875,-0.4511719 l -2.38086,-2.3808593 a 0.26460996,0.26460996 0 0 0 -0.195312,-0.078125 z m 0.00781,0.6386719 1.744141,1.7421874 h -0.685547 a 0.26460996,0.26460996 0 0 0 -0.263672,0.265625 V 5.28638 h -1.58789 V 3.1809112 a 0.26460996,0.26460996 0 0 0 -0.265625,-0.265625 h -0.683594 z"
                                ></path>
                            </svg>
                        </i>
                    </button>
                    <button
                        onClick={() => {
                            show();
                        }}
                        className="inline-block hover:bg-primary mx-1 hover:border-primary rounded-lg border border-blue items-center justify-center p-1"
                    >
                        <i className="">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width={24}
                                height={24}
                                id="edit"
                            >
                                <path
                                    className="fill-white"
                                    d="M5,18H9.24a1,1,0,0,0,.71-.29l6.92-6.93h0L19.71,8a1,1,0,0,0,0-1.42L15.47,2.29a1,1,0,0,0-1.42,0L11.23,5.12h0L4.29,12.05a1,1,0,0,0-.29.71V17A1,1,0,0,0,5,18ZM14.76,4.41l2.83,2.83L16.17,8.66,13.34,5.83ZM6,13.17l5.93-5.93,2.83,2.83L8.83,16H6ZM21,20H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"
                                ></path>
                            </svg>
                        </i>
                    </button>
                    <button
                        onClick={() => {
                            handleDeletePermission(_id);
                        }}
                        className="hover:bg-mdRed hover:border-mdRed rounded-lg border border-blue items-center justify-center p-1 inline-block mx-1"
                    >
                        <i>
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
                </td>
            </tr>
            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="border border-blue p-8 bg-background relative rounded-xl w-[360px] no-scrollbar">
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
                                <div className="text-white font-semibold text-xl">Update group</div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                                <div className="flex gap-2 flex-col">
                                    <label htmlFor="groupCode" className="flex gap-1 mb-1 items-center">
                                        Group code
                                        <IsRequired />
                                    </label>
                                    <input
                                        type="text"
                                        id="groupCode"
                                        placeholder="Group code . . ."
                                        {...register("groupCode")}
                                        className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                    />
                                    {<span className="text-deepRed">{errors.groupCode?.message}</span>}
                                </div>
                                <button
                                    className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                    type="submit"
                                >
                                    Update
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Portal>
            {givingPermissionMode && <PermissionGiving _id={_id} />}
        </>
    );
};

export default Permission;
