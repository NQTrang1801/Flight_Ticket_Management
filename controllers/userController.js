const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const Group = require("../models/groupModel");
const Functionality = require("../models/functionalityModel");
const Permission = require("../models/permissionModel");
const RequestReservation = require("../models/requestReservationModel");
// register a user
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        const grclient = await Group.findOne({ groupCode: "000" });
        if (grclient) {
            const newUser = await User.create({
                fullname: req.body.fullname,
                email: req.body.email,
                mobile: req.body.mobile,
                password: req.body.password,
                group_id: grclient._id,
                address: req.body.address
            });
            res.json(newUser);
        } else {
            throw new Error("Server denied!");
        }
    } else {
        throw new Error("User Already Exists");
    }
});

// Login a user
const loginUSER = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const account = await User.findOne({ email });
    if (account && (await account.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(account?._id);
        const updateuser = await User.findByIdAndUpdate(
            account.id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: account?._id,
            fullname: account?.fullname,
            email: account?.email,
            mobile: account?.mobile,
            address: account?.address,
            userType: "USER",
            token: generateToken(account?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

const loginADMINISTRATOR = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const account = await User.findOne({ email });
    const per = await Permission.findOne({
        group_id: account.group_id,
        functionality_id: (await Functionality.findOne({ functionalityCode: "999999999" }).select('_id'))
    });

    if (!per) {
        throw new Error("Not Authorised");
    }

    if (account && (await account.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(account?._id);
        const updateuser = await User.findByIdAndUpdate(
            account.id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: account?._id,
            fullname: account?.fullname,
            email: account?.email,
            mobile: account?.mobile,
            adress: account?.address,
            userType: "ADMINISTRATOR",
            token: generateToken(account?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});
// admin login
const loginADMIN = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const account = await User.findOne({ email });
    const per = await Permission.findOne({
        group_id: account.group_id,
        functionality_id: (await Functionality.findOne({ functionalityCode: "511000000" }).select('_id'))
    });

    if (!per) {
        throw new Error("Not Authorised");
    }

    if (account && (await account.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(account?._id);
        const updateuser = await User.findByIdAndUpdate(
            account.id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: account?._id,
            fullname: account?.fullname,
            email: account?.email,
            mobile: account?.mobile,
            adress: account?.address,
            userType: "ADMIN",
            token: generateToken(account?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});


// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});

// logout
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // forbidden
    }
    await User.findOneAndUpdate({ refreshToken: refreshToken }, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); // forbidden
});

// Update a user
const updatedUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                fullname: req?.body?.fullname,
                mobile: req?.body?.mobile,
                address: req?.body?.address
            },
            {
                new: true,
            }
        );
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
});


const getAllUsersWithAdmin = asyncHandler(async (req, res) => {
    try {
        const uniqueGroupIds = await User.distinct('group_id');
        const groupInfo = {};
        for (const groupId of uniqueGroupIds) {
            const group = await Group.findById(groupId);
            if (group) {
                groupInfo[groupId] = group.groupName;
            }
        }

        const usersByGroup = {};

        for (const [groupId, groupName] of Object.entries(groupInfo)) {
            const users = await User.find({ group_id: groupId });
            if (!usersByGroup[groupName]) {
                usersByGroup[groupName] = [];
            }
            usersByGroup[groupName].push(...users);
        }

        res.json(usersByGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single user
const getUserWithAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const getaUser = await User.findById(id).populate('group_id', 'groupName');
        res.json({
            getaUser,
        });
    } catch (error) {
        throw new Error(error);
    }
});

// delete a single user
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        });
    } catch (error) {
        throw new Error(error);
    }
});

// block
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const blockusr = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
        res.json(blockusr);
    } catch (error) {
        throw new Error(error);
    }
});

// unblock
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
        res.json({
            message: "User UnBlocked",
        });
    } catch (error) {
        throw new Error(error);
    }
});


// update password
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }
});


// Get list users
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        // Tìm group_id của nhóm "USER"
        const userGroup = await Group.findOne({ groupName: 'USER' });
        if (!userGroup) {
            return res.status(404).json({ message: 'Not Found' });
        }

        const userGroupId = userGroup._id;

        // Tìm tất cả người dùng có group_id là userGroupId
        const users = await User.find({ group_id: userGroupId }, 'id fullname email mobile address isBlocked tickets').populate('group_id', 'groupName');

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//
const updateGroupUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { group_id } = req.body;
    validateMongoDbId(id);
    const user = await User.findById(id);
    const gr = await Group.findById(group_id);
    if (gr) {
        user.group_id = group_id;
        const updated = await user.save();
        res.json(updated);
    } else {
        res.json(user);
    }
});

const getTicketsByUserId = asyncHandler(async (req, res) => {
    try {
        const { user_id } = req.params;

        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userTicketIds = user.tickets;

        const userTickets = await RequestReservation.find({ _id: { $in: userTicketIds } }).populate('flight_id', 'departure_airport destination_airport departure_datetime');;

        res.status(200).json(userTickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    createUser,
    loginUSER,
    loginADMIN,
    loginADMINISTRATOR,
    handleRefreshToken,
    logout,
    updatedUser,
    updateGroupUser,
    updatePassword,
    blockUser,
    unblockUser,
    deleteUser,
    getAllUsers,
    getTicketsByUserId,
    getUserWithAdmin,
    getAllUsersWithAdmin
};

