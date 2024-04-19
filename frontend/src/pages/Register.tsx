import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "~/actions/auth";
import { useAppDispatch } from "~/hook";
import logo from "~/assets/logo_removebg.png";
import { toast } from "react-toastify";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";
import axios from "~/utils/axios";

interface LoginFormValues {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
}

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const dispatch = useAppDispatch();

    const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
    };
    const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
    };
    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
    };
    const onChangePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhoneNumber(value);
    };
    const onChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAddress(value);
    };

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormValues>();

    const onSubmit: SubmitHandler<LoginFormValues> = async () => {
        dispatch(startLoading());

        (async () => {
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
                dispatch(stopLoading());
                dispatch(sendMessage("Created successfully!"));
                const timer = setTimeout(() => {
                    navigate("/login");
                    window.location.reload();
                }, 2000);
                return () => clearTimeout(timer);
            } catch (error) {
                dispatch(stopLoading());
                dispatch(sendMessage("Created failed!"));
                console.error(error);
            }
        })();
    };

    // if (isLoggedIn) {
    //     return <Navigate to="/" />;
    // }

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-[url('~/assets/background.jpg')] bg-cover">
            <div className=" bg-[rgba(255,255,255,0.9)] shadow-md p-6 w-[480px] rounded-3xl flex justify-center flex-col items-center">
                <div className="flex flex-col justify-center items-center gap-8 mb-8">
                    <img src={logo} width={164} height={164} alt="logo" />
                    <div className="text-blue text-3xl font-semibold">Welcome back</div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-center flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="flex text-black items-center gap-1 mb-1">
                            Full name
                            <i className="">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="8"
                                    height="8"
                                    viewBox="0 0 48 48"
                                    id="asterisk"
                                >
                                    <path
                                        className="fill-[#ff0000]"
                                        d="M42.588 20.196c-1.53.882-6.24 2.715-10.554 3.804 4.314 1.089 9.024 2.922 10.557 3.804A6.003 6.003 0 0 1 44.784 36a5.996 5.996 0 0 1-8.193 2.196c-1.533-.885-5.475-4.053-8.574-7.245C29.232 35.235 30 40.233 30 42c0 3.312-2.688 6-6 6s-6-2.688-6-6c0-1.767.768-6.765 1.986-11.049-3.099 3.192-7.041 6.36-8.574 7.245-2.871 1.656-6.54.675-8.196-2.196s-.675-6.54 2.196-8.196c1.53-.882 6.24-2.715 10.557-3.804-4.317-1.089-9.027-2.922-10.557-3.804C2.541 18.54 1.56 14.871 3.216 12s5.325-3.852 8.196-2.196c1.533.885 5.475 4.053 8.574 7.245C18.768 12.765 18 7.767 18 6c0-3.312 2.688-6 6-6s6 2.688 6 6c0 1.767-.768 6.765-1.986 11.049 3.099-3.192 7.044-6.36 8.574-7.245A5.995 5.995 0 0 1 44.781 12a5.998 5.998 0 0 1-2.193 8.196z"
                                    ></path>
                                </svg>
                            </i>
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Your full name . . ."
                            {...register("name", {
                                required: "Full name is required."
                            })}
                            className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-black px-4 py-3 rounded-lg w-[360px] placeholder:text-disabled"
                            value={name}
                            onChange={onChangeName}
                        />
                        {errors.name && <span className="text-[#ff0000]">{errors.name.message}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="phoneNumber" className="flex text-black items-center gap-1 mb-1">
                            Phone number
                            <i className="">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="8"
                                    height="8"
                                    viewBox="0 0 48 48"
                                    id="asterisk"
                                >
                                    <path
                                        className="fill-[#ff0000]"
                                        d="M42.588 20.196c-1.53.882-6.24 2.715-10.554 3.804 4.314 1.089 9.024 2.922 10.557 3.804A6.003 6.003 0 0 1 44.784 36a5.996 5.996 0 0 1-8.193 2.196c-1.533-.885-5.475-4.053-8.574-7.245C29.232 35.235 30 40.233 30 42c0 3.312-2.688 6-6 6s-6-2.688-6-6c0-1.767.768-6.765 1.986-11.049-3.099 3.192-7.041 6.36-8.574 7.245-2.871 1.656-6.54.675-8.196-2.196s-.675-6.54 2.196-8.196c1.53-.882 6.24-2.715 10.557-3.804-4.317-1.089-9.027-2.922-10.557-3.804C2.541 18.54 1.56 14.871 3.216 12s5.325-3.852 8.196-2.196c1.533.885 5.475 4.053 8.574 7.245C18.768 12.765 18 7.767 18 6c0-3.312 2.688-6 6-6s6 2.688 6 6c0 1.767-.768 6.765-1.986 11.049 3.099-3.192 7.044-6.36 8.574-7.245A5.995 5.995 0 0 1 44.781 12a5.998 5.998 0 0 1-2.193 8.196z"
                                    ></path>
                                </svg>
                            </i>
                        </label>
                        <input
                            id="phoneNumber"
                            type="number"
                            placeholder="Your phone number . . ."
                            {...register("phoneNumber", {
                                required: "Phone number is required."
                            })}
                            className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-black px-4 py-3 rounded-lg w-[360px] placeholder:text-disabled"
                            value={phoneNumber}
                            onChange={onChangePhoneNumber}
                        />
                        {errors.phoneNumber && <span className="text-[#ff0000]">{errors.phoneNumber.message}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="addresss" className="flex text-black items-center gap-1 mb-1">
                            Address
                            <i className="">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="8"
                                    height="8"
                                    viewBox="0 0 48 48"
                                    id="asterisk"
                                >
                                    <path
                                        className="fill-[#ff0000]"
                                        d="M42.588 20.196c-1.53.882-6.24 2.715-10.554 3.804 4.314 1.089 9.024 2.922 10.557 3.804A6.003 6.003 0 0 1 44.784 36a5.996 5.996 0 0 1-8.193 2.196c-1.533-.885-5.475-4.053-8.574-7.245C29.232 35.235 30 40.233 30 42c0 3.312-2.688 6-6 6s-6-2.688-6-6c0-1.767.768-6.765 1.986-11.049-3.099 3.192-7.041 6.36-8.574 7.245-2.871 1.656-6.54.675-8.196-2.196s-.675-6.54 2.196-8.196c1.53-.882 6.24-2.715 10.557-3.804-4.317-1.089-9.027-2.922-10.557-3.804C2.541 18.54 1.56 14.871 3.216 12s5.325-3.852 8.196-2.196c1.533.885 5.475 4.053 8.574 7.245C18.768 12.765 18 7.767 18 6c0-3.312 2.688-6 6-6s6 2.688 6 6c0 1.767-.768 6.765-1.986 11.049 3.099-3.192 7.044-6.36 8.574-7.245A5.995 5.995 0 0 1 44.781 12a5.998 5.998 0 0 1-2.193 8.196z"
                                    ></path>
                                </svg>
                            </i>
                        </label>
                        <input
                            id="address"
                            type="text"
                            placeholder="Your address . . ."
                            {...register("address", {
                                required: "Address is required."
                            })}
                            className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-black px-4 py-3 rounded-lg w-[360px] placeholder:text-disabled"
                            value={address}
                            onChange={onChangeAddress}
                        />
                        {errors.address && <span className="text-[#ff0000]">{errors.address.message}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="flex text-black items-center gap-1 mb-1">
                            Email
                            <i className="">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="8"
                                    height="8"
                                    viewBox="0 0 48 48"
                                    id="asterisk"
                                >
                                    <path
                                        className="fill-[#ff0000]"
                                        d="M42.588 20.196c-1.53.882-6.24 2.715-10.554 3.804 4.314 1.089 9.024 2.922 10.557 3.804A6.003 6.003 0 0 1 44.784 36a5.996 5.996 0 0 1-8.193 2.196c-1.533-.885-5.475-4.053-8.574-7.245C29.232 35.235 30 40.233 30 42c0 3.312-2.688 6-6 6s-6-2.688-6-6c0-1.767.768-6.765 1.986-11.049-3.099 3.192-7.041 6.36-8.574 7.245-2.871 1.656-6.54.675-8.196-2.196s-.675-6.54 2.196-8.196c1.53-.882 6.24-2.715 10.557-3.804-4.317-1.089-9.027-2.922-10.557-3.804C2.541 18.54 1.56 14.871 3.216 12s5.325-3.852 8.196-2.196c1.533.885 5.475 4.053 8.574 7.245C18.768 12.765 18 7.767 18 6c0-3.312 2.688-6 6-6s6 2.688 6 6c0 1.767-.768 6.765-1.986 11.049 3.099-3.192 7.044-6.36 8.574-7.245A5.995 5.995 0 0 1 44.781 12a5.998 5.998 0 0 1-2.193 8.196z"
                                    ></path>
                                </svg>
                            </i>
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Your email . . ."
                            {...register("email", {
                                required: "Email is required.",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address."
                                }
                            })}
                            className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-black px-4 py-3 rounded-lg w-[360px] placeholder:text-disabled"
                            value={email}
                            onChange={onChangeEmail}
                        />
                        {errors.email && <span className="text-[#ff0000]">{errors.email.message}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="flex text-black items-center gap-1 mb-1">
                            Password
                            <i className="">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="8"
                                    height="8"
                                    viewBox="0 0 48 48"
                                    id="asterisk"
                                >
                                    <path
                                        className="fill-[#ff0000]"
                                        d="M42.588 20.196c-1.53.882-6.24 2.715-10.554 3.804 4.314 1.089 9.024 2.922 10.557 3.804A6.003 6.003 0 0 1 44.784 36a5.996 5.996 0 0 1-8.193 2.196c-1.533-.885-5.475-4.053-8.574-7.245C29.232 35.235 30 40.233 30 42c0 3.312-2.688 6-6 6s-6-2.688-6-6c0-1.767.768-6.765 1.986-11.049-3.099 3.192-7.041 6.36-8.574 7.245-2.871 1.656-6.54.675-8.196-2.196s-.675-6.54 2.196-8.196c1.53-.882 6.24-2.715 10.557-3.804-4.317-1.089-9.027-2.922-10.557-3.804C2.541 18.54 1.56 14.871 3.216 12s5.325-3.852 8.196-2.196c1.533.885 5.475 4.053 8.574 7.245C18.768 12.765 18 7.767 18 6c0-3.312 2.688-6 6-6s6 2.688 6 6c0 1.767-.768 6.765-1.986 11.049 3.099-3.192 7.044-6.36 8.574-7.245A5.995 5.995 0 0 1 44.781 12a5.998 5.998 0 0 1-2.193 8.196z"
                                    ></path>
                                </svg>
                            </i>
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Your password . . ."
                            {...register("password", {
                                required: "Password is required.",
                                minLength: {
                                    value: 5,
                                    message: "Password must be at least 6 characters."
                                }
                            })}
                            className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-black px-4 py-3 rounded-lg w-[360px] placeholder:text-disabled"
                            value={password}
                            onChange={onChangePassword}
                        />
                        {errors.password && <span className="text-[#ff0000]">{errors.password.message}</span>}
                    </div>
                    <button
                        className="py-3 px-8 mt-4 font-semibold rounded-lg bg-blue border-blue border hover:border-primary hover:bg-primary"
                        type="submit"
                    >
                        Sign up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
