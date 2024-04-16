import { useState } from "react";
import YearlyRevenue from "./YearlyRevenue";

const yearlyRevenueReports = [
    {
        year: 2022,
        monthlyRevenue: [
            { stt: 1, month: "January", flightCount: 20, revenue: 20000, rate: "80%" },
            { stt: 2, month: "February", flightCount: 25, revenue: 25000, rate: "85%" }
            // Add more monthly revenue data for 2022
        ]
    },
    {
        year: 2023,
        monthlyRevenue: [
            { stt: 1, month: "January", flightCount: 30, revenue: 30000, rate: "75%" },
            { stt: 2, month: "February", flightCount: 28, revenue: 28000, rate: "80%" }
            // Add more monthly revenue data for 2023
        ]
    },
    {
        year: 2024,
        monthlyRevenue: [
            { stt: 1, month: "January", flightCount: 35, revenue: 35000, rate: "70%" },
            { stt: 2, month: "February", flightCount: 32, revenue: 32000, rate: "75%" }
            // Add more monthly revenue data for 2024
        ]
    }
];

function YearlyRevenueReport() {
    const [data, setData] = useState(yearlyRevenueReports);
    return (
        <div className="flex gap-8 flex-col">
            {data.map((revenue) => (
                <YearlyRevenue key={revenue.year} year={revenue.year} monthlyRevenue={revenue.monthlyRevenue} />
            ))}
        </div>
    );
}

export default YearlyRevenueReport;
