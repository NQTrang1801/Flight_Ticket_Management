const mongoose = require('mongoose');

const requestReservationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    flight_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
    passenger_name: { type: String, required: true },
    passport_number: { type: String, required: true },
    CMND : {  type: String, required: true },
    phone_number: { type: String, required: true },
    ticket_class: { type: String, required: true },
    ticket_price: { type: Number, required: true },
    booking_date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Booked', 'Cancelled', 'Paid'], default: 'Booked' },
    rule_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Rule', required: true }
});

const RequestReservation = mongoose.model('RequestReservation', requestReservationSchema);

module.exports = RequestReservation;
