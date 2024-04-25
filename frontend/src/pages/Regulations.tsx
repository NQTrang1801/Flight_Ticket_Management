import axios from "~/utils/axios";
import { useState, useEffect } from "react";
import usePortal from "react-cool-portal";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsRequired from "~/icons/IsRequired";
import { useAppDispatch } from "~/hook";
import { startLoading, stopLoading } from "~/actions/loading";
import { sendMessage } from "~/actions/message";
import Rule from "~/components/Rule";

const schema = yup.object().shape({
    ruleName: yup.string().required("Rule name is required."),
    ruleDetails: yup.string().required("Rule detail is required."),
    code: yup.string().required("Code is required."),
    value: yup
        .array()
        .of(
            yup.object().shape({
                key: yup.string().required("Key is required."),
                value: yup.number().required("Value is required.")
            })
        )
        .required("Value is required")
});

function Regulations() {
    const [data, setData] = useState();
    const [deletingMode, setDeletingMode] = useState(false);
    const { Portal, show, hide } = usePortal({
        defaultShow: false
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "value"
    });

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<RuleValidation> = async (formData) => {
        hide();
        dispatch(startLoading());

        const ruleName = formData.ruleName;
        const ruleDetails = formData.ruleDetails;
        const code = formData.code;
        const value = formData.value;

        (async () => {
            axios
                .post(
                    "/rule/511454340/add-update-rule",
                    {
                        ruleName,
                        ruleDetails,
                        code,
                        value
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.token}`
                        }
                    }
                )
                .then(() => {
                    dispatch(stopLoading());
                    dispatch(sendMessage("Created sucessfully!"));
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                })
                .catch((error) => {
                    dispatch(stopLoading());
                    dispatch(sendMessage("Created failed!"));
                    console.error(error);
                });
        })();
    };

    useEffect(() => {
        (async () => {
            try {
                const showsResponse = await axios.get("rule/511320340/all", {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).data.token}`
                    }
                });
                setData(showsResponse.data);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    return (
        <>
            <div className="flex justify-end items-center mb-6">
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => {
                            setDeletingMode(false);
                            show();
                        }}
                        className="bg-block rounded-xl border-blue border hover:border-primary hover:bg-primary flex items-center justify-center p-3 w-[112px]"
                    >
                        <i className="mr-[3px]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="add"
                                x="0"
                                y="0"
                                version="1.1"
                                viewBox="0 0 29 29"
                                xmlSpace="preserve"
                                width={20}
                                height={20}
                                className="translate-x-[-3px]"
                            >
                                <path
                                    fill="none"
                                    stroke="#fff"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit="10"
                                    strokeWidth="2"
                                    d="M14.5 22V7M7 14.5h15"
                                ></path>
                            </svg>
                        </i>
                        Create
                    </button>
                    <button
                        onClick={() => setDeletingMode(!deletingMode)}
                        className={`bg-block rounded-xl border-blue border hover:border-primary ${
                            deletingMode ? "border-mdRed bg-mdRed" : ""
                        } hover:bg-primary flex items-center justify-center p-3 w-[112px]`}
                    >
                        <i className="mr-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32"
                                width={20}
                                height={20}
                                id="delete"
                            >
                                <path
                                    className="fill-white"
                                    d="M24.2,12.193,23.8,24.3a3.988,3.988,0,0,1-4,3.857H12.2a3.988,3.988,0,0,1-4-3.853L7.8,12.193a1,1,0,0,1,2-.066l.4,12.11a2,2,0,0,0,2,1.923h7.6a2,2,0,0,0,2-1.927l.4-12.106a1,1,0,0,1,2,.066Zm1.323-4.029a1,1,0,0,1-1,1H7.478a1,1,0,0,1,0-2h3.1a1.276,1.276,0,0,0,1.273-1.148,2.991,2.991,0,0,1,2.984-2.694h2.33a2.991,2.991,0,0,1,2.984,2.694,1.276,1.276,0,0,0,1.273,1.148h3.1A1,1,0,0,1,25.522,8.164Zm-11.936-1h4.828a3.3,3.3,0,0,1-.255-.944,1,1,0,0,0-.994-.9h-2.33a1,1,0,0,0-.994.9A3.3,3.3,0,0,1,13.586,7.164Zm1.007,15.151V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Zm4.814,0V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Z"
                                ></path>
                            </svg>
                        </i>
                        Delete
                    </button>
                </div>
            </div>
            {deletingMode && (
                <div className="shadow-xl rounded-xl bg-block mb-6">
                    <div className="bg-primary h-6 rounded-tr-xl rounded-tl-xl"></div>
                    <div className="p-6 text-[15px]">Select a show below to delete.</div>
                </div>
            )}
            <div className="flex flex-col gap-10">
                <div className="bg-block p-6 rounded-3xl shadow-xl">
                    <table className="w-full bg-block">
                        <thead>
                            <tr className="text-center bg-primary">
                                <th className="w-16">Index</th>
                                <th className="">Code</th>
                                <th className="">Rule name</th>
                                <th className="">Rule detail</th>
                                <th className="">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data &&
                                data
                                    // ?.filter((actor) => actor.fullName.toLowerCase().includes(query.toLowerCase()))
                                    .map((rule, index) => (
                                        <Rule
                                            index={index + 1}
                                            key={rule.code}
                                            code={rule.code}
                                            ruleName={rule.ruleName}
                                            ruleDetail={rule.ruleDetails}
                                            value={rule.value}
                                        />
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="border border-blue p-8 bg-background relative rounded-xl w-[450px] max-w-[662px] no-scrollbar">
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
                                <div className="text-white font-semibold text-xl">Create a rule</div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                                <div className="text-blue text-[15px]">Rule infomation</div>
                                <div className="grid grid-cols-2 gap-4">
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
                                        <label htmlFor="code" className="flex gap-1 mb-1 items-center">
                                            Code
                                            <IsRequired />
                                        </label>
                                        <input
                                            type="text"
                                            id="code"
                                            placeholder="Code . . ."
                                            {...register("code")}
                                            className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                        />
                                        {<span className="text-deepRed">{errors.code?.message}</span>}
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <label htmlFor="ruleDetails" className="flex gap-1 mb-1 items-center">
                                        Rule details
                                        <IsRequired />
                                    </label>
                                    <input
                                        type="text"
                                        id="ruleDetails"
                                        placeholder="Rule details . . ."
                                        {...register("ruleDetails")}
                                        className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                    />
                                    {<span className="text-deepRed">{errors.ruleDetails?.message}</span>}
                                </div>
                                <div className="text-blue text-[15px]">Values</div>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-5 gap-4 justify-center items-end">
                                        <div className="flex flex-col gap-2 col-span-2">
                                            <label htmlFor={`key-${index}`} className="flex gap-1 mb-1 items-center">
                                                Key
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Key . . ."
                                                id={`key-${index}`}
                                                {...register(`value.${index}.key` as const)}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:border-primary focus:border focus:border-1 border border-blue border-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 col-span-2">
                                            <label htmlFor={`value-${index}`} className="flex gap-1 mb-1 items-center">
                                                Value
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="number"
                                                id={`value-${index}`}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:border-primary focus:border focus:border-1 border border-blue border-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                                {...register(`value.${index}.value` as const)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                className="border border-1 border-blue rounded-lg py-[10px] hover:border-primary hover:bg-primary flex justify-center"
                                                type="button"
                                                onClick={() => remove(index)}
                                            >
                                                <i className="">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 32 32"
                                                        width={24}
                                                        height={24}
                                                        id="delete"
                                                    >
                                                        <path
                                                            className="fill-white"
                                                            d="M24.2,12.193,23.8,24.3a3.988,3.988,0,0,1-4,3.857H12.2a3.988,3.988,0,0,1-4-3.853L7.8,12.193a1,1,0,0,1,2-.066l.4,12.11a2,2,0,0,0,2,1.923h7.6a2,2,0,0,0,2-1.927l.4-12.106a1,1,0,0,1,2,.066Zm1.323-4.029a1,1,0,0,1-1,1H7.478a1,1,0,0,1,0-2h3.1a1.276,1.276,0,0,0,1.273-1.148,2.991,2.991,0,0,1,2.984-2.694h2.33a2.991,2.991,0,0,1,2.984,2.694,1.276,1.276,0,0,0,1.273,1.148h3.1A1,1,0,0,1,25.522,8.164Zm-11.936-1h4.828a3.3,3.3,0,0,1-.255-.944,1,1,0,0,0-.994-.9h-2.33a1,1,0,0,0-.994.9A3.3,3.3,0,0,1,13.586,7.164Zm1.007,15.151V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Zm4.814,0V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Z"
                                                        ></path>
                                                    </svg>
                                                </i>
                                            </button>
                                        </div>
                                        {
                                            <span className="text-deepRed mt-[-8px]">
                                                {errors?.value?.[index]?.key?.message}
                                            </span>
                                        }
                                    </div>
                                ))}
                                <div className="flex items-center justify-center">
                                    <button
                                        type="button"
                                        className="outline outline-1 outline-blue px-5 py-3 rounded-lg hover:outline-primary hover:bg-primary"
                                        onClick={() => append({ key: "", value: 0 })}
                                    >
                                        Add new attribute
                                    </button>
                                </div>

                                <button
                                    className="py-3 px-8 mt-3 text-base font-semibold rounded-lg border-blue border hover:border-primary hover:bg-primary"
                                    type="submit"
                                >
                                    Create rule
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Portal>
        </>
    );
}

export default Regulations;
