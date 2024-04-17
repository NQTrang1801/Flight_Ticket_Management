const Airport = require('../models/airportModel');
const asyncHandler = require('express-async-handler');

// Kiểm tra số lượng sân bay đã tạo
const checkAirportCount = asyncHandler(async (req, res, next) => {
    try {
        const airportCount = await Airport.countDocuments();
        if (airportCount >= 10) {
            return res.status(400).json({ message: "Số lượng sân bay đã đạt tối đa" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Failed to check airport count", error: error.message });
    }
});

// Tạo sân bay mới
const createAirport = asyncHandler(async (req, res) => {
    const airportData = req.body;
    try {
        const airport = await Airport.create(airportData);
        res.status(201).json(airport);
    } catch (error) {
        res.status(500).json({ message: "Failed to create airport", error: error.message });
    }
});

// Lấy thông tin của một sân bay
const getAirportById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const airport = await Airport.findById(id);
        if (!airport) {
            res.status(404).json({ message: "Airport not found" });
        } else {
            res.status(200).json(airport);
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch airport", error: error.message });
    }
});

// Lấy tất cả các sân bay
const getAllAirports = asyncHandler(async (req, res) => {
    try {
        const airports = await Airport.find();
        res.status(200).json(airports);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch airports", error: error.message });
    }
});

// Xóa sân bay
const deleteAirport = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const airport = await Airport.findByIdAndDelete(id);
        if (!airport) {
            res.status(404).json({ message: "Airport not found" });
        } else {
            res.status(200).json({ message: "Airport deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete airport", error: error.message });
    }
});

// Cập nhật trạng thái sân bay
const updateAirportStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const airport = await Airport.findByIdAndUpdate(id, { status }, { new: true });
        if (!airport) {
            res.status(404).json({ message: "Airport not found" });
        } else {
            res.status(200).json(airport);
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update airport status", error: error.message });
    }
});

// Cập nhật tất cả thông tin của sân bay
const updateAirport = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const airportData = req.body;
    try {
        const airport = await Airport.findByIdAndUpdate(id, airportData, { new: true });
        if (!airport) {
            res.status(404).json({ message: "Airport not found" });
        } else {
            res.status(200).json(airport);
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update airport", error: error.message });
    }
});

module.exports = { checkAirportCount, createAirport, getAirportById, getAllAirports, deleteAirport, updateAirportStatus, updateAirport };
