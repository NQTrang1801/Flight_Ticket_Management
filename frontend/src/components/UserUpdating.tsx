import axios from "~/utils/axios";
import usePortal from "react-cool-portal";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsRequired from "~/icons/IsRequired";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";

const schema = yup.object().shape({
    fullname: yup.string().required("Full name is required."),
    address: yup.string().required("Address is required."),
    mobile: yup
        .number()
        .required("Phone number is required.")
        .typeError("Phone number must be a number.")
        .min(10, "Phone number must be exactly 10 digits")
});

interface UserUpdatingProps {
    _id: string;
    fullname: string;
    mobile: number;
    address: string;
}

const UserUpdating: React.FC<UserUpdatingProps> = ({ _id, fullname, mobile, address }) => {
    const { Portal, hide } = usePortal({
        defaultShow: true
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            fullname: fullname,
            mobile: mobile,
            address: address
        }
    });

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<UserUpdatingProps> = async (formData) => {
        hide();
        dispatch(startLoading());

        const fullname = formData.fullname;
        const mobile = formData.mobile;
        const address = formData.address;

        (async () => {
            axios
                .put(
                    `/user/edit-user/${_id}`,
                    {
                        fullname,
                        mobile,
                        address
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
                                <div className="text-white font-semibold text-xl">Update user</div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="fullname" className="flex gap-1 mb-1 items-center">
                                            Full name
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="text"
                                            id="fullname"
                                            placeholder="Enter your full name . . ."
                                            {...register("fullname")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.fullname?.message}</span>}
                                    </div>

                                    <div className="flex gap-2 flex-col">
                                        <label htmlFor="mobile" className="flex gap-1 mb-1 items-center">
                                            Phone number
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="text"
                                            id="mobile"
                                            placeholder="Enter your phone number . . ."
                                            {...register("mobile")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.mobile?.message}</span>}
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <label htmlFor="address" className="flex gap-1 mb-1 items-center">
                                        Address
                                        <IsRequired />
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        placeholder="Enter your address . . ."
                                        {...register("address")}
                                        className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                    />
                                    {<span className="text-deepRed">{errors.address?.message}</span>}
                                </div>
                                <button
                                    className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                    type="submit"
                                >
                                    Update user
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    );
};

export default UserUpdating;
