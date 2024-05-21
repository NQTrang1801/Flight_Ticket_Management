const express = require("express");
const { getAllFunctions } = require("../controllers/functionalityController");
const { authMiddleware, hasPermission } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/511320617/all", authMiddleware, hasPermission, getAllFunctions);

module.exports = router;
