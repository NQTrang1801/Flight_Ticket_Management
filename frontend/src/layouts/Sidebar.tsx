import { NavLink } from "react-router-dom";
import logo from "~/assets/logo.png";

function Sidebar() {
    const userType = JSON.parse(localStorage.getItem("user")!)?.userType.toLowerCase();

    return (
        <div className="w-[240px] bg-background z-20 fixed top-0 bottom-0 flex flex-col pb-10 pt-6 border-r-[1px] border-r-solid border-r-border px-5">
            <div className="flex items-center justify-center">
                <img src={logo} className="w-64 mb-8" alt="logo" />
            </div>
            {userType !== "user" && <p className="pl-4 pb-3 text-blue capitalize">{userType} site</p>}
            <div className="flex flex-col pb-[32px] gap-2">
                {userType !== "user" && (
                    <NavLink
                        to={`${userType}`}
                        end
                        className="flex items-center group text-disabled hover:text-white rounded-xl py-3 px-4"
                    >
                        {({ isActive }) => (
                            <>
                                <i className="flex flex-start mr-2 w-[26px] items-center h-[26px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="26"
                                        height="26"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        id="activity"
                                    >
                                        <path
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M17.6734 9.47316C17.8558 9.10127 17.7022 8.65193 17.3303 8.46951C16.9584 8.28709 16.5091 8.44068 16.3266 8.81256L14.8663 11.7896C14.4137 12.7124 13.0833 12.6673 12.6942 11.716C11.815 9.56698 8.80955 9.46517 7.78698 11.5498L6.32665 14.5268C6.14423 14.8987 6.29782 15.3481 6.6697 15.5305C7.04158 15.7129 7.49093 15.5593 7.67335 15.1874L9.13369 12.2104C9.58632 11.2876 10.9167 11.3327 11.3058 12.284C12.185 14.433 15.1904 14.5348 16.213 12.4502L17.6734 9.47316Z"
                                        ></path>
                                        <path
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            fillRule="evenodd"
                                            d="M16.4635 2.37373C15.3214 2.24999 13.8818 2.24999 12.0452 2.25H11.9548C10.1182 2.24999 8.67861 2.24999 7.53648 2.37373C6.37094 2.50001 5.42656 2.76232 4.62024 3.34815C4.13209 3.70281 3.70281 4.13209 3.34815 4.62024C2.76232 5.42656 2.50001 6.37094 2.37373 7.53648C2.24999 8.67861 2.24999 10.1182 2.25 11.9548V12.0452C2.24999 13.8818 2.24999 15.3214 2.37373 16.4635C2.50001 17.6291 2.76232 18.5734 3.34815 19.3798C3.70281 19.8679 4.13209 20.2972 4.62024 20.6518C5.42656 21.2377 6.37094 21.5 7.53648 21.6263C8.67859 21.75 10.1182 21.75 11.9547 21.75H12.0453C13.8818 21.75 15.3214 21.75 16.4635 21.6263C17.6291 21.5 18.5734 21.2377 19.3798 20.6518C19.8679 20.2972 20.2972 19.8679 20.6518 19.3798C21.2377 18.5734 21.5 17.6291 21.6263 16.4635C21.75 15.3214 21.75 13.8818 21.75 12.0453V11.9547C21.75 10.1182 21.75 8.67859 21.6263 7.53648C21.5 6.37094 21.2377 5.42656 20.6518 4.62024C20.2972 4.13209 19.8679 3.70281 19.3798 3.34815C18.5734 2.76232 17.6291 2.50001 16.4635 2.37373ZM5.50191 4.56168C6.00992 4.19259 6.66013 3.97745 7.69804 3.865C8.74999 3.75103 10.1084 3.75 12 3.75C13.8916 3.75 15.25 3.75103 16.302 3.865C17.3399 3.97745 17.9901 4.19259 18.4981 4.56168C18.8589 4.82382 19.1762 5.14111 19.4383 5.50191C19.8074 6.00992 20.0225 6.66013 20.135 7.69804C20.249 8.74999 20.25 10.1084 20.25 12C20.25 13.8916 20.249 15.25 20.135 16.302C20.0225 17.3399 19.8074 17.9901 19.4383 18.4981C19.1762 18.8589 18.8589 19.1762 18.4981 19.4383C17.9901 19.8074 17.3399 20.0225 16.302 20.135C15.25 20.249 13.8916 20.25 12 20.25C10.1084 20.25 8.74999 20.249 7.69804 20.135C6.66013 20.0225 6.00992 19.8074 5.50191 19.4383C5.14111 19.1762 4.82382 18.8589 4.56168 18.4981C4.19259 17.9901 3.97745 17.3399 3.865 16.302C3.75103 15.25 3.75 13.8916 3.75 12C3.75 10.1084 3.75103 8.74999 3.865 7.69804C3.97745 6.66013 4.19259 6.00992 4.56168 5.50191C4.82382 5.14111 5.14111 4.82382 5.50191 4.56168Z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </i>
                                Dashboard
                            </>
                        )}
                    </NavLink>
                )}
                {userType !== "user" && (
                    <NavLink
                        to={`${userType}/flight-schedule`}
                        className="flex items-center group text-disabled hover:text-white rounded-xl py-3 px-4"
                    >
                        {({ isActive }) => (
                            <>
                                <i className="flex flex-start mr-2 w-[26px] items-center h-[26px] justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        data-name="Layer 1"
                                        viewBox="0 0 64 64"
                                        width={26}
                                        height={26}
                                        id="schedule"
                                    >
                                        <path
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M50 24H10a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2h40a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2zm-38-4h36v-6H12z"
                                        ></path>
                                        <path
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M42 18a2 2 0 0 1-2-2V8a2 2 0 0 1 4 0v8a2 2 0 0 1-2 2zm-24 0a2 2 0 0 1-2-2V8a2 2 0 0 1 4 0v8a2 2 0 0 1-2 2z"
                                        ></path>
                                        <path
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M32 54H14a6 6 0 0 1-6-6V12a2 2 0 0 1 2-2h40a2 2 0 0 1 2 2v22a2 2 0 0 1-4 0V14H12v34a2 2 0 0 0 2 2h18a2 2 0 0 1 0 4z"
                                        ></path>
                                        <path
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M42 58a14 14 0 1 1 14-14 14 14 0 0 1-14 14zm0-24a10 10 0 1 0 10 10 10 10 0 0 0-10-10z"
                                        ></path>
                                        <path
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M48 46h-6a2 2 0 0 1-2-2v-8h4v6h4z"
                                        ></path>
                                    </svg>
                                </i>
                                Flight schedule
                            </>
                        )}
                    </NavLink>
                )}
                {userType !== "user" ? (
                    <NavLink
                        to={`${userType}/booking-forms`}
                        className="flex items-center group text-disabled hover:text-white rounded-xl py-3 px-4"
                    >
                        {({ isActive }) => (
                            <>
                                <i className="flex flex-start mr-2 w-[26px] items-center h-[26px] justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22"
                                        height="22"
                                        viewBox="0 0 32 32"
                                        id="list"
                                    >
                                        <path
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M30 2H4a2 2 0 0 0-2 2v26a2 2 0 0 0 2 2h26a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 28H4V4h26v26zM9 18h16a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2zm0-6h16a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2zm0 12h16a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2z"
                                        ></path>
                                    </svg>
                                </i>
                                Booking forms
                            </>
                        )}
                    </NavLink>
                ) : (
                    <NavLink
                        to={`${userType}`}
                        end
                        className="flex items-center group text-disabled hover:text-white rounded-xl py-3 px-4"
                    >
                        {({ isActive }) => (
                            <>
                                <i className="flex flex-start mr-2 w-[26px] items-center h-[26px] justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="26"
                                        height="26"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        id="activity"
                                    >
                                        <path
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M17.6734 9.47316C17.8558 9.10127 17.7022 8.65193 17.3303 8.46951C16.9584 8.28709 16.5091 8.44068 16.3266 8.81256L14.8663 11.7896C14.4137 12.7124 13.0833 12.6673 12.6942 11.716C11.815 9.56698 8.80955 9.46517 7.78698 11.5498L6.32665 14.5268C6.14423 14.8987 6.29782 15.3481 6.6697 15.5305C7.04158 15.7129 7.49093 15.5593 7.67335 15.1874L9.13369 12.2104C9.58632 11.2876 10.9167 11.3327 11.3058 12.284C12.185 14.433 15.1904 14.5348 16.213 12.4502L17.6734 9.47316Z"
                                        ></path>
                                        <path
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            fillRule="evenodd"
                                            d="M16.4635 2.37373C15.3214 2.24999 13.8818 2.24999 12.0452 2.25H11.9548C10.1182 2.24999 8.67861 2.24999 7.53648 2.37373C6.37094 2.50001 5.42656 2.76232 4.62024 3.34815C4.13209 3.70281 3.70281 4.13209 3.34815 4.62024C2.76232 5.42656 2.50001 6.37094 2.37373 7.53648C2.24999 8.67861 2.24999 10.1182 2.25 11.9548V12.0452C2.24999 13.8818 2.24999 15.3214 2.37373 16.4635C2.50001 17.6291 2.76232 18.5734 3.34815 19.3798C3.70281 19.8679 4.13209 20.2972 4.62024 20.6518C5.42656 21.2377 6.37094 21.5 7.53648 21.6263C8.67859 21.75 10.1182 21.75 11.9547 21.75H12.0453C13.8818 21.75 15.3214 21.75 16.4635 21.6263C17.6291 21.5 18.5734 21.2377 19.3798 20.6518C19.8679 20.2972 20.2972 19.8679 20.6518 19.3798C21.2377 18.5734 21.5 17.6291 21.6263 16.4635C21.75 15.3214 21.75 13.8818 21.75 12.0453V11.9547C21.75 10.1182 21.75 8.67859 21.6263 7.53648C21.5 6.37094 21.2377 5.42656 20.6518 4.62024C20.2972 4.13209 19.8679 3.70281 19.3798 3.34815C18.5734 2.76232 17.6291 2.50001 16.4635 2.37373ZM5.50191 4.56168C6.00992 4.19259 6.66013 3.97745 7.69804 3.865C8.74999 3.75103 10.1084 3.75 12 3.75C13.8916 3.75 15.25 3.75103 16.302 3.865C17.3399 3.97745 17.9901 4.19259 18.4981 4.56168C18.8589 4.82382 19.1762 5.14111 19.4383 5.50191C19.8074 6.00992 20.0225 6.66013 20.135 7.69804C20.249 8.74999 20.25 10.1084 20.25 12C20.25 13.8916 20.249 15.25 20.135 16.302C20.0225 17.3399 19.8074 17.9901 19.4383 18.4981C19.1762 18.8589 18.8589 19.1762 18.4981 19.4383C17.9901 19.8074 17.3399 20.0225 16.302 20.135C15.25 20.249 13.8916 20.25 12 20.25C10.1084 20.25 8.74999 20.249 7.69804 20.135C6.66013 20.0225 6.00992 19.8074 5.50191 19.4383C5.14111 19.1762 4.82382 18.8589 4.56168 18.4981C4.19259 17.9901 3.97745 17.3399 3.865 16.302C3.75103 15.25 3.75 13.8916 3.75 12C3.75 10.1084 3.75103 8.74999 3.865 7.69804C3.97745 6.66013 4.19259 6.00992 4.56168 5.50191C4.82382 5.14111 5.14111 4.82382 5.50191 4.56168Z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </i>
                                Dashboard
                            </>
                        )}
                    </NavLink>
                )}
                {userType !== "user" && (
                    <NavLink
                        to={`${userType}/flight-lookup`}
                        className="flex items-center group text-disabled hover:text-white rounded-xl py-3 px-4"
                    >
                        {({ isActive }) => (
                            <>
                                <i className="flex flex-start mr-2 w-[26px] items-center h-[26px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fillRule="evenodd"
                                        strokeLinejoin="round"
                                        strokeMiterlimit="2"
                                        clipRule="evenodd"
                                        viewBox="0 0 32 32"
                                        id="search"
                                        width={24}
                                        height={24}
                                    >
                                        <path
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M14 0C6.275 0 0 6.272 0 14c0 7.726 6.274 14 14 14 7.727 0 14.001-6.274 14.001-14 0-7.727-6.274-14-14-14Zm0 2c6.624 0 12 5.376 12 12 0 6.623-5.376 12-12 12-6.623 0-11.999-5.377-11.999-12 0-6.624 5.376-12 12-12Z"
                                        ></path>
                                        <path
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="m22.792 24.208 7.5 7.5a1 1 0 0 0 1.414-1.414l-7.5-7.5a1 1 0 0 0-1.414 1.414ZM9 11h5a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2ZM19 17h-5a1 1 0 0 0 0 2h5a1 1 0 0 0 0-2ZM19 13H9a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2ZM18 11h1a1 1 0 0 0 0-2h-1a1 1 0 0 0 0 2ZM10 17H9a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2Z"
                                        ></path>
                                    </svg>
                                </i>
                                Flight lookup
                            </>
                        )}
                    </NavLink>
                )}
                <NavLink
                    to={`${userType}/airports`}
                    className="flex items-center group text-disabled hover:text-white rounded-xl py-3 px-4"
                >
                    {({ isActive }) => (
                        <>
                            <i className="flex flex-start mr-2 w-[26px] items-center h-[26px]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    width={24}
                                    height={24}
                                    id="plane"
                                >
                                    <path
                                        className={`${
                                            isActive ? "fill-white" : "fill-disabled"
                                        } group-hover:fill-white`}
                                        d="M490.718 20.654C477.406 7.336 459.614 0 440.624 0c-18.984 0-36.776 7.336-50.088 20.654L290.347 120.836 76.863 90.603a19.287 19.287 0 0 0-16.387 5.473L5.683 150.87a19.336 19.336 0 0 0 6.504 31.632l157.477 62.884-78.652 92.769-59.505 10.405a19.35 19.35 0 0 0-15.11 13.221 19.317 19.317 0 0 0 4.764 19.5l109.588 109.588c5.099 5.105 12.622 6.93 19.5 4.764a19.317 19.317 0 0 0 13.221-15.11l10.398-59.506 92.711-78.6 62.278 157.355a19.333 19.333 0 0 0 14.059 11.823c1.302.271 2.617.406 3.919.406a19.333 19.333 0 0 0 13.666-5.666l54.794-54.794c4.3-4.3 6.33-10.366 5.479-16.387l-30.227-213.445 100.776-100.182c.084-.084.168-.168.251-.258 27.534-28.41 27.16-72.612-.856-100.615zm-26.804 73.591L356.415 201.113a19.365 19.365 0 0 0-5.512 16.425l30.227 213.483-27.145 27.145-61.369-155.047a19.319 19.319 0 0 0-13.286-11.648 19.194 19.194 0 0 0-4.699-.58 19.266 19.266 0 0 0-12.5 4.596L143.525 396.05a19.324 19.324 0 0 0-6.543 11.416l-5.202 29.737-56.954-56.953 29.737-5.202a19.36 19.36 0 0 0 11.416-6.543l100.563-118.613a19.334 19.334 0 0 0 4.016-17.173 19.344 19.344 0 0 0-11.597-13.292L53.786 157.465l27.216-27.216 213.477 30.233a19.327 19.327 0 0 0 16.387-5.473l107.015-107.01c6.008-6.008 14.085-9.321 22.743-9.321 8.664 0 16.741 3.313 22.756 9.328 12.872 12.873 13.098 33.153.534 46.239z"
                                    ></path>
                                </svg>
                            </i>
                            Airports
                        </>
                    )}
                </NavLink>
                {userType !== "user" && (
                    <NavLink
                        to={`${userType}/regulations`}
                        className="flex items-center group text-disabled hover:text-white rounded-xl py-3 px-4"
                    >
                        {({ isActive }) => (
                            <>
                                <i className="flex flex-start mr-2 w-[26px] items-center h-[26px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        width={26}
                                        height={26}
                                        id="policy"
                                    >
                                        <path
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M15.0112,4.731A22.0639,22.0639,0,0,1,10.7861,3.01a1.4989,1.4989,0,0,0-1.5722,0A22.0731,22.0731,0,0,1,4.9893,4.731,1.4992,1.4992,0,0,0,3.9424,6.209l.165,4.98c.3677,2.5019,2.9917,4.5884,4.5235,5.6089a2.4634,2.4634,0,0,0,2.7382,0c1.5318-1.0205,4.1558-3.107,4.5284-5.6656l.16-4.9228A1.4994,1.4994,0,0,0,15.0112,4.731Zm-.1079,6.312c-.3115,2.12-2.6953,3.9936-4.0888,4.9223a1.4636,1.4636,0,0,1-1.629,0C7.792,15.0366,5.4082,13.1626,5.1016,11.1l-.16-4.9228a.4988.4988,0,0,1,.3462-.4917A22.9391,22.9391,0,0,0,9.7363,3.8623a.49.49,0,0,1,.5274,0,22.93,22.93,0,0,0,4.4492,1.8228.4989.4989,0,0,1,.3457.4917Zm-4.019-1.8872a.8686.8686,0,0,1-.3843.7094v1.3614a.5.5,0,0,1-1,0V9.8652a.8686.8686,0,0,1-.3843-.7094.8843.8843,0,0,1,1.7686,0Z"
                                        ></path>
                                    </svg>
                                </i>
                                Regulations
                            </>
                        )}
                    </NavLink>
                )}
                {userType !== "user" ? (
                    <NavLink
                        to={`${userType}/users`}
                        className="flex items-center group text-disabled hover:text-white rounded-xl py-3 px-4"
                    >
                        {({ isActive }) => (
                            <>
                                <i className="flex flex-start mr-2 w-[26px] items-center h-[26px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 256 256"
                                        width={26}
                                        height={26}
                                        id="actors"
                                    >
                                        <rect width="24" height="24" fill="none"></rect>
                                        <circle
                                            cx="88"
                                            cy="108"
                                            r="52"
                                            fill="none"
                                            className={`${
                                                isActive ? "stroke-white" : "stroke-disabled"
                                            } group-hover:stroke-white`}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="12"
                                        ></circle>
                                        <path
                                            fill="none"
                                            className={`${
                                                isActive ? "stroke-white" : "stroke-disabled"
                                            } group-hover:stroke-white`}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="12"
                                            d="M155.41251 57.937A52.00595 52.00595 0 1 1 169.52209 160M15.99613 197.39669a88.01736 88.01736 0 0 1 144.00452-.00549M169.52209 160a87.89491 87.89491 0 0 1 72.00032 37.3912"
                                        ></path>
                                    </svg>
                                </i>
                                Users
                            </>
                        )}
                    </NavLink>
                ) : (
                    <NavLink
                        to={`${userType}/user-account`}
                        className="flex items-center group text-disabled hover:text-white rounded-xl py-3 px-4"
                    >
                        {({ isActive }) => (
                            <>
                                <i className="flex flex-start mr-2 w-[26px] items-center h-[26px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 256 256"
                                        width={26}
                                        height={26}
                                        id="user"
                                    >
                                        <rect width="26" height="26" fill="none"></rect>
                                        <circle
                                            className={`${
                                                isActive ? "stroke-white" : "stroke-disabled"
                                            } group-hover:stroke-white`}
                                            cx="128"
                                            cy="96"
                                            r="64"
                                            fill="none"
                                            stroke="#000"
                                            strokeMiterlimit="10"
                                            strokeWidth="16"
                                        ></circle>
                                        <path
                                            className={`${
                                                isActive ? "stroke-white" : "stroke-disabled"
                                            } group-hover:stroke-white`}
                                            fill="none"
                                            stroke="#000"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="16"
                                            d="M30.989,215.99064a112.03731,112.03731,0,0,1,194.02311.002"
                                        ></path>
                                    </svg>
                                </i>
                                User account
                            </>
                        )}
                    </NavLink>
                )}
                {userType === "administrator" && (
                    <NavLink
                        to={`${userType}/group-permissions`}
                        className="flex items-center group text-disabled hover:text-white rounded-xl py-3 px-4"
                    >
                        {({ isActive }) => (
                            <>
                                <i className="flex flex-start mr-2 w-[26px] items-center h-[26px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 16 16"
                                        id="security-access"
                                    >
                                        <path
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M13,9.00403 C13.8284,9.00403 14.5,9.6756 14.5,10.504 L14.5,10.9983 C15.3314,10.9983 16.0029,11.6698 16.0029,12.4983 L16.0029,14.4935 C16.0029,15.3219 15.3314,15.9935 14.5029,15.9935 L11.5029,15.9935 C10.6745,15.9935 10.0029,15.3219 10.0029,14.4935 L10.0029,12.4983 C10.0029,11.6708 10.6729,10.9999 11.5,10.9983 L11.5,10.504 C11.5,9.6756 12.1716,9.00403 13,9.00403 Z M14.5029,11.9983 L11.5029,11.9983 C11.2574778,11.9983 11.0533,12.1751296 11.0109571,12.4084092 L11.0029,12.4983 L11.0029,14.4935 C11.0029,14.7389222 11.1798086,14.9431 11.4130355,14.9854429 L11.5029,14.9935 L14.5029,14.9935 C14.7484111,14.9935 14.9525198,14.8165914 14.9948462,14.5833645 L15.0029,14.4935 L15.0029,12.4983 C15.0029,12.2527889 14.8260704,12.0486802 14.5927908,12.0063538 L14.5029,11.9983 Z M8,2 C11.3137,2 14,4.68629 14,8 L13.9964,8.2105 C13.6911,8.07769 13.3542,8.00404 13,8.00403 C13,5.23858 10.7614,3 8,3 C5.23858,3 3,5.23858 3,8 C3,10.7614 5.23858,13 8,13 C8.3435,13 8.67891,12.9654 9.00293,12.8994 L9.00293,13.9165 C8.6768,13.9714 8.34174,14 8,14 C4.68629,14 2,11.3137 2,8 C2,4.68629 4.68629,2 8,2 Z M13.0029,12.9959 C13.2791,12.9959 13.5029,13.2198 13.5029,13.4959 C13.5029,13.772 13.2791,13.9959 13.0029,13.9959 C12.7268,13.9959 12.5029,13.772 12.5029,13.4959 C12.5029,13.2198 12.7268,12.9959 13.0029,12.9959 Z M13,10.004 C12.7545778,10.004 12.5504,10.1809086 12.5080571,10.4141355 L12.5,10.504 L12.5,10.9983 L13.5,10.9983 L13.5,10.504 C13.5,10.2279 13.2761,10.004 13,10.004 Z M10.8274,6.16304 C11.0012,6.33637 11.0208,6.60577 10.8861,6.80082 L10.8283,6.87014 L7.60403,10.1031 C7.43053,10.277 7.16082,10.2965 6.96576,10.1615 L6.89645,10.1036 L5.14645,8.35355 C4.95118,8.15829 4.95118,7.84171 5.14645,7.64645 C5.32001,7.47288 5.58944,7.4536 5.78431,7.58859 L5.85355,7.64645 L7.24953,9.04242 L10.1203,6.16398 C10.3153,5.96846 10.6319,5.96803 10.8274,6.16304 Z"
                                        ></path>
                                    </svg>
                                </i>
                                Group Permissions
                            </>
                        )}
                    </NavLink>
                )}
            </div>
        </div>
    );
}

export default Sidebar;
