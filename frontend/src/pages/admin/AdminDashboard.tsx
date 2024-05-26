import axios from "~/utils/axios";
import { useState, useEffect } from "react";
import Tippy from "@tippyjs/react/headless";
import getMonthName from "~/utils/getMonthName";
import { useAppSelector } from "~/hook";
import checkPermission from "~/utils/checkPermission";

function AdminDashboard() {
    const [yearlyRevenueData, setYearlyRevenueData] = useState<YearlyRevenueProps>();
    const [monthlyRevenueData, setMonthlyRevenueData] = useState<MonthlyRevenueProps>();

    const [reportType, setReportType] = useState("Month and year");
    const [reportTypeVisible, setReportTypeVisible] = useState(false);

    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [monthVisible, setMonthVisible] = useState(false);

    const [year, setYear] = useState(new Date().getFullYear());
    const [yearVisible, setYearVisible] = useState(false);

    const monthIndexes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const yearIndexes = [2024, 2025, 2026];

    const { permissions } = useAppSelector((state) => state.permissions!);

    useEffect(() => {
        if (checkPermission(permissions, "511320884")) {
            (async () => {
                await axios
                    .get("/reservations/511320884/revenue-report-year", {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`,
                            "Content-Type": "application/json"
                        },
                        params: {
                            year
                        }
                    })
                    .then((response) => {
                        setYearlyRevenueData(response.data);
                    })
                    .catch((err) => console.error(err));
            })();
        }
        if (checkPermission(permissions, "511320884")) {
            (async () => {
                await axios
                    .get("/reservations/511320884/revenue-report-month-year", {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`,
                            "Content-Type": "application/json"
                        },
                        params: {
                            month,
                            year
                        }
                    })
                    .then((response) => {
                        setMonthlyRevenueData(response.data);
                    })
                    .catch((err) => console.error(err));
            })();
        }
    }, [month, year, permissions]);

    return (
        <>
            {checkPermission(permissions, "511320884") && checkPermission(permissions, "511320884") ? (
                <div className="flex flex-col gap-2">
                    <div className="flex gap-4">
                        <div>
                            <Tippy
                                interactive
                                onClickOutside={() => setReportTypeVisible(!reportTypeVisible)}
                                visible={reportTypeVisible}
                                offset={[0, 0]}
                                placement="bottom"
                                render={(attrs) => (
                                    <div
                                        {...attrs}
                                        className={`flex text-white p-2 rounded-bl-xl w-[280px] rounded-br-xl flex-col bg-background border-1 border-border border justify-center ${
                                            reportTypeVisible ? "border-primary border-t-0" : ""
                                        }`}
                                    >
                                        <div
                                            onClick={() => {
                                                setReportType("Month and year");
                                                setReportTypeVisible(false);
                                            }}
                                            className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-xl ${
                                                reportType === "Month and year" ? "text-blue pointer-events-none" : ""
                                            }`}
                                        >
                                            Month and year
                                        </div>
                                        <div
                                            onClick={() => {
                                                setReportType("Year");
                                                setReportTypeVisible(false);
                                            }}
                                            className={`cursor-pointer py-3 px-4 hover:bg-primary text-left rounded-xl ${
                                                reportType === "Year" ? "text-blue pointer-events-none" : ""
                                            }`}
                                        >
                                            Year
                                        </div>
                                    </div>
                                )}
                            >
                                <div
                                    tabIndex={-1}
                                    onClick={() => setReportTypeVisible(!reportTypeVisible)}
                                    className={`hover:border-primary py-3 px-4 border-blue border-1 w-[280px] border bg-background cursor-pointer ${
                                        reportTypeVisible ? "rounded-tl-xl rounded-tr-xl border-primary" : "rounded-xl"
                                    }   flex justify-between items-center`}
                                >
                                    {reportType === "Year" ? "Report by: Year" : "Report by: Month and year"}
                                    <i className={`${reportTypeVisible ? "rotate-180" : ""}`}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 16 16"
                                            id="chevron-down"
                                        >
                                            <path
                                                fill="#fff"
                                                d="M4.14645,5.64645 C4.34171,5.45118 4.65829,5.45118 4.85355,5.64645 L7.9999975,8.79289 L11.1464,5.64645 C11.3417,5.45118 11.6583,5.45118 11.8536,5.64645 C12.0488,5.84171 12.0488,6.15829 11.8536,6.35355 L8.35355,9.85355 C8.15829,10.0488 7.84171,10.0488 7.64645,9.85355 L4.14645,6.35355 C3.95118,6.15829 3.95118,5.84171 4.14645,5.64645 Z"
                                            ></path>
                                        </svg>
                                    </i>
                                </div>
                            </Tippy>
                        </div>
                        {reportType === "Month and year" && (
                            <div>
                                <Tippy
                                    visible={monthVisible}
                                    interactive
                                    onClickOutside={() => setMonthVisible(false)}
                                    offset={[0, 0]}
                                    placement="bottom"
                                    render={(attrs) => (
                                        <ul
                                            className={`border border-primary rounded-xl p-2 w-[200px] bg-background ${
                                                monthVisible ? "border-t-0 rounded-tl-none rounded-tr-none" : ""
                                            }`}
                                            {...attrs}
                                        >
                                            {monthIndexes.map((monthIndex) => (
                                                <li
                                                    onClick={() => {
                                                        setMonth(monthIndex);
                                                        setMonthVisible(false);
                                                    }}
                                                    key={monthIndex}
                                                    className={`cursor-pointer py-2 px-4 hover:bg-primary text-left rounded-xl flex items-center p-2 ${
                                                        month === monthIndex ? "text-blue pointer-events-none" : ""
                                                    }`}
                                                >
                                                    {getMonthName(monthIndex)}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                >
                                    <div
                                        className={`hover:border-primary py-3 px-4 border-blue border bg-background cursor-pointer w-[200px] ${
                                            monthVisible ? "rounded-tl-xl rounded-tr-xl border-primary" : "rounded-xl"
                                        }   flex justify-between items-center`}
                                        onClick={() => setMonthVisible(!monthVisible)}
                                    >
                                        Month: {getMonthName(month)}
                                        <i className={`${monthVisible ? "rotate-180" : ""}`}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 16 16"
                                                id="chevron-down"
                                            >
                                                <path
                                                    fill="#fff"
                                                    d="M4.14645,5.64645 C4.34171,5.45118 4.65829,5.45118 4.85355,5.64645 L7.9999975,8.79289 L11.1464,5.64645 C11.3417,5.45118 11.6583,5.45118 11.8536,5.64645 C12.0488,5.84171 12.0488,6.15829 11.8536,6.35355 L8.35355,9.85355 C8.15829,10.0488 7.84171,10.0488 7.64645,9.85355 L4.14645,6.35355 C3.95118,6.15829 3.95118,5.84171 4.14645,5.64645 Z"
                                                ></path>
                                            </svg>
                                        </i>
                                    </div>
                                </Tippy>
                            </div>
                        )}
                        <div>
                            <Tippy
                                visible={yearVisible}
                                interactive
                                onClickOutside={() => setYearVisible(false)}
                                offset={[0, 0]}
                                placement="bottom"
                                render={(attrs) => (
                                    <ul
                                        className={`border border-primary rounded-xl p-2 w-[140px] bg-background ${
                                            yearVisible ? "border-t-0 rounded-tl-none rounded-tr-none" : ""
                                        }`}
                                        {...attrs}
                                    >
                                        {yearIndexes.map((yearIndex) => (
                                            <li
                                                onClick={() => {
                                                    setYear(yearIndex);
                                                    setYearVisible(false);
                                                }}
                                                key={yearIndex}
                                                className={`cursor-pointer py-2 px-4 hover:bg-primary text-left rounded-xl flex items-center p-2 ${
                                                    year === yearIndex ? "text-blue pointer-events-none" : ""
                                                }`}
                                            >
                                                {yearIndex}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            >
                                <div
                                    className={`hover:border-primary py-3 px-4 border-blue border bg-background cursor-pointer w-[140px] ${
                                        yearVisible ? "rounded-tl-xl rounded-tr-xl border-primary" : "rounded-xl"
                                    }   flex justify-between items-center`}
                                    onClick={() => setYearVisible(!yearVisible)}
                                >
                                    Year: {year}
                                    <i className={`${yearVisible ? "rotate-180" : ""}`}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 16 16"
                                            id="chevron-down"
                                        >
                                            <path
                                                fill="#fff"
                                                d="M4.14645,5.64645 C4.34171,5.45118 4.65829,5.45118 4.85355,5.64645 L7.9999975,8.79289 L11.1464,5.64645 C11.3417,5.45118 11.6583,5.45118 11.8536,5.64645 C12.0488,5.84171 12.0488,6.15829 11.8536,6.35355 L8.35355,9.85355 C8.15829,10.0488 7.84171,10.0488 7.64645,9.85355 L4.14645,6.35355 C3.95118,6.15829 3.95118,5.84171 4.14645,5.64645 Z"
                                            ></path>
                                        </svg>
                                    </i>
                                </div>
                            </Tippy>
                        </div>
                    </div>
                    {reportType === "Year" ? (
                        <div>
                            <div className="text-lg font-semibold mt-4">{year} Revenue Report</div>
                            <div className="bg-block p-6 rounded-3xl shadow-xl mt-4">
                                <div className="flex gap-6 flex-col">
                                    <table className="w-full bg-block">
                                        <thead>
                                            <tr className="text-center bg-primary">
                                                <th className="">Index</th>
                                                <th className="">Month</th>
                                                <th className="">Number of flights</th>
                                                <th className="">Total of revenue</th>
                                                <th className="">Percentage of revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {yearlyRevenueData?.report.map((report, index) => (
                                                <tr key={report.month} className="text-center">
                                                    <td>{index + 1}</td>
                                                    <td>{getMonthName(report.month)}</td>
                                                    <td>{report.numberOfFlights}</td>
                                                    <td>{report.totalRevenue} USD</td>
                                                    <td>{report.percentage}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="text-lg font-semibold mt-4">
                                {getMonthName(month)} {year} Revenue Report
                            </div>
                            <div className="bg-block p-6 rounded-3xl shadow-xl mt-4">
                                <div className="flex gap-6 flex-col">
                                    <table className="w-full bg-block">
                                        <thead>
                                            <tr className="text-center bg-primary">
                                                <th className="">Index</th>
                                                <th className="">Flight code</th>
                                                <th className="">Number of tickets</th>
                                                <th className="">Revenue</th>
                                                <th className="">Percentage of revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {monthlyRevenueData?.report.map((report, index) => (
                                                <tr key={report.flightCode} className="text-center">
                                                    <td>{index + 1}</td>
                                                    <td>{report.flightCode}</td>
                                                    <td>{report.numberOfTickets}</td>
                                                    <td>{report.totalRevenue} USD</td>
                                                    <td>{report.percentage}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                "You don't have permission to access this page."
            )}
        </>
    );
}

export default AdminDashboard;
