const express = require('express');
const { createRequestReservation, getRequestsByFlight, getAllRequests, updateRequestReservation, cancelRequestReservation, requestSuccess } = require('../controllers/requestReservationController');
const { authMiddleware, hasPermission } = require("../middlewares/authMiddleware");

const router = express.Router();

// Đặt vé chuyến bay
router.post('/booking', createRequestReservation);

// Xem danh sách request trên từng chuyến bay
router.get('/request/:flight_id', getRequestsByFlight);

router.get('/580320946/request-all', authMiddleware, hasPermission, getAllRequests);

// Cập nhật request
router.put('/:request_id', updateRequestReservation);

// Hủy request
router.patch('/:request_id/cancel', cancelRequestReservation);

router.patch('/580457946/:request_id/success', authMiddleware, hasPermission, requestSuccess);

module.exports = router;
