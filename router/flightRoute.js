const express = require("express");
const router = express.Router();
const flightController = require("../controllers/flightController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Route for creating a new flight (only accessible by admin)
router.post("/create", authMiddleware, isAdmin, flightController.createFlight);

// Route for getting all flights
router.get("/all", flightController.getAllFlights);

// Route for getting a flight by ID
router.get("/:id", flightController.getFlightById);

// Route for updating seat_count a flight by ID (only accessible by admin)
router.put("/:flight_id/seats/:seat_id", authMiddleware, isAdmin, flightController.updateSeatCountById);

// Route for updating a flight by ID (only accessible by admin)
router.put("/:id", authMiddleware, isAdmin, flightController.updateFlight);

// Route for deleting a flight by ID (only accessible by admin)
router.delete("/:id", authMiddleware, isAdmin, flightController.deleteFlight);

module.exports = router;
