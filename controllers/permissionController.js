const Permission = require("../models/permissionModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Create a permission
const createPermission = asyncHandler(async (req, res) => {
    const newPermission = await Permission.create(req.body);
    res.json(newPermission);
});

// Create multiple permissions
const createMultiplePermissions = asyncHandler(async (req, res) => {
    const { group_id, functionality_ids } = req.body;

    // Validate input
    if (!group_id || !Array.isArray(functionality_ids) || functionality_ids.length === 0) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    // Prepare array of permissions
    const permissions = functionality_ids.map(func_id => ({
        group_id: group_id,
        functionality_id: func_id
    }));

    // Insert multiple permissions
    const newPermissions = await Permission.insertMany(permissions);
    res.json(newPermissions);
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
    createMultiplePermissions,
    getAllPermissions,
    getPermission,
    updatePermission,
    deletePermission
};
