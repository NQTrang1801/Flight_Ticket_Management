const express = require('express');
const { revenueReportByMonthYear, revenueReportByYear } = require('../controllers/reservationController');
const { authMiddleware, hasPermission } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get('/511320884/revenue-report-month-year', authMiddleware, hasPermission, revenueReportByMonthYear);

router.get('/511320884/revenue-report-year', authMiddleware, hasPermission, revenueReportByYear);

module.exports = router;