import axios from "~/utils/axios";
import { useState, useEffect } from "react";

function Dashboard() {
    const [yearlyRevenueData, setYearlyRevenueData] = useState<YearlyRevenueProps>();
    const [monthlyRevenueData, setMonthlyRevenueData] = useState<MonthlyRevenueProps>();

    useEffect(() => {
        (async () => {
            await axios
                .get("/reservations/511320884/revenue-report-year", {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                })
                .then((response) => {
                    setYearlyRevenueData(response.data);
                })
                .catch((err) => console.error(err));
        })();
        (async () => {
            await axios
                .get("/reservations/511320884/revenue-report-month-year", {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                })
                .then((response) => {
                    setMonthlyRevenueData(response.data);
                })
                .catch((err) => console.error(err));
        })();
    }, []);

    console.log(yearlyRevenueData);
    // console.log(monthlyRevenueData);

    return (
        <>
            <div className="flex flex-col gap-8">
                <div>
                    <h2 className="font-bold text-lg">Monthly Revenue Report</h2>
                    <div className="bg-block p-6 rounded-3xl shadow-xl mt-4">{/* <MonthRevenueReport /> */}</div>
                </div>
                <div>
                    <h2 className="font-bold text-lg">Yearly Revenue Report</h2>
                    <div className="bg-block p-6 rounded-3xl shadow-xl mt-4">
                        <div className="flex gap-8 flex-col">
                            <div className="font-semibold text-base capitalize">Year: {yearlyRevenueData?.year}</div>
                            <table className="w-full bg-block mt-4">
                                <thead>
                                    <tr className="text-center bg-primary">
                                        <th className="w-32">Index</th>
                                        <th className="">Month</th>
                                        <th className="">Flight count</th>
                                        <th className="">Revenue</th>
                                        <th className="">Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {yearlyRevenueData?.report.map((report, index) => (
                                        <tr key={report.flightCode} className="text-center">
                                            <td>{index + 1}</td>
                                            <td>{report.flightCode}</td>
                                            <td>{report.numberOfTickets}</td>
                                            <td>{report.totalRevenue}</td>
                                            <td>{report.percentage}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
