const Functionality = require("../models/functionalityModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Create a permission
const getAllFunctions = asyncHandler(async (req, res) => {
    try {
        const functions = await Functionality.find();
        res.json(functions);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    getAllFunctions
};
