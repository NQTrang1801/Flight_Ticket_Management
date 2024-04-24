const User = require("../models/userModel");
const Group = require("../models/groupModel");
const Permission = require("../models/permissionModel");
const Functionality = require("../models/functionalityModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler")

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        } catch (err) {
            throw new Error("Not Authorized token expired, please login again");
        }
    } else {
        throw new Error("There is no token attached to header");
    }
});

const hasPermission = asyncHandler(async (req, res, next) => {
    const url = req.originalUrl;
    const parts = url.split("/");
    const functionalityCode = parts[parts.indexOf("api") + 2];

    const func = await Functionality.findOne({ functionalityCode });
    if (!func) {
        throw new Error("permission not found!");
    }

    const f_id = func._id;
    
    const permission = await Permission.findOne({ group_id: req.user.group_id, functionality_id: f_id });
    if (!permission) {
        throw new Error("Permission denied!");
    } else {
        next();
    }
});

module.exports = { authMiddleware, hasPermission};