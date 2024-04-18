const Airport = require("../models/airportModel");
const Flight = require("../models/flightModel");
const Rule = require('../models/ruleModel');
const asyncHandler = require("express-async-handler");

const createFlight = asyncHandler(async (req, res) => {
    const flightData = req.body;
    // Kiểm tra thời gian bay tối thiểu là 30 phút
    const ruleFlight = await Rule.findOne({ _id: flightData?.rules[0]?.rule_id });
    if (flightData.duration < ruleFlight?.value?.min_duration) {
        return res.status(400).json({ message: `The minimum flight time must be ${ruleFlight?.value?.min_duration} minutes` });
    }
    // Kiểm tra số lượng sân bay trung gian và thời gian dừng
    if (flightData?.transit_airports?.length > ruleFlight?.value?.max_transit_airport) {
        return res.status(400).json({ message: `Only a maximum of ${ruleFlight?.value?.max_transit_airport} intermediary airports` });
    }
    if (flightData?.transit_airports) {
        for (const airport of flightData.transit_airports) {
            const ruleStopDuration = await Rule.findOne({ _id: airport.rule_id });
            if (airport.stop_duration < ruleStopDuration?.value?.min || airport.stop_duration > ruleStopDuration?.value?.max) {
                const transit_airport = await Airport.findOne({ _id: airport?.airport_id });
                return res.status(400).json({ message: `The stop time at ${transit_airport.name} must be from ${ruleStopDuration?.value?.min} to ${ruleStopDuration?.value?.max} minutes` });
            }
        }
    }
    try {
        const flight = await Flight.create(flightData);
        res.status(201).json(flight);
    } catch (error) {
        res.status(500).json({ message: "Failed to create flight", error: error.message });
    }
});


const getAllFlights = asyncHandler(async (req, res) => {
    try {
        const flights = await Flight.find();
        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch flights", error: error.message });
    }
});

const getFlightById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const flight = await Flight.findById(id);
        if (!flight) {
            return res.status(404).json({ message: "Flight not found" });
        }
        res.status(200).json(flight);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch flight", error: error.message });
    }
});

const updateFlight = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const flightData = req.body;
    try {
        const flight = await Flight.findOne({ _id: id });

        if (!flight) {
            return res.status(404).json({ message: "Flight not found" });
        }

        if (flightData?.rules) {
            // Kiểm tra thời gian bay tối thiểu
            const ruleFlight = await Rule.findOne({ _id: flightData?.rules[0]?.rule_id });
            if (flight?.duration < ruleFlight?.value?.min_duration) {
                return res.status(400).json({ message: `The minimum flight time must be ${ruleFlight?.value?.min_duration} minutes` });
            }
            // Kiểm tra số lượng sân bay trung gian và thời gian dừng
            if (flight?.transit_airports?.length > ruleFlight?.value?.max_transit_airport) {
                return res.status(400).json({ message: `Only a maximum of ${ruleFlight?.value?.max_transit_airport} intermediary airports` });
            }
        } else if (flightData?.duration) {
            // Kiểm tra thời gian bay tối thiểu
            const ruleFlight = await Rule.findOne({ _id: flight?.rules[0]?.rule_id });
            if (flightData.duration < ruleFlight?.value?.min_duration) {
                return res.status(400).json({ message: `The minimum flight time must be ${ruleFlight?.value?.min_duration} minutes` });
            }
        }

        if (flightData?.transit_airports) {
            const ruleFlight = await Rule.findOne({ _id: flight?.rules[0]?.rule_id });
            // Kiểm tra số lượng sân bay trung gian và thời gian dừng
            if (flightData?.transit_airports?.length > ruleFlight?.value?.max_transit_airport) {
                return res.status(400).json({ message: `Only a maximum of ${ruleFlight?.value?.max_transit_airport} intermediary airports` });
            }
            for (const [index, airport] of flightData.transit_airports.entries()) {
                const rule_id = airport.rule_id ? airport.rule_id : flight?.rules[index]?.rule_id;
                const ruleStopDuration = await Rule.findOne({ _id: rule_id });
                if (airport.stop_duration < ruleStopDuration?.value?.min || airport.stop_duration > ruleStopDuration?.value?.max) {
                    const transit_airport = await Airport.findOne({ _id: airport?.airport_id });
                    return res.status(400).json({ message: `The stop time at ${transit_airport.name} must be from ${ruleStopDuration?.value?.min} to ${ruleStopDuration?.value?.max} minutes` });
                }
            }
        }

        const updatedFlight = await Flight.findByIdAndUpdate(id, flightData, { new: true });
        res.status(200).json(updatedFlight);
    } catch (error) {
        res.status(500).json({ message: "Failed to update flight", error: error.message });
    }
});

const updateSeatCountById = asyncHandler(async (req, res) => {
    const { flight_id, seat_id } = req.params;
    const { count } = req.body;
    try {
        const flight = await Flight.findOne({ "_id": flight_id, "seats._id": seat_id });
        if (!flight) {
            return res.status(404).json({ message: "Flight or seat not found" });
        }
        const seat = flight.seats.find(s => s._id == seat_id);
        if (!seat) {
            return res.status(404).json({ message: "Seat not found in flight" });
        }
        if (count < 0 || count < seat.booked_seats) {
            return res.status(400).json({ message: "Invalid seat count" });
        }
        seat.count = count;
        await flight.save();
        res.status(200).json(flight);
    } catch (error) {
        res.status(500).json({ message: "Failed to update seat count", error: error.message });
    }
});



const deleteFlight = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const flight = await Flight.findByIdAndDelete(id);
        if (!flight) {
            return res.status(404).json({ message: "Flight not found" });
        }
        res.status(200).json({ message: "Flight deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete flight", error: error.message });
    }
});

module.exports = {
    createFlight,
    getAllFlights,
    getFlightById,
    updateFlight,
    updateSeatCountById,
    deleteFlight
};
