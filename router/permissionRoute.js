const express = require("express");
const { createMultiplePermissions, getAllPermissions, getPermission, updatePermission, deletePermission, getAllPermissionByUserId } = require("../controllers/permissionController");
const { authMiddleware, hasPermission } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/511454990/create", authMiddleware, hasPermission, createMultiplePermissions);
router.get("/511320990/all", authMiddleware, hasPermission, getAllPermissions);
router.get("/511000000/:userId/all", authMiddleware, hasPermission, getAllPermissionByUserId);
router.get("/511320990/:id", authMiddleware, hasPermission, getPermission);
router.put("/511246990/update/:id", authMiddleware, hasPermission, updatePermission);
router.delete("/511627990/delete/:id", authMiddleware, hasPermission, deletePermission);

module.exports = router;
