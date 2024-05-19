const express = require("express");
const { createUser, loginUSER, loginADMIN, updatedUser, updateGroupUser, updatePassword, handleRefreshToken, logout, blockUser, unblockUser, getAllUsersWithAdmin, getTicketsByUserId, getUserWithAdmin, getAllUsers, loginADMINISTRATOR } = require("../controllers/userController");
const { authMiddleware, hasPermission } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUSER);
router.post("/admin-login", loginADMIN);
router.post("/administrator-login", loginADMINISTRATOR);

router.patch("/password", authMiddleware, updatePassword);
router.put("/edit-user", authMiddleware, updatedUser);

router.put("/511246447/block-user/:id", authMiddleware, hasPermission, blockUser); //admin-put-user
router.put("/511246447/unblock-user/:id", authMiddleware, hasPermission, unblockUser);
router.patch("/999457447/update-group/:id", authMiddleware, hasPermission, updateGroupUser);

router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/all-users", getAllUsers);
router.get("/:user_id/tickets", getTicketsByUserId);

router.get("/511320447/admin/all-users", authMiddleware, hasPermission, getAllUsersWithAdmin);
router.get("/511320447/info/:id", authMiddleware, hasPermission, getUserWithAdmin);

module.exports = router;
