import { useState, useEffect } from "react";
import usePortal from "react-cool-portal";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "~/utils/axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsRequired from "~/icons/IsRequired";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";
import { useParams } from "react-router-dom";
import GroupDeleting from "~/components/GroupDeleting";
import PermissionGiving from "~/components/PermissionGiving";

const schema = yup.object().shape({
    groupCode: yup.string().required("Group code is required.")
});

function PermissionGroup() {
    const [groupData, setGroupData] = useState<GroupData>();
    const [permissionData, setPermissionData] = useState<PermissionData[]>();
    const [deletingMode, setDeletingMode] = useState(false);
    const [givingPermissionMode, setGivingPermissionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState(Array<string>);

    const { id } = useParams();

    const dispatch = useAppDispatch();

    const { Portal, show, hide } = usePortal({
        defaultShow: false
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            groupCode: ""
        }
    });

    const onSubmit: SubmitHandler<{ groupCode: string }> = async (formData) => {
        dispatch(startLoading());

        const groupCode = formData.groupCode;

        (async () => {
            axios
                .put(
                    `/group/511246413/update/${id}`,
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

    const handleDeletePermissions = async () => {
        hide();
        dispatch(startLoading());
        await axios
            .delete(`/permission/511627990/delete`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                },
                data: {
                    ids: selectedIds
                }
            })
            .then(() => {
                dispatch(stopLoading());
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(startLoading());

                const groupResponse = await axios.get(`/group/511320413/${id}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                });

                setGroupData(groupResponse.data);
                setValue("groupCode", groupResponse.data.groupCode);

                const permissionResponse = await axios.get("/permission/511320990/all", {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                });
                setPermissionData(permissionResponse.data[groupResponse.data.groupCode]);

                console.log(permissionResponse.data[groupResponse.data.groupCode]);

                dispatch(stopLoading());
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [dispatch, id, setValue]);

    return (
        <>
            {groupData && (
                <>
                    {groupData.groupCode !== "000" &&
                        groupData.groupCode !== "999" &&
                        groupData.groupCode !== "511" && (
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            show();
                                        }}
                                        className="rounded-xl bg-block border-blue border hover:border-primary hover:bg-primary flex items-center justify-center p-3 "
                                    >
                                        <i className="mr-[3px]">
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
                                        Update group
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDeletingMode(!deletingMode);
                                        }}
                                        className="hover:bg-mdRed hover:border-mdRed bg-block rounded-xl border border-blue flex items-center justify-center p-3"
                                    >
                                        <i className="mr-[3px]">
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
                                        Delete group
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setGivingPermissionMode(!givingPermissionMode);
                                        }}
                                        className="rounded-xl bg-block border-blue border hover:border-primary hover:bg-primary flex items-center justify-center p-3 "
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
                                                width={24}
                                                height={24}
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
                                        Give permission
                                    </button>
                                    {selectedIds.length > 0 && (
                                        <button
                                            onClick={() => {
                                                handleDeletePermissions();
                                            }}
                                            className="hover:bg-mdRed hover:border-mdRed bg-block rounded-xl border border-blue flex items-center justify-center p-3"
                                        >
                                            <i className="mr-[3px]">
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
                                            Delete permissions
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                    <div className="bg-block p-6 rounded-3xl shadow-xl flex flex-col gap-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <span className="font-semibold">Group code</span>: {groupData.groupCode}
                            </div>
                            <div>
                                <span className="font-semibold">Group name</span>: {groupData.groupName}
                            </div>
                        </div>

                        <span className="font-semibold">Functionalities:</span>

                        <table className="w-full bg-block">
                            <thead>
                                <tr className="text-center bg-primary">
                                    <th>Index</th>
                                    <th>Functionality code</th>
                                    <th>Functionality name</th>
                                    <th>Displayed screen</th>
                                    {groupData.groupCode !== "000" &&
                                        groupData.groupCode !== "999" &&
                                        groupData.groupCode !== "511" && <th>Selected</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {permissionData?.map((permission, index) => (
                                    <tr key={permission._id} className="text-center">
                                        <td>{index + 1}</td>
                                        <td>{permission.functionalityCode}</td>
                                        <td>{permission.functionalityName}</td>
                                        <td>{permission.screenNameToLoad}</td>

                                        {groupData.groupCode !== "000" &&
                                            groupData.groupCode !== "999" &&
                                            groupData.groupCode !== "511" && (
                                                <td className="text-center">
                                                    <button
                                                        onClick={() => {
                                                            if (selectedIds.includes(permission._id)) {
                                                                const newArr = selectedIds.filter(
                                                                    (id) => id !== permission._id
                                                                );
                                                                setSelectedIds(newArr);
                                                            } else setSelectedIds([...selectedIds, permission._id]);
                                                        }}
                                                        className="hover:border-primary inline-block bg-block rounded-lg border border-blue items-center justify-center p-1"
                                                    >
                                                        <i>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 256 256"
                                                                width={20}
                                                                height={20}
                                                                id="check"
                                                            >
                                                                {selectedIds.includes(permission._id) && (
                                                                    <>
                                                                        <rect
                                                                            width="256"
                                                                            height="256"
                                                                            fill="none"
                                                                        ></rect>
                                                                        <polyline
                                                                            fill="none"
                                                                            stroke="#000"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="24"
                                                                            className="stroke-white"
                                                                            points="216 72.005 104 184 48 128.005"
                                                                        ></polyline>
                                                                    </>
                                                                )}
                                                            </svg>
                                                        </i>
                                                    </button>
                                                </td>
                                            )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {deletingMode && <GroupDeleting _id={groupData?._id} groupName={groupData?.groupName} />}
            {givingPermissionMode && <PermissionGiving _id={groupData?._id} />}

            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="border border-blue p-8 bg-background relative rounded-xl w-[320px] no-scrollbar">
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
                                <div className="text-white font-semibold text-xl">Update group code</div>
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
        </>
    );
}

export default PermissionGroup;
