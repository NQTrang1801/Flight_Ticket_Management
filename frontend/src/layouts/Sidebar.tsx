import { NavLink } from "react-router-dom";
import logo from "~/assets/logo.png";

function Sidebar() {
    return (
        <div className="w-[240px] bg-background z-20 fixed top-0 bottom-0 flex flex-col pb-10 pt-6 border-r-[1px] border-r-solid border-r-border px-5">
            <div className="flex items-center justify-center">
                <img src={logo} className="w-40 mb-8" alt="logo" />
            </div>
            <p className="pl-4 pb-3 text-blue">Admin tools</p>
            <div className="flex flex-col pb-[32px] gap-2">
                <NavLink
                    to="/movies"
                    className="flex items-center group text-disabled hover:text-white rounded-xl py-3 px-4"
                >
                    {({ isActive }) => (
                        <>
                            <i className="flex flex-start mr-2 w-[26px] items-center h-[26px] justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    data-name="Layer 1"
                                    viewBox="0 0 32 32"
                                    width={22}
                                    height={22}
                                    id="film"
                                >
                                    <path
                                        className={`${
                                            isActive ? "fill-white" : "fill-disabled"
                                        } group-hover:fill-white`}
                                        d="M9 12a4 4 0 1 0 4 4 4 4 0 0 0-4-4zm0 6a2 2 0 1 1 2-2 2 2 0 0 1-2 2zm14 2a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1-2 2 2 2 0 0 1 2-2zm-3 9a4 4 0 1 0-4 4 4 4 0 0 0 4-4zm-6 0a2 2 0 1 1 2 2 2 2 0 0 1-2-2zm2-10a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"
                                    ></path>
                                    <path
                                        className={`${
                                            isActive ? "fill-white" : "fill-disabled"
                                        } group-hover:fill-white`}
                                        d="M31 30h-7.272A15.986 15.986 0 1 0 16 32h15a1 1 0 0 0 0-2ZM2 16a14 14 0 1 1 14 14A14.015 14.015 0 0 1 2 16Z"
                                    ></path>
                                </svg>
                            </i>
                            Movies
                        </>
                    )}
                </NavLink>
                <NavLink
                    to="/actors"
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
                            Actors
                        </>
                    )}
                </NavLink>
                <NavLink
                    to="/news"
                    className="flex items-center group text-disabled hover:text-white rounded-xl py-3 px-4"
                >
                    {({ isActive }) => (
                        <>
                            <i className="flex flex-start mr-2 w-[26px] items-center h-[26px]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="26"
                                    height="26"
                                    viewBox="0 0 24 24"
                                    id="document"
                                >
                                    <g
                                        fill="none"
                                        fillRule="evenodd"
                                        className={`${
                                            isActive ? "stroke-white" : "stroke-disabled"
                                        } group-hover:stroke-white`}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        transform="translate(3 2)"
                                    >
                                        <line x1="12.716" x2="5.496" y1="14.223" y2="14.223"></line>
                                        <line x1="12.716" x2="5.496" y1="10.037" y2="10.037"></line>
                                        <line x1="8.251" x2="5.496" y1="5.86" y2="5.86"></line>
                                        <path d="M12.9086,0.7498 C12.9086,0.7498 5.2316,0.7538 5.2196,0.7538 C2.4596,0.7708 0.7506,2.5868 0.7506,5.3568 L0.7506,14.5528 C0.7506,17.3368 2.4726,19.1598 5.2566,19.1598 C5.2566,19.1598 12.9326,19.1568 12.9456,19.1568 C15.7056,19.1398 17.4156,17.3228 17.4156,14.5528 L17.4156,5.3568 C17.4156,2.5728 15.6926,0.7498 12.9086,0.7498 Z"></path>
                                    </g>
                                </svg>
                            </i>
                            News
                        </>
                    )}
                </NavLink>
                <NavLink
                    to="/theaters"
                    className="flex items-center group text-disabled hover:text-white rounded-xl py-3 px-4"
                >
                    {({ isActive }) => (
                        <>
                            <i className="flex flex-start mr-2 w-[26px] items-center h-[26px]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    data-name="Layer 1"
                                    viewBox="0 0 64 64"
                                    width={26}
                                    height={26}
                                    id="popcorn"
                                >
                                    <path
                                        className={`${
                                            isActive ? "fill-white" : "fill-disabled"
                                        } group-hover:fill-white`}
                                        d="M53.8,22.27a3.08,3.08,0,0,0-1.63-2.71,5.33,5.33,0,0,0,.44-5.34,5.24,5.24,0,0,0-1.07-1.47A5.15,5.15,0,0,0,52,7.82,5.33,5.33,0,0,0,49.19,5a4.76,4.76,0,0,0-2.73-.26,5.44,5.44,0,0,0-.29-.86,5.25,5.25,0,0,0-2.83-2.82,4.63,4.63,0,0,0-3.58,0,4.68,4.68,0,0,0-.87.5A4.71,4.71,0,0,0,35.64.22h0a4.78,4.78,0,0,0-4.08,2.52A4.55,4.55,0,0,0,30,.83,4.65,4.65,0,0,0,26.3.11a5.23,5.23,0,0,0-3.18,2.14,4.68,4.68,0,0,0-.53,1,5.12,5.12,0,0,0-5.07,2.17,5.18,5.18,0,0,0-.8,4.23,7.4,7.4,0,0,0-.41.69,5.68,5.68,0,0,0-.39,1,5.05,5.05,0,0,0-4.7,2.87,5.25,5.25,0,0,0-.32,4,4.74,4.74,0,0,0,.81,1.48,3.06,3.06,0,0,0,.55,5.53l5.07,36.33A2.93,2.93,0,0,0,20.21,64H43.76a2.93,2.93,0,0,0,2.88-2.51l5.08-36.32A3.08,3.08,0,0,0,53.8,22.27Zm-9.45-3.09a5.35,5.35,0,0,0-.74-2.48,4.66,4.66,0,0,0,2.23-2.36,4.63,4.63,0,0,0,4.3-.25,3.15,3.15,0,0,1,.72,1,3.34,3.34,0,0,1-1,4.13Zm-14.29,0c0-.11,0-.22,0-.34a3.1,3.1,0,0,1,1.82-2.79,4.24,4.24,0,0,0,1.07.14l.29,0a4.66,4.66,0,0,0,3-1.34,4.7,4.7,0,0,0,2.5,1.35s.05,0,.07.05a1.21,1.21,0,0,0,.37.07,1,1,0,0,0,.17,0h.39a2.69,2.69,0,0,1,1.62.67,3.24,3.24,0,0,1,1.08,2.24Zm-1.93,0H26.25A5,5,0,0,0,25.72,17a4.89,4.89,0,0,0,.85.08,5,5,0,0,0,2.11-.48,5.32,5.32,0,0,0-.57,2.21C28.11,18.91,28.12,19,28.13,19.18ZM40.52,2.84a2.7,2.7,0,0,1,2.09,0,3.32,3.32,0,0,1,1.78,1.79A3.19,3.19,0,0,1,44.65,6a1,1,0,0,0,1.46.87,1.34,1.34,0,0,1,.24-.12,2.75,2.75,0,0,1,2.11,0,3.32,3.32,0,0,1,1.77,1.78,3.13,3.13,0,0,1-.73,3.59,2.43,2.43,0,0,1-.7.44,2.82,2.82,0,0,1-2.93-.51,1,1,0,0,0-1.59.64A2.78,2.78,0,0,1,42.78,15a5.28,5.28,0,0,0,.91-6.37h0A4.81,4.81,0,0,0,40.4,6.18a5.62,5.62,0,0,0,.07-.92A5.34,5.34,0,0,0,40,3.13,2.65,2.65,0,0,1,40.52,2.84ZM32.37,8a1,1,0,0,0,.7-1.35,3,3,0,0,1-.28-1.31,3,3,0,0,1,2.84-3.18A2.81,2.81,0,0,1,38,3.47h0a3.22,3.22,0,0,1,.54,1.79,3.58,3.58,0,0,1-.29,1.43,1,1,0,0,0,.1,1,1,1,0,0,0,.9.38l.28,0A2.81,2.81,0,0,1,42,9.53h0a3.27,3.27,0,0,1,.43,1.62,3,3,0,0,1-2.73,3.18h-.36l-.18,0a2.88,2.88,0,0,1-2.1-1.55,1,1,0,0,0-.85-.53,1,1,0,0,0-.86.51,2.8,2.8,0,0,1-2.29,1.5,2.32,2.32,0,0,1-1-.12,3.11,3.11,0,0,1-.72-.38,5.1,5.1,0,0,0,.18-3.38,4.72,4.72,0,0,0-.71-1.44A2.8,2.8,0,0,1,32.37,8ZM22.82,5.29a1,1,0,0,0,1.35-.7,3.06,3.06,0,0,1,.54-1.23A3.26,3.26,0,0,1,26.7,2a2.75,2.75,0,0,1,2.17.41A2.72,2.72,0,0,1,30,4.19a3.33,3.33,0,0,1-.56,2.45,3.39,3.39,0,0,1-1.05,1,1,1,0,0,0,0,1.68l.24.14.32.26a2.71,2.71,0,0,1,.74,1.21,3.21,3.21,0,0,1-.36,2.6.86.86,0,0,1-.07.1l0,.07a3.05,3.05,0,0,1-4.18,1s-.06-.07-.1-.09a5.4,5.4,0,0,0,.55-2.43A4.77,4.77,0,0,0,22.9,7.9,4.72,4.72,0,0,0,18.53,8a3.5,3.5,0,0,1,.58-1.53A3.06,3.06,0,0,1,22.82,5.29ZM13,15a3.08,3.08,0,0,1,3.51-1.71.93.93,0,0,0,.82-.14,1,1,0,0,0,.41-.74A3.28,3.28,0,0,1,18,11.16a2.94,2.94,0,0,1,.49-.72,2.92,2.92,0,0,1,3.5-.8,2.81,2.81,0,0,1,1.51,2.5,3.45,3.45,0,0,1-.37,1.6,3.19,3.19,0,0,1-.26.42,3,3,0,0,1-.63.69,1,1,0,0,0-.36.94,1,1,0,0,0,.66.75,1,1,0,0,1,.22.1,2.83,2.83,0,0,1,1.51,2.54H14.18l-.08,0a2.74,2.74,0,0,1-1.36-1.6A3.31,3.31,0,0,1,13,15Zm6.3,46.18-5-35.87H27.68v7.89a9.39,9.39,0,0,0,0,16.69V62.06H20.21A1,1,0,0,1,19.25,61.22ZM34.7,25.35v7.24a9.3,9.3,0,0,0-5.08-.09V25.35ZM32,51a9.7,9.7,0,0,0,2.71-.4V62.06H29.62V50.67A9.28,9.28,0,0,0,32,51Zm0-1.94a7.46,7.46,0,1,1,7.46-7.46A7.47,7.47,0,0,1,32,49.05ZM44.72,61.22a1,1,0,0,1-1,.84H36.63V49.75a9.37,9.37,0,0,0,0-16.32V25.35H49.74Zm6-37.81H13.29a1.15,1.15,0,1,1,0-2.29H50.71a1.15,1.15,0,1,1,0,2.29Z"
                                    ></path>
                                </svg>
                            </i>
                            Theaters
                        </>
                    )}
                </NavLink>
                <NavLink
                    to="/shows"
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
                            Shows
                        </>
                    )}
                </NavLink>
                <NavLink
                    to="/bookings"
                    className="flex items-center group text-disabled hover:text-white rounded-xl py-3 px-4"
                >
                    {({ isActive }) => (
                        <>
                            <i className="flex flex-start mr-2 w-[26px] items-center h-[26px]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    enableBackground="new 0 0 24 24"
                                    width={26}
                                    height={26}
                                    viewBox="0 0 24 24"
                                    id="online-booking"
                                >
                                    <g>
                                        <path
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M15.5,2h-7C6.6,2,5,3.6,5,5.5v13C5,20.4,6.6,22,8.5,22h7c1.9,0,3.5-1.6,3.5-3.5v-13C19,3.6,17.4,2,15.5,2z M17,18.5
			c0,0.8-0.7,1.5-1.5,1.5h-7C7.7,20,7,19.3,7,18.5v-13C7,4.7,7.7,4,8.5,4h7C16.3,4,17,4.7,17,5.5V18.5z"
                                        ></path>
                                        <path
                                            className={`${
                                                isActive ? "fill-white" : "fill-disabled"
                                            } group-hover:fill-white`}
                                            d="M13,5h-2c-0.6,0-1,0.4-1,1s0.4,1,1,1h2c0.6,0,1-0.4,1-1S13.6,5,13,5z"
                                        ></path>
                                    </g>
                                </svg>
                            </i>
                            Bookings
                        </>
                    )}
                </NavLink>
                <NavLink
                    to="/users"
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
            </div>
        </div>
    );
}

export default Sidebar;
