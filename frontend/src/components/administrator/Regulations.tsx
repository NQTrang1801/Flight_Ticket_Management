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
import Regulation from "~/components/administrator/Regulation";

const schema = yup.object().shape({
    ruleName: yup.string().required("Rule name is required."),
    detail: yup.string().required("Rule detail is required."),
    code: yup.string().required("Code is required."),
    values: yup
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
    const [data, setData] = useState<RuleData[]>();
    const { Portal, hide } = usePortal({
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
        name: "values"
    });

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<RuleValidation> = async (formData) => {
        hide();
        dispatch(startLoading());

        const ruleName = formData.ruleName;
        const detail = formData.detail;
        const code = formData.code;
        const arrValue = formData.values;
        let values: ValueObject;

        if (arrValue.length === 1) {
            values = { [arrValue[0].key]: arrValue[0].value };
        } else {
            values = arrValue.reduce((obj: ValueObject, item) => {
                obj[item.key] = item.value;
                return obj;
            }, {});
        }

        (async () => {
            axios
                .post(
                    "/rule/511454340/add-update-rule",
                    {
                        ruleName,
                        detail,
                        code,
                        values
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
                    dispatch(sendMessage("Created sucessfully!", "success"));
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                })
                .catch((error) => {
                    dispatch(stopLoading());
                    dispatch(sendMessage("Created failed!", "error"));
                    console.error(error);
                });
        })();
    };

    useEffect(() => {
        (async () => {
            try {
                const showsResponse = await axios.get("rule/511320340/all", {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                });
                setData(showsResponse.data);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    // console.log(data);

    return (
        <>
            <div className="bg-block p-6 rounded-3xl shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                    {data &&
                        data
                            // ?.filter((actor) => actor.fullName.toLowerCase().includes(query.toLowerCase()))
                            .map((rule) => (
                                <Regulation
                                    key={rule.code}
                                    _id={rule._id}
                                    code={rule.code}
                                    ruleName={rule.ruleName}
                                    ruleDetail={rule.detail}
                                    value={rule.values}
                                />
                            ))}
                </div>
            </div>
            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="border border-blue p-8 bg-background relative rounded-xl w-[500px] max-w-[662px] no-scrollbar">
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
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex gap-2 col-span-2 flex-col">
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
                                        Rule detail
                                        <IsRequired />
                                    </label>
                                    <input
                                        type="text"
                                        id="ruleDetails"
                                        placeholder="Rule detail . . ."
                                        {...register("detail")}
                                        className="bg-[rgba(141,124,221,0.1)] text-sm focus:outline-primary focus:outline focus:outline-1 outline outline-blue outline-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                    />
                                    {<span className="text-deepRed">{errors.detail?.message}</span>}
                                </div>
                                <div className="text-blue text-[15px]">Values</div>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-5 gap-4 justify-center items-end">
                                        <div className="flex flex-col gap-2 col-span-3">
                                            <label htmlFor={`key-${index}`} className="flex gap-1 mb-1 items-center">
                                                Key
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Key . . ."
                                                id={`key-${index}`}
                                                {...register(`values.${index}.key` as const)}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:border-primary focus:border focus:border-1 border border-blue border-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor={`value-${index}`} className="flex gap-1 mb-1 items-center">
                                                Value
                                                <IsRequired />
                                            </label>
                                            <input
                                                type="number"
                                                id={`value-${index}`}
                                                className="bg-[rgba(141,124,221,0.1)] text-sm focus:border-primary focus:border focus:border-1 border border-blue border-1 text-white px-4 py-3 rounded-lg placeholder:text-disabled"
                                                {...register(`values.${index}.value` as const)}
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
                                                {errors?.values?.[index]?.key?.message}
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
