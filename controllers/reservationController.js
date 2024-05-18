const asyncHandler = require('express-async-handler');

const Flight = require('../models/flightModel');

const Reservation = require('../models/reservationModel')

const revenueReportByMonthYear = asyncHandler(async (req, res) => {
    try {
        const { month, year } = req.body;
        const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;
        const targetYear = year ? parseInt(year) : new Date().getFullYear();

        const report = [];

        // Tìm các chuyến bay trong tháng và năm cụ thể
        const flights = await Flight.find({
            departure_datetime: {
                $gte: new Date(targetYear, targetMonth - 1, 1),
                $lt: new Date(targetYear, targetMonth, 1)
            }
        });

        // Nhóm các chuyến bay theo flight_code
        const flightGroups = flights.reduce((groups, flight) => {
            const flightCode = flight.flight_code;
            if (!groups[flightCode]) {
                groups[flightCode] = [];
            }
            groups[flightCode].push(flight);
            return groups;
        }, {});

        // Tính tổng doanh thu của tất cả các chuyến bay trong tháng và năm cụ thể
        let totalRevenueForMonth = 0;

        for (const flightCode in flightGroups) {
            const flightsInGroup = flightGroups[flightCode];
            let groupRevenue = 0;

            for (const flight of flightsInGroup) {
                const reservations = await Reservation.find({ flight_id: flight._id });

                const totalRevenue = reservations.reduce((acc, curr) => acc + curr.price, 0);
                groupRevenue += totalRevenue;
            }

            totalRevenueForMonth += groupRevenue;
        }

        // Duyệt qua từng nhóm chuyến bay để tính toán số vé, doanh thu và tỷ lệ phần trăm
        for (const flightCode in flightGroups) {
            const flightsInGroup = flightGroups[flightCode];
            let numberOfTickets = 0;
            let groupRevenue = 0;

            for (const flight of flightsInGroup) {
                const reservations = await Reservation.find({ flight_id: flight._id });

                numberOfTickets += reservations.length;
                groupRevenue += reservations.reduce((acc, curr) => acc + curr.price, 0);
            }

            const percentage = totalRevenueForMonth ? ((groupRevenue / totalRevenueForMonth) * 100).toFixed(2) : 0;

            report.push({
                flightCode,
                numberOfTickets,
                totalRevenue: groupRevenue,
                percentage
            });
        }

        res.status(200).json({ month: targetMonth, year: targetYear, report });
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate revenue report', error: error.message });
    }
});

const revenueReportByYear = asyncHandler(async (req, res) => {
    try {
        const { year } = req.body;
        const targetYear = year ? parseInt(year) : new Date().getFullYear();

        const report = [];

        // Tìm các chuyến bay trong năm cụ thể
        const flights = await Flight.find({
            departure_datetime: {
                $gte: new Date(targetYear, 0, 1),
                $lt: new Date(targetYear + 1, 0, 1)
            }
        });

        // Nhóm các chuyến bay theo flight_code
        const flightGroups = flights.reduce((groups, flight) => {
            const flightCode = flight.flight_code;
            if (!groups[flightCode]) {
                groups[flightCode] = [];
            }
            groups[flightCode].push(flight);
            return groups;
        }, {});

        // Tính tổng doanh thu của tất cả các chuyến bay trong năm cụ thể
        let totalRevenueForYear = 0;

        for (const flightCode in flightGroups) {
            const flightsInGroup = flightGroups[flightCode];
            let groupRevenue = 0;

            for (const flight of flightsInGroup) {
                const reservations = await Reservation.find({ flight_id: flight._id });

                const totalRevenue = reservations.reduce((acc, curr) => acc + curr.price, 0);
                groupRevenue += totalRevenue;
            }

            totalRevenueForYear += groupRevenue;
        }

        // Duyệt qua từng nhóm chuyến bay để tính toán số vé, doanh thu và tỷ lệ phần trăm
        for (const flightCode in flightGroups) {
            const flightsInGroup = flightGroups[flightCode];
            let numberOfTickets = 0;
            let groupRevenue = 0;

            for (const flight of flightsInGroup) {
                const reservations = await Reservation.find({ flight_id: flight._id });

                numberOfTickets += reservations.length;
                groupRevenue += reservations.reduce((acc, curr) => acc + curr.price, 0);
            }

            const percentage = totalRevenueForYear ? ((groupRevenue / totalRevenueForYear) * 100).toFixed(2) : 0;

            report.push({
                flightCode,
                numberOfTickets,
                totalRevenue: groupRevenue,
                percentage
            });
        }

        res.status(200).json({ year: targetYear, report });
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate revenue report', error: error.message });
    }
});



module.exports = {
    revenueReportByMonthYear,
    revenueReportByYear
};
