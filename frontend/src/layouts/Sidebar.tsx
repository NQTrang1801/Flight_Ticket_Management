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
                        to={`${userType}/flight-schedules`}
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
                                Flight schedules
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
                {userType === "administrator" && (
                    <NavLink
                        to={`${userType}/permission-groups`}
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
                                        id="group"
                                    >
                                        <path
                                            fill="#000"
                                            fillRule="evenodd"
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M12 7.25C13.4932 7.25 14.625 8.37855 14.625 9.67647C14.625 10.9744 13.4932 12.1029 12 12.1029C10.5068 12.1029 9.375 10.9744 9.375 9.67647C9.375 8.37855 10.5068 7.25 12 7.25ZM16.125 9.67647C16.125 7.46576 14.2347 5.75 12 5.75C9.76531 5.75 7.875 7.46576 7.875 9.67647C7.875 11.8872 9.76531 13.6029 12 13.6029C14.2347 13.6029 16.125 11.8872 16.125 9.67647Z"
                                            clipRule="evenodd"
                                        ></path>
                                        <path
                                            fill="#000"
                                            fillRule="evenodd"
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M12 13.603C14.2874 13.603 16.2049 14.9624 16.9327 16.8197 17.0201 17.0425 16.9742 17.2373 16.8204 17.4103 16.6507 17.6011 16.3506 17.7501 16 17.7501H7.99997C7.64935 17.7501 7.3492 17.6011 7.17957 17.4103 7.02573 17.2373 6.97986 17.0425 7.0672 16.8197 7.79504 14.9624 9.71256 13.603 12 13.603zM18.3293 16.2724C17.3676 13.8181 14.8803 12.103 12 12.103 9.11963 12.103 6.63237 13.8181 5.67061 16.2724 5.35493 17.0779 5.5723 17.8602 6.05862 18.4071 6.52913 18.9362 7.24603 19.2501 7.99997 19.2501H16C16.7539 19.2501 17.4708 18.9362 17.9413 18.4071 18.4276 17.8602 18.645 17.0779 18.3293 16.2724zM17.0001 6.75C18.1238 6.75 19.1123 7.73291 19.1123 9.04412 19.1123 10.3553 18.1238 11.3382 17.0001 11.3382 16.5859 11.3382 16.2501 11.674 16.2501 12.0882 16.2501 12.5025 16.5859 12.8382 17.0001 12.8382 19.0379 12.8382 20.6123 11.0954 20.6123 9.04412 20.6123 6.99289 19.0379 5.25 17.0001 5.25 16.5859 5.25 16.2501 5.58579 16.2501 6 16.2501 6.41421 16.5859 6.75 17.0001 6.75z"
                                            clipRule="evenodd"
                                        ></path>
                                        <path
                                            fill="#000"
                                            fillRule="evenodd"
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M17.0005 12.8381C19.3536 12.8381 21.3389 14.8811 21.3389 17.4999 21.3389 17.9141 21.6747 18.2499 22.0889 18.2499 22.5031 18.2499 22.8389 17.9141 22.8389 17.4999 22.8389 14.1411 20.2678 11.3381 17.0005 11.3381 16.5863 11.3381 16.2505 11.6739 16.2505 12.0881 16.2505 12.5023 16.5863 12.8381 17.0005 12.8381zM7.08878 6.75C5.9651 6.75 4.97656 7.73291 4.97656 9.04412 4.97656 10.3553 5.9651 11.3382 7.08878 11.3382 7.503 11.3382 7.83878 11.674 7.83878 12.0882 7.83878 12.5025 7.503 12.8382 7.08878 12.8382 5.05094 12.8382 3.47656 11.0954 3.47656 9.04412 3.47656 6.99289 5.05094 5.25 7.08878 5.25 7.503 5.25 7.83878 5.58579 7.83878 6 7.83878 6.41421 7.503 6.75 7.08878 6.75z"
                                            clipRule="evenodd"
                                        ></path>
                                        <path
                                            fill="#000"
                                            fillRule="evenodd"
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M7.08839 12.8381C4.73523 12.8381 2.75 14.8811 2.75 17.4999C2.75 17.9141 2.41421 18.2499 2 18.2499C1.58579 18.2499 1.25 17.9141 1.25 17.4999C1.25 14.1411 3.82107 11.3381 7.08839 11.3381C7.5026 11.3381 7.83839 11.6739 7.83839 12.0881C7.83839 12.5023 7.5026 12.8381 7.08839 12.8381Z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </i>
                                Permission Groups
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
            </div>
        </div>
    );
}

export default Sidebar;
