import axios from "~/utils/axios";
import { useState, useEffect } from "react";
import usePortal from "react-cool-portal";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsRequired from "~/icons/IsRequired";
import { useAppDispatch, useAppSelector } from "~/hook";
import { sendMessage } from "~/actions/message";
import { startLoading, stopLoading } from "~/actions/loading";
import checkPermission from "~/utils/checkPermission";
import AdminUser from "./AdminUser";
import PermissionNotFound from "../common/PermissionNotFound";

const schema = yup.object().shape({
    name: yup.string().required("Name is required."),
    email: yup.string().email("Invalid email address.").required("Email is required."),
    password: yup.string().required("Password is required."),
    phoneNumber: yup
        .number()
        .required("Phone number is required.")
        .typeError("Phone number must be a number.")
        .min(10, "Phone number must be exactly 10 digits"),
    address: yup.string().required("Address is required.")
});

function AdminUsers() {
    const [data, setData] = useState();
    const [groupData, setGroupData] = useState<GroupData[]>();

    const { query } = useAppSelector((state) => state.searching!);

    const { permissions } = useAppSelector((state) => state.permissions!);

    const { Portal, hide } = usePortal({
        defaultShow: false
    });

    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterValidation>({
        resolver: yupResolver(schema)
    });

    const onSubmit: SubmitHandler<RegisterValidation> = async (formData) => {
        (async () => {
            const name = formData.name;
            const phoneNumber = formData.phoneNumber;
            const email = formData.email;
            const password = formData.password;
            const address = formData.address;

            try {
                await axios.post(
                    "/user/register",
                    {
                        fullname: name,
                        mobile: phoneNumber,
                        email,
                        password,
                        address
                    },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                dispatch(sendMessage("Created successfully!", "success"));
                const timer = setTimeout(() => {
                    window.location.reload();
                }, 1000);
                return () => clearTimeout(timer);
            } catch (error) {
                dispatch(sendMessage(`Created failed! ${error.response.data.message}`, "error"));
                console.error(error);
            }
        })();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(startLoading());

                const userResponse = await axios.get("/user/511320447/admin/all-users", {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                });

                setData(userResponse.data);

                const groupResponse = await axios.get("/group/511320413/all", {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                });

                setGroupData(groupResponse.data);

                dispatch(stopLoading());
            } catch (error) {
                console.error(error);
            }
        };
        if (checkPermission(permissions, "511320447") && checkPermission(permissions, "511320413")) fetchData();
    }, [dispatch, permissions]);

    return checkPermission(permissions, "511320447") && checkPermission(permissions, "511320413") ? (
        <>
            {data &&
                Object.entries(data).map(([group, data]) => (
                    <div key={group}>
                        <div className="text-lg font-semibold my-6 capitalize">
                            {group.toLowerCase()} {data.length > 1 ? "Accounts" : "Account"}
                        </div>
                        <div className="bg-block p-6 rounded-3xl shadow-xl">
                            <div className="grid grid-cols-1 gap-8">
                                {data &&
                                    data
                                        ?.filter((data) => data.email.toLowerCase().includes(query.toLowerCase()))
                                        .map((data) => (
                                            <AdminUser
                                                key={data._id}
                                                _id={data._id}
                                                email={data.email}
                                                fullname={data.fullname}
                                                group_name={
                                                    groupData?.find((group) => group._id === data.group_id)?.groupName
                                                }
                                                isBlocked={data.isBlocked}
                                                mobile={data.mobile}
                                                address={data.address}
                                                type={group}
                                            />
                                        ))}
                            </div>
                        </div>
                    </div>
                ))}

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
                                <div className="text-white font-semibold text-xl">Create new account</div>
                            </div>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex justify-center items-center flex-col gap-6 "
                            >
                                <div className="grid grid-cols-2 gap-4 w-[420px]">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="name" className="flex  items-center gap-1 mb-1">
                                            Full name
                                            <IsRequired />
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Full name . . ."
                                            {...register("name")}
                                            className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1  px-4 py-3 rounded-lg  placeholder:text-disabled"
                                        />
                                        {errors.name && <span className="text-deepRed">{errors.name.message}</span>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="phoneNumber" className="flex  items-center gap-1 mb-1">
                                            Phone number
                                            <IsRequired />
                                        </label>
                                        <input
                                            id="phoneNumber"
                                            type="number"
                                            placeholder="Phone number . . ."
                                            {...register("phoneNumber")}
                                            className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1  px-4 py-3 rounded-lg  placeholder:text-disabled"
                                        />
                                        {errors.phoneNumber && (
                                            <span className="text-deepRed">{errors.phoneNumber.message}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="address" className="flex  items-center gap-1 mb-1">
                                        Address
                                        <IsRequired />
                                    </label>
                                    <input
                                        id="address"
                                        type="text"
                                        placeholder="Address . . ."
                                        {...register("address")}
                                        className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1  px-4 py-3 rounded-lg w-[420px] placeholder:text-disabled"
                                    />
                                    {errors.address && <span className="text-deepRed">{errors.address.message}</span>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email" className="flex  items-center gap-1 mb-1">
                                        Email
                                        <IsRequired />
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Email . . ."
                                        {...register("email")}
                                        className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1  px-4 py-3 rounded-lg w-[420px] placeholder:text-disabled"
                                    />
                                    {errors.email && <span className="text-deepRed">{errors.email.message}</span>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="password" className="flex  items-center gap-1 mb-1">
                                        Password
                                        <IsRequired />
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Password . . ."
                                        autoComplete="new-password"
                                        {...register("password")}
                                        className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1  px-4 py-3 rounded-lg w-[420px] placeholder:text-disabled"
                                    />
                                    {errors.password && <span className="text-deepRed">{errors.password.message}</span>}
                                </div>
                                <button
                                    className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                    type="submit"
                                >
                                    Create account
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    ) : (
        <PermissionNotFound />
    );
}

export default AdminUsers;
