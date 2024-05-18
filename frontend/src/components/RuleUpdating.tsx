import axios from "~/utils/axios";
import { useState } from "react";
import usePortal from "react-cool-portal";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsRequired from "~/icons/IsRequired";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";

const schema = yup.object().shape({
    ruleName: yup.string().required("Rule name is required."),
    detail: yup.string().required("Rule detail is required.")
});

interface RuleProps {
    ruleName: string;
    detail: string;
    values: ValueObject;
    code: string;
}

const RuleUpdating: React.FC<RuleProps> = ({ ruleName, detail, values, code }) => {
    const [stateValues, setStateValues] = useState(values);
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
            ruleName: ruleName,
            detail: detail
        }
    });

    const handleValueChange = (key, newVal) => {
        setStateValues((prevState) => ({
            ...prevState,
            [key]: newVal
        }));
    };

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<RuleValidation> = async (formData) => {
        dispatch(startLoading());

        const ruleName = formData.ruleName;
        const detail = formData.detail;

        (async () => {
            axios
                .post(
                    "/rule/511454340/add-update-rule",
                    {
                        ruleName,
                        detail,
                        code: code,
                        values: stateValues
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
        code !== "R2" && (
            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="border border-blue p-8 bg-background relative rounded-xl w-[500px] no-scrollbar">
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
                                <div className="text-white font-semibold text-xl">Update rule</div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                                <div className="text-blue text-[15px]">Rule information</div>
                                <div className="flex gap-2 flex-col">
                                    <label htmlFor="ruleName" className="flex gap-1 mb-1 items-center">
                                        Rule name
                                        <IsRequired />
                                    </label>
                                    <input
                                        type="text"
                                        id="ruleName"
                                        placeholder="Rule name . . ."
                                        {...register("ruleName")}
                                        className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                    />
                                    {<span className="text-deepRed">{errors.ruleName?.message}</span>}
                                </div>

                                <div className="flex gap-2 flex-col">
                                    <label htmlFor="detail" className="flex gap-1 mb-1 items-center">
                                        Detail
                                        <IsRequired />
                                    </label>
                                    <textarea
                                        id="detail"
                                        placeholder="Detail . . ."
                                        {...register("detail")}
                                        className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                    />
                                    {<span className="text-deepRed">{errors.detail?.message}</span>}
                                </div>
                                <div className="text-blue text-[15px]">Values</div>
                                {Object.entries(stateValues).map(([key, val], index) => (
                                    <div
                                        key={`${key}-${index}`}
                                        className="grid grid-cols-5 gap-4 justify-center items-end"
                                    >
                                        <div className="flex flex-col gap-2 col-span-4">
                                            <label htmlFor={`key-${index}`} className="flex gap-1 mb-1 items-center">
                                                Key
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Key . . ."
                                                disabled
                                                defaultValue={key}
                                                id={`key-${index}`}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:border-primary focus:border focus:border-1 border border-blue border-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor={`key-${index}`} className="flex gap-1 mb-1 items-center">
                                                Value
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="text"
                                                id={`value-${index}`}
                                                defaultValue={val}
                                                onChange={(e) => handleValueChange(key, e.target.value)}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:border-primary focus:border focus:border-1 border border-blue border-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                    type="submit"
                                >
                                    Update rule
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Portal>
        )
    );
    // <Portal>
    //     <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
    //         <div className="flex items-center justify-center">
    //             <div className="border border-blue p-8 bg-background relative rounded-xl w-[500px] no-scrollbar">
    //                 <button
    //                     onClick={hide}
    //                     className="absolute right-4 top-4 border border-blue rounded-full p-1 hover:border-primary hover:bg-primary"
    //                 >
    //                     <i>
    //                         <svg
    //                             xmlns="http://www.w3.org/2000/svg"
    //                             viewBox="0 0 24 24"
    //                             width={14}
    //                             height={14}
    //                             id="close"
    //                         >
    //                             <path
    //                                 className="fill-white"
    //                                 d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
    //                             ></path>
    //                         </svg>
    //                     </i>
    //                 </button>
    //                 <div className="flex justify-center mb-8">
    //                     <div className="text-white font-semibold text-xl">Update rule</div>
    //                 </div>
    //                 <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
    //                     <div className="text-blue text-[15px]">Rule information</div>
    //                     <div className="flex gap-2 flex-col">
    //                         <label htmlFor="ruleName" className="flex gap-1 mb-1 items-center">
    //                             Rule name
    //                             <IsRequired />
    //                         </label>
    //                         <input
    //                             type="text"
    //                             id="ruleName"
    //                             placeholder="Rule name . . ."
    //                             {...register("ruleName")}
    //                             className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
    //                         />
    //                         {<span className="text-deepRed">{errors.ruleName?.message}</span>}
    //                     </div>

    //                     <div className="flex gap-2 flex-col">
    //                         <label htmlFor="detail" className="flex gap-1 mb-1 items-center">
    //                             Detail
    //                             <IsRequired />
    //                         </label>
    //                         <textarea
    //                             rows={3}
    //                             id="detail"
    //                             placeholder="Detail . . ."
    //                             {...register("detail")}
    //                             className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
    //                         />
    //                         {<span className="text-deepRed">{errors.detail?.message}</span>}
    //                     </div>
    //                     <div className="text-blue text-[15px]">Values</div>

    //                     <div className="grid grid-cols-5 gap-4 justify-center items-end">
    //                         <div className="flex flex-col gap-2 col-span-3">
    //                             <label htmlFor="ticket-classes" className="flex gap-1 mb-1 items-center">
    //                                 Key
    //                                 <IsRequired />
    //                             </label>
    //                             <input
    //                                 type="text"
    //                                 placeholder="Key . . ."
    //                                 disabled
    //                                 defaultValue="ticket_classes"
    //                                 id={`key`}
    //                                 className="bg-[rgba(141,124,221,0.1)] text-sm focus:border-primary focus:border focus:border-1 border border-blue border-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
    //                             />
    //                         </div>
    //                         <div className="flex flex-col gap-2 col-span-2">
    //                             <label htmlFor={`key`} className="flex gap-1 mb-1 items-center">
    //                                 Value
    //                                 <IsRequired />
    //                             </label>
    //                             <div className="grid grid-cols-2 gap-2">
    //                                 <input
    //                                     type="text"
    //                                     id={`value`}
    //                                     defaultValue={values.ticket_classes["1"].price_multiplier}
    //                                     onChange={(e) => handleValueChange(, e.target.value)}
    //                                     className="bg-[rgba(141,124,221,0.1)] text-sm focus:border-primary focus:border focus:border-1 border border-blue border-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
    //                                 />
    //                                 <input
    //                                     type="text"
    //                                     id={`value`}
    //                                     defaultValue={values.ticket_classes["2"].price_multiplier}
    //                                     onChange={(e) => handleValueChange(key, e.target.value)}
    //                                     className="bg-[rgba(141,124,221,0.1)] text-sm focus:border-primary focus:border focus:border-1 border border-blue border-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
    //                                 />
    //                             </div>
    //                         </div>
    //                     </div>

    //                     <button
    //                         className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
    //                         type="submit"
    //                     >
    //                         Update rule
    //                     </button>
    //                 </form>
    //             </div>
    //         </div>
    //     </div>
    // </Portal>
};

export default RuleUpdating;
