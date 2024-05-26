import React from "react";
import { useState } from "react";
import AdminRegulationUpdating from "./AdminRegulationUpdating";
import { useAppSelector } from "~/hook";
import checkPermission from "~/utils/checkPermission";

interface RuleProps {
    code: string;
    ruleName: string;
    ruleDetail: string;
    value: ValueObject;
    _id: string;
}

const AdminRegulation: React.FC<RuleProps> = ({ code, ruleName, ruleDetail, value }) => {
    const [updatingMode, setUpdatingMode] = useState(false);
    const { permissions } = useAppSelector((state) => state.permissions!);

    return (
        <>
            <div className="p-6 rounded-xl overflow-hidden shadow-xl border border-primary bg-background relative">
                <div className="absolute top-0 left-0 right-0 p-2 text-center font-semibold text-base bg-primary">
                    Regulation
                </div>
                {checkPermission(permissions, "511454340") && code !== "R2" && (
                    <div className="absolute top-14 right-6 flex gap-2">
                        <button
                            onClick={() => {
                                setUpdatingMode(!updatingMode);
                            }}
                            className="hover:bg-primary hover:border-primary rounded-lg border border-blue flex items-center justify-center p-1"
                        >
                            <i className="">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width={24}
                                    height={24}
                                    id="edit"
                                >
                                    <path
                                        className="fill-white"
                                        d="M5,18H9.24a1,1,0,0,0,.71-.29l6.92-6.93h0L19.71,8a1,1,0,0,0,0-1.42L15.47,2.29a1,1,0,0,0-1.42,0L11.23,5.12h0L4.29,12.05a1,1,0,0,0-.29.71V17A1,1,0,0,0,5,18ZM14.76,4.41l2.83,2.83L16.17,8.66,13.34,5.83ZM6,13.17l5.93-5.93,2.83,2.83L8.83,16H6ZM21,20H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"
                                    ></path>
                                </svg>
                            </i>
                        </button>
                    </div>
                )}
                <div className="flex flex-col gap-2 mt-8">
                    <div>
                        <span className="font-semibold">Name</span>: {ruleName}
                    </div>
                    <div>
                        <span className="font-semibold">Code</span>: {code}
                    </div>
                    <div>
                        <span className="font-semibold">Detail</span>: {ruleDetail}
                    </div>
                    {code !== "R2" ? (
                        <div>
                            <span className="font-semibold">Values</span>:
                            <table className="w-full mt-4 bg-block">
                                <thead>
                                    <tr className="text-center bg-primary">
                                        <th className="">Index</th>
                                        <th className="">Variable name</th>
                                        <th className="">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(value).map(([key, val], index) => (
                                        <tr key={key} className="text-center">
                                            <td>{index + 1}</td>
                                            <td>{key}</td>
                                            <td>{val}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div>
                            <span className="font-semibold">Values</span>:
                            <table className="w-full mt-4 bg-block">
                                <thead>
                                    <tr className="text-center bg-primary">
                                        <th className="">Index</th>
                                        <th className="">Variable name</th>
                                        <th className="">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-center">
                                        <td>1</td>
                                        <td>sell_only_available_seats</td>
                                        <td>{value.sell_only_available_seats === true ? "True" : "False"}</td>
                                    </tr>
                                    <tr className="text-center">
                                        <td>2</td>
                                        <td>separate_ticket_prices</td>
                                        <td>{value.separate_ticket_prices === true ? "True" : "False"}</td>
                                    </tr>
                                    <tr className="text-center">
                                        <td>3</td>
                                        <td>ticket_classes</td>
                                        <td>
                                            {value.ticket_classes["1"].price_multiplier},{" "}
                                            {value.ticket_classes["2"].price_multiplier}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            {updatingMode && (
                <AdminRegulationUpdating ruleName={ruleName} detail={ruleDetail} values={value} code={code} />
            )}
        </>
    );
};

export default AdminRegulation;
