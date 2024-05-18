const Airport = require("../models/airportModel");
const Flight = require("../models/flightModel");
const Rule = require('../models/ruleModel');
const asyncHandler = require("express-async-handler");

const createFlight = asyncHandler(async (req, res) => {
    const flightData = req.body;
    // Kiểm tra thời gian bay tối thiểu là 30 phút
    const ruleFlightTime = await Rule.findOne({ _id: flightData?.rules?.regulation_1?.flight_time });
    const ruleIntermediary = await Rule.findOne({ _id: flightData?.rules?.regulation_1?.intermediate });
    const min_flight_time = ruleFlightTime?.values?.min_flight_time;

    if (flightData.duration < min_flight_time) {
        return res.status(400).json({ message: `The minimum flight time must be ${min_flight_time} minutes` });
    }
    // Kiểm tra số lượng sân bay trung gian và thời gian dừng
    if (flightData?.transit_airports?.length > ruleIntermediary?.values?.max_transit_airports) {
        return res.status(400).json({ message: `Only a maximum of ${ruleIntermediary?.values?.max_transit_airports} intermediary airports` });
    }
    if (flightData?.transit_airports) {
        for (const airport of flightData.transit_airports) {
            if (airport.stop_duration < ruleIntermediary?.values?.min || airport.stop_duration > ruleIntermediary?.values?.max) {
                const transit_airport = await Airport.findOne({ _id: airport?.airport_id });
                return res.status(400).json({ message: `The stop time at ${transit_airport.name} must be from ${ruleIntermediary?.values?.min} to ${ruleIntermediary?.values?.max} minutes` });
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
        const flights = await Flight.find().populate('departure_airport', 'code name country address')
                                           .populate('destination_airport', 'code name country address')
                                           .populate('transit_airports.airport_id', 'code name country address')
                                           .populate('rules.regulation_1.flight_time', 'values')
                                           .populate('rules.regulation_1.intermediate', 'values')
                                           .populate('rules.regulation_2.tickets', 'values')
                                           .populate('rules.regulation_3.booking', 'values')
        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch flights", error: error.message });
    }
});

const getFlightById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const flight = await Flight.findById(id).populate('departure_airport', 'code name country address')
                                                .populate('destination_airport', 'code name country address')
                                                .populate('transit_airports.airport_id', 'code name country address')
                                                .populate('rules.regulation_1.flight_time', 'values')
                                                .populate('rules.regulation_1.intermediate', 'values')
                                                .populate('rules.regulation_2.tickets', 'values')
                                                .populate('rules.regulation_3.booking', 'values')
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
            return  res.status(400).json({ message: `not found` });
        } 

        const ruleFlightTime = await Rule.findOne({ _id: flightData?.rules?.regulation_1?.flight_time });
        const ruleIntermediary = await Rule.findOne({ _id: flightData?.rules?.regulation_1?.intermediate });
        const min_flight_time = ruleFlightTime?.values?.min_flight_time;

        if (flightData.duration < min_flight_time) {
            return res.status(400).json({ message: `The minimum flight time must be ${min_flight_time} minutes` });
        }
        // Kiểm tra số lượng sân bay trung gian và thời gian dừng
        if (flightData?.transit_airports?.length > ruleIntermediary?.values?.max_transit_airports) {
            return res.status(400).json({ message: `Only a maximum of ${ruleIntermediary?.values?.max_transit_airports} intermediary airports` });
        }
        if (flightData?.transit_airports) {
            for (const airport of flightData.transit_airports) {
                if (airport.stop_duration < ruleIntermediary?.values?.min || airport.stop_duration > ruleIntermediary?.values?.max) {
                    const transit_airport = await Airport.findOne({ _id: airport?.airport_id });
                    return res.status(400).json({ message: `The stop time at ${transit_airport.name} must be from ${ruleIntermediary?.values?.min} to ${ruleIntermediary?.values?.max} minutes` });
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

const bookingSeetById = asyncHandler(async (req, res) => {
    const { flight_id, seat_id } = req.params;
    const { booked_seats } = req.body;
    try {
        const flight = await Flight.findOne({ "_id": flight_id, "seats._id": seat_id });
        if (!flight) {
            return res.status(404).json({ message: "Flight or seat not found" });
        }
        const seat = flight.seats.find(s => s._id == seat_id);
        if (!seat) {
            return res.status(404).json({ message: "Seat not found in flight" });
        }
        if (booked_seats < 0 || booked_seats > seat.count) {
            return res.status(400).json({ message: "Invalid booking seats" });
        }
        seat.booked_seats = booked_seats;
        await flight.save();
        res.status(200).json(flight);
    } catch (error) {
        res.status(500).json({ message: "Failed to booking", error: error.message });
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
