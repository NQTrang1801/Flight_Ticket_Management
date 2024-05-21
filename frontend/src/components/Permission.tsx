import axios from "~/utils/axios";
import { useState, useEffect } from "react";
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

    return (
        <>
            <tr className="text-center">
                <td>{index}</td>
                <td>{groupCode}</td>
                <td>{groupName}</td>
                <td>{}</td>
            </tr>
            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="border border-blue p-8 bg-background relative rounded-xl w-[500px] no-scrollbar">
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
                                    Update rule
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
