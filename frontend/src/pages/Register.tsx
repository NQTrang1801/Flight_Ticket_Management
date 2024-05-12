import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "~/hook";
import logo from "~/assets/logo.png";
import background from "~/assets/background.jpg";
import { sendMessage } from "~/actions/message";
import axios from "~/utils/axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsRequired from "~/icons/IsRequired";

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

const Register: React.FC = () => {
    const navigate = useNavigate();
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

                dispatch(sendMessage("Signed up successfully!", "success"));
                const timer = setTimeout(() => {
                    navigate("/login");
                    window.location.reload();
                }, 2000);
                return () => clearTimeout(timer);
            } catch (error) {
                dispatch(sendMessage("Signed up failed!", "error"));
                console.error(error);
            }
        })();
    };

    return (
        <div className="w-full min-h-screen grid grid-cols-6">
            <div className="col-span-4 flex flex-col items-center justify-center">
                <div>
                    <img src={background} className="h-screen" />
                </div>
            </div>
            <div className="flex flex-col gap-8 items-center justify-center col-span-2">
                <div className="flex flex-col justify-center items-center text-black">
                    <img src={logo} width={256} height={256} />
                    <div className="text-primary font-semibold text-3xl mt-8 mb-4">Flight Ticket Management</div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-center flex-col gap-6 ">
                    <div className="grid grid-cols-2 gap-4 w-[420px]">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="flex text-black items-center gap-1 mb-1">
                                Full name
                                <IsRequired />
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Your full name . . ."
                                {...register("name")}
                                className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-black px-4 py-3 rounded-lg  placeholder:text-disabled"
                            />
                            {errors.name && <span className="text-deepRed">{errors.name.message}</span>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="phoneNumber" className="flex text-black items-center gap-1 mb-1">
                                Phone number
                                <IsRequired />
                            </label>
                            <input
                                id="phoneNumber"
                                type="number"
                                placeholder="Your phone number . . ."
                                {...register("phoneNumber")}
                                className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-black px-4 py-3 rounded-lg  placeholder:text-disabled"
                            />
                            {errors.phoneNumber && <span className="text-deepRed">{errors.phoneNumber.message}</span>}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="address" className="flex text-black items-center gap-1 mb-1">
                            Address
                            <IsRequired />
                        </label>
                        <input
                            id="address"
                            type="text"
                            placeholder="Your address . . ."
                            {...register("address")}
                            className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-black px-4 py-3 rounded-lg w-[420px] placeholder:text-disabled"
                        />
                        {errors.address && <span className="text-deepRed">{errors.address.message}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="flex text-black items-center gap-1 mb-1">
                            Email
                            <IsRequired />
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Your email . . ."
                            {...register("email")}
                            className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-black px-4 py-3 rounded-lg w-[420px] placeholder:text-disabled"
                        />
                        {errors.email && <span className="text-deepRed">{errors.email.message}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="flex text-black items-center gap-1 mb-1">
                            Password
                            <IsRequired />
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Your password . . ."
                            autoComplete="new-password"
                            {...register("password")}
                            className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-black px-4 py-3 rounded-lg w-[420px] placeholder:text-disabled"
                        />
                        {errors.password && <span className="text-deepRed">{errors.password.message}</span>}
                    </div>
                    <button
                        className="py-3 px-8 mt-4 w-[420px] font-semibold rounded-lg bg-blue border-blue border hover:border-primary hover:bg-primary"
                        type="submit"
                    >
                        Sign up now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
