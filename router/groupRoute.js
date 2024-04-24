const express = require("express");
const { createGroup, getAllGroups, getGroup, updateGroup, deleteGroup } = require("../controllers/groupController");
const { authMiddleware, hasPermission } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/511454413/create", authMiddleware, hasPermission, createGroup);
router.get("/511320413/all", authMiddleware, hasPermission, getAllGroups);
router.get("/511320413/:id", authMiddleware, hasPermission, getGroup);
router.put("/511246413/update/:id", authMiddleware, hasPermission, updateGroup);
router.delete("/511627413/delete/:id", authMiddleware, hasPermission, deleteGroup);

module.exports = router;
