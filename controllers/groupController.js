const Group = require("../models/groupModel");
const Permission = require("../models/permissionModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Create a group
const createGroup = asyncHandler(async (req, res) => {
    const newGroup = await Group.create(req.body);
    res.json(newGroup);
});

// Get all groups
const getAllGroups = asyncHandler(async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (error) {
        throw new Error(error);
    }
});

// Get a single group
const getGroup = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const group = await Group.findById(id);
        res.json(group);
    } catch (error) {
        throw new Error(error);
    }
});

// Update a group
const updateGroup = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const group = await Group.findOneAndUpdate(
            { _id: id, groupCode: { $nin: ["000", "999"] } },
            req.body,
            { new: true }
        );

        if (!group) {
            throw new Error("Group not found or not allowed to update");
        }

        res.json(group);
    } catch (error) {
        throw new Error(error);
    }
});


// Delete a group
const deleteGroup = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const groupToDelete = await Group.findOne({ _id: id, groupCode: { $nin: ["000", "999"] } });

        if (!groupToDelete) {
            throw new Error("Group not found or not allowed to delete");
        }

        const deletedPermissions = await Permission.deleteMany({ group_id: id });

        const deletedGroup = await Group.findOneAndDelete({ _id: id });

        if (!deletedGroup) {
            throw new Error("Group not found or not allowed to delete");
        }

        const defaultGroup = await Group.findOne({ groupCode: "000" });

        if (!defaultGroup) {
            throw new Error("Default group not found");
        }

        await User.updateMany({ group_id: id }, { group_id: defaultGroup._id });

        res.json(deletedGroup);
    } catch (error) {
        throw new Error(error.message);
    }
});


module.exports = {
    createGroup,
    getAllGroups,
    getGroup,
    updateGroup,
    deleteGroup
};
