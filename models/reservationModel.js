const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    flight_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
    seat_class: { type: String, required: true },
    full_name: { type: String, required: true },
    CMND: { type: String, required: true },
    phone_number: { type: String, required: true },
    price: { type: Number, required: true },
    booking_date: { type: Date, required: true},
    status: { type: String, enum: ['Booked', 'Cancelled'], default: 'Booked' }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
