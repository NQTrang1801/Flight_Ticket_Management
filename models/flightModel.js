const mongoose = require('mongoose');

const transitAirportSchema = new mongoose.Schema({
    airport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Airport' },
    stop_duration: { type: Number },
    note: { type: String }
});

const flightSchema = new mongoose.Schema({
    flight_number: { type: String, required: true },
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
            status: { type: Boolean, default: true },
        }
    ],
    ticket_price: { type: Object, required: true },
    transit_airports: [transitAirportSchema],
    rules: {
        regulation_1: {
            flight_time: { type: mongoose.Schema.Types.ObjectId, ref: 'Rule', required: true },
            intermediate: { type: mongoose.Schema.Types.ObjectId, ref: 'Rule', required: true }
        },
        regulation_2: {
            tickets: { type: mongoose.Schema.Types.ObjectId, ref: 'Rule', required: true },
        },
        regulation_3: {
            booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Rule', required: true },
        },
    }
});

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;
