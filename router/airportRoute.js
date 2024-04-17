const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airportController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Routes for admin
router.post('/admin/create', authMiddleware, isAdmin, airportController.checkAirportCount, airportController.createAirport);
router.put('/admin/:id', authMiddleware, isAdmin, airportController.updateAirport);
router.patch('/admin/:id/status', authMiddleware, isAdmin, airportController.updateAirportStatus);
router.delete('/admin/:id', authMiddleware, isAdmin, airportController.deleteAirport);

// Routes for user
router.get('/all', airportController.getAllAirports);
router.get('/:id', airportController.getAirportById);

module.exports = router;
