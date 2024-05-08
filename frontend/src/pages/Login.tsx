import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "~/actions/auth";
import { useAppDispatch } from "~/hook";
import { sendMessage } from "~/actions/message";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsRequired from "~/icons/IsRequired";
import logo from "~/assets/logo.png";
import background from "~/assets/background.jpg";

const schema = yup.object().shape({
    email: yup.string().email("Invalid email address.").required("Email is required."),
    password: yup.string().required("Password is required.")
});

const Login: React.FC = () => {
    const navigate = useNavigate();

    const userType = window.location.pathname.slice(1, -6);
    const [visible, setVisible] = useState(false);

    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<{ email: string; password: string }>({
        resolver: yupResolver(schema)
    });

    const onSubmit: SubmitHandler<{ email: string; password: string }> = (formData) => {
        const email = formData.email;
        const password = formData.password;

        dispatch(login(email, password, userType + "-"))
            .then(() => {
                dispatch(sendMessage("Logged in successfully!"));
                const timer = setTimeout(() => {
                    navigate(`/${userType}`);
                    window.location.reload();
                }, 2000);
                return () => clearTimeout(timer);
            })
            .catch((error) => {
                dispatch(sendMessage("The email address or password is incorrect!"));
                console.error(error);
            });

        navigate("/");
    };

    // if (isLoggedIn) {
    //     return <Navigate to="/" />;
    // }

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
                    <div className="capitalize text-xl font-medium text-blue">
                        {userType ? userType + " site" : "Welcome back"}
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-center flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="flex text-black items-center gap-1 mb-1">
                            Email address
                            <IsRequired />
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Your email address . . ."
                            {...register("email")}
                            className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-black px-4 py-3 rounded-lg w-[360px] placeholder:text-disabled"
                        />
                        {errors.email && <span className="text-deepRed">{errors.email.message}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="flex text-black items-center gap-1 mb-1">
                            Password
                            <IsRequired />
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                autoComplete="new-password"
                                type={visible === false ? "password" : "text"}
                                placeholder="Your password . . ."
                                {...register("password")}
                                className="bg-placeholder focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-black px-4 py-3 rounded-lg w-[360px] placeholder:text-disabled"
                            />
                            <button
                                type="button"
                                className="absolute top-2 right-4"
                                onClick={() => setVisible(!visible)}
                            >
                                <i className="">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="28"
                                        height="28"
                                        fill="none"
                                        viewBox="0 0 32 32"
                                        id="eye"
                                        className={visible ? "rotate-180" : ""}
                                    >
                                        <path
                                            className="fill-disabled"
                                            d="M3.50386 12.1317C3.98316 11.8579 4.59368 12.0242 4.86787 12.5032L4.87304 12.512C4.87846 12.5212 4.8877 12.5367 4.90076 12.5581 4.92688 12.601 4.96822 12.6674 5.02477 12.754 5.13794 12.9273 5.31156 13.1807 5.54543 13.4877 6.01412 14.1028 6.71931 14.9256 7.6585 15.7474 9.537 17.3911 12.3124 19 16 19 19.6877 19 22.463 17.3911 24.3415 15.7474 25.2807 14.9256 25.9859 14.1028 26.4546 13.4877 26.6884 13.1807 26.8621 12.9273 26.9752 12.754 27.0318 12.6674 27.0731 12.601 27.0992 12.5581 27.1123 12.5367 27.1215 12.5212 27.127 12.512L27.1318 12.5038 27.1326 12.5024C27.4071 12.0241 28.0172 11.858 28.4961 12.1317 28.9757 12.4058 29.1423 13.0166 28.8682 13.4961L28 13C28.8682 13.4961 28.8685 13.4957 28.8682 13.4961L28.8672 13.4979 28.8658 13.5003 28.8619 13.5071 28.8496 13.5281C28.8394 13.5454 28.8252 13.5692 28.807 13.5991 28.7706 13.6588 28.7182 13.7427 28.6498 13.8476 28.5129 14.0571 28.3116 14.3505 28.0454 14.6998 27.5141 15.3971 26.7193 16.3244 25.6585 17.2526 23.537 19.1089 20.3124 21 16 21 11.6877 21 8.463 19.1089 6.3415 17.2526 5.28069 16.3244 4.48588 15.3971 3.95457 14.6998 3.68844 14.3505 3.48706 14.0571 3.35023 13.8476 3.28178 13.7427 3.22937 13.6588 3.19299 13.5991 3.1748 13.5692 3.1606 13.5454 3.1504 13.5281L3.13809 13.5071 3.13417 13.5003 3.13278 13.4979 3.13222 13.4969C3.13198 13.4965 3.13176 13.4961 4 13L3.13222 13.4969C2.85821 13.0174 3.02434 12.4058 3.50386 12.1317zM6.70711 20.7071L4.70711 22.7071C4.31658 23.0976 3.68342 23.0976 3.29289 22.7071 2.90237 22.3166 2.90237 21.6834 3.29289 21.2929L5.29289 19.2929C5.68342 18.9024 6.31658 18.9024 6.70711 19.2929 7.09763 19.6834 7.09763 20.3166 6.70711 20.7071zM27.2929 22.7071L25.2929 20.7071C24.9024 20.3166 24.9024 19.6834 25.2929 19.2929 25.6834 18.9024 26.3166 18.9024 26.7071 19.2929L28.7071 21.2929C29.0976 21.6834 29.0976 22.3166 28.7071 22.7071 28.3166 23.0976 27.6834 23.0976 27.2929 22.7071zM10.4285 25.3714C10.2234 25.8841 9.64141 26.1336 9.12863 25.9285 8.61584 25.7234 8.36641 25.1414 8.57152 24.6286L9.57146 22.1286C9.77657 21.6158 10.3585 21.3664 10.8713 21.5715 11.3841 21.7766 11.6335 22.3586 11.4284 22.8714L10.4285 25.3714zM22.8714 25.9285C22.3586 26.1336 21.7766 25.8841 21.5715 25.3714L20.5716 22.8714C20.3665 22.3586 20.6159 21.7766 21.1287 21.5715 21.6415 21.3664 22.2234 21.6158 22.4285 22.1286L23.4285 24.6286C23.6336 25.1414 23.3842 25.7234 22.8714 25.9285zM17 26C17 26.5523 16.5523 27 16 27 15.4477 27 15 26.5523 15 26V23.5C15 22.9477 15.4477 22.5 16 22.5 16.5523 22.5 17 22.9477 17 23.5V26z"
                                        ></path>
                                    </svg>
                                </i>
                            </button>
                        </div>
                        {errors.password && <span className="text-deepRed">{errors.password.message}</span>}
                        {!userType && (
                            <a href="/forgot-password" className="text-blue hover:text-primary underline text-end">
                                Forgot password?
                            </a>
                        )}
                    </div>
                    <button
                        className={`py-3 w-[360px] px-8 ${
                            userType ? "mt-6" : ""
                        } font-semibold rounded-lg bg-blue border-blue border hover:border-primary hover:bg-primary`}
                        type="submit"
                    >
                        Login now
                    </button>
                    <div className="text-black">Or</div>
                    <div className="text-black">
                        {!userType && (
                            <>
                                Are you new?{" "}
                                <a href="/register" className="text-blue hover:text-primary underline text-end">
                                    Create an account.
                                </a>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
