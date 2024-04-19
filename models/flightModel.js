const mongoose = require('mongoose');

const transitAirportSchema = new mongoose.Schema({
    airport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Airport' },
    stop_duration: { type: Number },
    rule_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Rule' }
});

const flightSchema = new mongoose.Schema({
    flight_number: { type: String, required: true, unique: true },
    flight_code: { type: String, required: true },
    departure_airport: { type: mongoose.Schema.Types.ObjectId, ref: 'Airport', required: true },
    destination_airport: { type: mongoose.Schema.Types.ObjectId, ref: 'Airport', required: true },
    departure_datetime: { type: Date, required: true },
    duration: { type: Number, required: true },
    seats: [
        {
            class: { type: String, required: true}, 
            count: { type: Number, required: true, default: 0 },
            booked_seats: { type: Number, default: 0 },
            status: { type: Boolean, default: false },
        }
    ],
    ticket_price: { type: Object, required: true },
    transit_airports: [transitAirportSchema],
    rules: {
        type: Array,
        default: [],
    }
});

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;
