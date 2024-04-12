import axios from "~/utils/axios";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import userPicture from "~/assets/user_picture.png";
import { convertNormalDate } from "~/utils/convertNormalDate";

function Users() {
    const [data, setData] = useState<
        Array<{
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            gender: string;
            profilePicture: null | string;
            phoneNumber: string;
            address: string;
            dateOfBirth: string;
            roleId: string;
        }>
    >([]);
    const dispatch = useAppDispatch();
    const { query } = useAppSelector((state) => state.searching!);

    useEffect(() => {
        (async () => {
            try {
                dispatch(startLoading());

                const usersResponse = await axios.get("/users/users?page=1&take=20", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.accessToken}`
                    }
                });
                setData(usersResponse.data.data.filter((user: { roleId: string }) => user.roleId === "2"));
                dispatch(stopLoading());
            } catch (error) {
                console.error(error);
            }
        })();
    }, [dispatch]);

    return (
        <>
            <div className="bg-block p-6 rounded-3xl shadow-xl">
                <ul className="grid grid-cols-3 gap-6 w-full">
                    {data
                        ?.filter((user) => user.email.toLowerCase().includes(query.toLowerCase()))
                        .map((user) => (
                            <li
                                key={user.id}
                                className="flex gap-6 bg-background border border-blue items-center p-4 rounded-xl"
                            >
                                <div className="">
                                    <img
                                        src={user.profilePicture === null ? userPicture : user.profilePicture}
                                        alt="user-picture"
                                        className="w-24 h-24"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 text-[13px]">
                                    <div>
                                        <div className="flex gap-2 items-center">
                                            <div className="text-primary text-base font-medium">
                                                {user.firstName + " " + user.lastName}
                                            </div>
                                            <div className="rounded-lg px-1 text-[13px] capitalize bg-block border border-blue">
                                                {user.gender}
                                            </div>
                                        </div>
                                        <div className="text-[13px]">{user.email}</div>
                                    </div>
                                    <div>
                                        <div>
                                            <span className="font-medium text-blue">Phone number: </span>
                                            {user.phoneNumber}
                                        </div>
                                        <div>
                                            <span className="font-medium text-blue">Address: </span>
                                            {user.address}
                                        </div>
                                        <div>
                                            <span className="font-medium text-blue">Birthday: </span>
                                            {convertNormalDate(user.dateOfBirth)}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
        </>
    );
}

export default Users;
