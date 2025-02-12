const Permission = require("../models/permissionModel");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const Functionality = require("../models/functionalityModel");

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
        const permissions = await Permission.aggregate([
            {
                $lookup: {
                    from: 'groups', 
                    localField: 'group_id',
                    foreignField: '_id',
                    as: 'group'
                }
            },
            {
                $lookup: {
                    from: 'functionalities', 
                    localField: 'functionality_id',
                    foreignField: '_id',
                    as: 'functionality'
                }
            },
            {
                $unwind: '$group'
            },
            {
                $unwind: '$functionality'
            },
            {
                $project: {
                    _id: 1,
                    groupCode: '$group.groupCode',
                    functionalityCode: '$functionality.functionalityCode',
                    functionalityName: '$functionality.functionalityName',
                    screenNameToLoad: '$functionality.screenNameToLoad'
                }
            },
            {
                $group: {
                    _id: '$groupCode',
                    permissions: {
                        $push: {
                            _id: '$_id',
                            functionalityCode: '$functionalityCode',
                            functionalityName: '$functionalityName',
                            screenNameToLoad: '$screenNameToLoad'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    groupCode: '$_id',
                    permissions: 1
                }
            }
        ]);

        
        const result = {};
        permissions.forEach(permissionGroup => {
            result[permissionGroup.groupCode] = permissionGroup.permissions;
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("Please provide an array of IDs to delete");
    }

    ids.forEach(id => validateMongoDbId(id));

    try {
        const deletedPermissions = await Permission.deleteMany({ _id: { $in: ids } });

        if (deletedPermissions.deletedCount === 0) {
            throw new Error("No permissions found or deleted");
        }

        res.json({
            message: `Deleted ${deletedPermissions.deletedCount} permissions`,
            deletedCount: deletedPermissions.deletedCount,
        });
    } catch (error) {
        throw new Error(error.message);
    }
});



const getAllPermissionByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    validateMongoDbId(userId);

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { group_id } = user;
        if (!group_id) {
            return res.status(400).json({ message: 'Group ID not found for this user' });
        }

        const permissions = await Permission.find({ group_id });

        const functionalityIds = permissions.map(permission => permission.functionality_id);

        const functionalities = await Functionality.find({ _id: { $in: functionalityIds } });

        res.json(functionalities);
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
    deletePermission,
    getAllPermissionByUserId
};
