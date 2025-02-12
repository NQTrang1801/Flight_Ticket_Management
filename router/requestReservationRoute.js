const express = require('express');
const { createRequestReservation, getRequestsByFlight, getAllRequests, updateRequestReservation, cancelRequestReservation, requestSuccess } = require('../controllers/requestReservationController');
const { authMiddleware, hasPermission } = require("../middlewares/authMiddleware");

const router = express.Router();

// Đặt vé chuyến bay
router.post('/booking', createRequestReservation);

// Xem danh sách request trên từng chuyến bay
router.get('/580320946/request/:flight_id', authMiddleware, hasPermission, getRequestsByFlight);

router.get('/580320946/request-all', authMiddleware, hasPermission, getAllRequests);

// Cập nhật request
router.put('/:request_id', updateRequestReservation);

// Hủy request
router.patch('/:request_id/cancel', authMiddleware, cancelRequestReservation);

router.patch('/580457946/:request_id/success', authMiddleware, hasPermission, requestSuccess);

module.exports = router;
