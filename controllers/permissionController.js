const Permission = require("../models/permissionModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Create a permission
const createPermission = asyncHandler(async (req, res) => {
    const newPermission = await Permission.create(req.body);
    res.json(newPermission);
});

// Get all permissions
const getAllPermissions = asyncHandler(async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.json(permissions);
    } catch (error) {
        throw new Error(error);
    }
});

// Get a single permission
const getPermission = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const permission = await Permission.findById(id);
        res.json(permission);
    } catch (error) {
        throw new Error(error);
    }
});

// Update a permission
const updatePermission = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const updatedPermission = await Permission.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        res.json(updatedPermission);
    } catch (error) {
        throw new Error(error);
    }
});

// Delete a permission
const deletePermission = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deletedPermission = await Permission.findByIdAndDelete(id);
        res.json(deletedPermission);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createPermission,
    getAllPermissions,
    getPermission,
    updatePermission,
    deletePermission
};
