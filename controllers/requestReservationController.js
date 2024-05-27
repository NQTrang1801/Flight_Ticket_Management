const asyncHandler = require('express-async-handler');
const RequestReservation = require('../models/requestReservationModel');
const User = require('../models/userModel');
const Flight = require('../models/flightModel');
const Rule = require('../models/ruleModel')
const Reservation = require('../models/reservationModel')

const createRequestReservation = asyncHandler(async (req, res) => {
    try {
        const { user_id, flight_id, seat_class, full_name, CMND, phone_number } = req.body;

        const flight = await Flight.findById(flight_id).populate('rules.regulation_1.flight_time', 'values')
            .populate('rules.regulation_1.intermediate', 'values')
            .populate('rules.regulation_2.tickets', 'values')
            .populate('rules.regulation_3.booking', 'values');

        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }

        const booking_date = new Date();
        const checkDate = new Date();
        const departureDate = new Date(flight.departure_datetime);
        let maxBookingDays = flight.rules?.regulation_3?.booking?.values?.max_booking_days_before_departure || 0; // Default value is 0 if max_booking_days_before_departure is not defined
        maxBookingDays = parseInt(maxBookingDays);
        departureDate.setDate(departureDate.getDate() + maxBookingDays);

        if (booking_date >= departureDate) {
            return res.status(404).json({ message: 'Ticket booking deadline has expired' });
        }

        // Tìm kiếm seat_class_id trong mảng seats
        const seatClass = flight.seats.find(seat => seat.class == seat_class);

        if (!seatClass) {
            return res.status(404).json({ message: 'Seat class not found in this flight' });
        }

        // Kiểm tra xem còn chỗ ngồi không
        if (seatClass.booked_seats >= seatClass.count) {
            return res.status(400).json({ message: 'No available seats in this class' });
        }

        // Lấy thông tin rule về vé
        const ticketRule = await Rule.findById(flight.rules.regulation_2.tickets);

        if (!ticketRule) {
            return res.status(500).json({ message: 'Ticket rule not found' });
        }

        // Tính toán giá vé dựa trên ticketRule
        const priceMultiplier = ticketRule.values.ticket_classes[seatClass.class]?.price_multiplier || 1;
        const price = flight.ticket_price * priceMultiplier;

        // Tăng số lượng chỗ ngồi đã đặt lên
        seatClass.booked_seats += 1;

        if (seatClass.booked_seats == seatClass.count) {
            seatClass.status = false;
        }

        // Lưu lại sự thay đổi trong flight
        await flight.save();

        // Tạo mới request
        const newRequest = await RequestReservation.create({
            user_id,
            flight_id,
            seat_class,
            full_name,
            CMND,
            phone_number,
            price,
            booking_date
        });

        const user = await User.findById(user_id);

        user.tickets.push(newRequest._id); 

        await user.save();

        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Xem danh sách request trên từng chuyến bay
const getRequestsByFlight = asyncHandler(async (req, res) => {
    try {
        const { flight_id } = req.params;
        const requests = await RequestReservation.find({ flight_id }).populate('user_id', 'fullname email').populate('flight_id', 'flight_code');

        if (!requests.length) {
            return res.status(404).json({ message: 'No request reservations found for this flight' });
        }

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const getAllRequests = asyncHandler(async (req, res) => {
    try {
        const requests = await RequestReservation.find().populate('user_id', 'fullname email').populate('flight_id', 'flight_code flight_number departure_datetime duration seats');

        if (!requests.length) {
            return res.status(404).json({ message: 'No request reservations found' });
        }

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Cập nhật request
const updateRequestReservation = asyncHandler(async (req, res) => {
    try {
        const { request_id } = req.params;
        const updatedRequest = await RequestReservation.findByIdAndUpdate(request_id, req.body, { new: true });

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Hủy request
const cancelRequestReservation = asyncHandler(async (req, res) => {
    try {
        const { request_id } = req.params;

        const requestReservation = await RequestReservation.findById(request_id);

        if (!requestReservation) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (requestReservation.status == 'Booked') {
            const flight = await Flight.findById(requestReservation.flight_id);
            const seatClass = flight.seats.find(seat => seat.class == requestReservation.seat_class);
            seatClass.booked_seats -= 1;
            await flight.save();
        }

        requestReservation.status = 'Cancelled';
        await requestReservation.save();

        res.status(200).json(requestReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const requestSuccess = asyncHandler(async (req, res) => {
    try {
        const { request_id } = req.params;

        // Tìm request cần cập nhật
        const request = await RequestReservation.findById(request_id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Cập nhật trạng thái request
        request.status = 'Paid';
        await request.save();

        // Thêm thông tin vào collection Reservation
        const reservation = await Reservation.create({
            user_id: request.user_id,
            flight_id: request.flight_id,
            seat_class: request.seat_class,
            full_name: request.full_name,
            CMND: request.CMND,
            phone_number: request.phone_number,
            price: request.price,
            booking_date: request.booking_date
        });

        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    createRequestReservation,
    getRequestsByFlight,
    getAllRequests,
    updateRequestReservation,
    cancelRequestReservation,
    requestSuccess
};
