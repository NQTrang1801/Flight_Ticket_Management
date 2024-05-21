const express = require("express");
const { getAllFunctions, getGroupedFunctions } = require("../controllers/functionalityController");
const { authMiddleware, hasPermission } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/511320617/all", authMiddleware, hasPermission, getAllFunctions);
router.get("/511320617/all-by-group", authMiddleware, hasPermission, getGroupedFunctions);

module.exports = router;
