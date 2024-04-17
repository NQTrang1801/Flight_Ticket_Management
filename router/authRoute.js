const express = require("express");
const { createUser, loginUser, loginAdmin, updatedUser, updatePassword, handleRefreshToken, logout, resetPassword, blockUser, unblockUser, getAllUsersWithAdmin, getUserWithAdmin, getAllUsers } = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);

router.put("/password", authMiddleware, updatePassword);
router.put("/edit-user", authMiddleware, updatedUser);
router.put("/reset-password/:token", resetPassword);

router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/all-users", getAllUsers);

router.get("/admin/all-users", authMiddleware, isAdmin, getAllUsersWithAdmin);
router.get("/info/:id", authMiddleware, isAdmin, getUserWithAdmin);

module.exports = router;
