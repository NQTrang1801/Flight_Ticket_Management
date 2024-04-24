const Group = require("../models/groupModel");
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
        const deletedGroup = await Group.findOneAndDelete(
            { _id: id, groupCode: { $nin: ["000", "999"] } }
        );

        if (!deletedGroup) {
            throw new Error("Group not found or not allowed to delete");
        }

        res.json(deletedGroup);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = {
    createGroup,
    getAllGroups,
    getGroup,
    updateGroup,
    deleteGroup
};
