import { useState } from "react";
import MonthRevenue from "./MonthRevenue";

const revenueReports = [
    {
        month: "January",
        ticketSales: [
            { stt: 1, flightNumber: "VN123", ticketCount: 50, revenue: 5000, rate: "80%" },
            { stt: 2, flightNumber: "VN456", ticketCount: 40, revenue: 6000, rate: "70%" }
        ]
    },
    {
        month: "February",
        ticketSales: [
            { stt: 1, flightNumber: "VN789", ticketCount: 60, revenue: 7000, rate: "85%" },
            { stt: 2, flightNumber: "VN246", ticketCount: 45, revenue: 5500, rate: "75%" }
        ]
    },
    {
        month: "March",
        ticketSales: [
            { stt: 1, flightNumber: "VN135", ticketCount: 55, revenue: 8000, rate: "90%" },
            { stt: 2, flightNumber: "VN789", ticketCount: 50, revenue: 7500, rate: "80%" }
        ]
    },
    {
        month: "April",
        ticketSales: [
            { stt: 1, flightNumber: "VN123", ticketCount: 70, revenue: 9000, rate: "95%" },
            { stt: 2, flightNumber: "VN456", ticketCount: 65, revenue: 8500, rate: "90%" }
        ]
    }
];

function MonthlyRevenueReport() {
    const [data, setData] = useState(revenueReports);
    return (
        <div className="flex gap-8 flex-col">
            {data.map((revenue) => (
                <MonthRevenue key={revenue.month} month={revenue.month} ticketSales={revenue.ticketSales} />
            ))}
        </div>
    );
}

export default MonthlyRevenueReport;
