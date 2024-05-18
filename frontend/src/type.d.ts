interface FlightDataProps {
    flightCode: string;
    ticketPrice: number;
    departureAirport: string;
    arrivalAirport: string;
    dateTime: string;
    flightDuration: string;
    seatQuantityClass1: number;
    seatQuantityClass2: number;
    layover: Array<{
        stt: number;
        airport: string;
        stopTime: string;
        note: string;
    }>;
}

interface TicketProps {
    bookingCode: string;
    flightNumber: string;
    passengerName: string;
    idNumber: string;
    phoneNumber: string;
    ticketClass: string;
    ticketPrice: number;
}

interface FlightProps {
    index: number;
    bookingCode: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    duration: string;
    availableSeats: number;
    bookedSeats: number;
}

interface MonthlyRevenueProps {
    month: string;
    ticketSales: {
        stt: number;
        flightNumber: string;
        ticketCount: number;
        revenue: number;
        rate: string;
    }[];
}

interface YearlyRevenueProps {
    year: number;
    monthlyRevenue: {
        stt: number;
        month: string;
        flightCount: number;
        revenue: number;
        rate: string;
    }[];
}

interface RegisterValidation {
    name: string;
    email: string;
    password: string;
    phoneNumber: number;
    address: string;
}

interface AirportData {
    _id: string;
    code: string;
    name: string;
    country: string;
    address: string;
    timezone: string;
    terminals: number;
    capacity: number;
    isInternational: boolean;
    coordinates: {
        type: string;
        coordinates: number[];
    };
    status: boolean;
}

interface RuleValidation {
    ruleName: string;
    detail: string;
}

interface ValueObject {
    [key: string]: number;
}

interface RuleData {
    ruleName: string;
    code: string;
    detail: string;
    values: ValueObject;
    _id: string;
}

interface AirportValidation {
    code: string;
    name: string;
    country: string;
    address: string;
    timezone: string;
    terminals: number;
    capacity: number;
    isInternational: boolean;
    coordinates: {
        type: string;
        coordinates: number[];
    };
    status: boolean;
}

interface FlightScheduleData {
    _id: string;
    flight_number: string;
    flight_code: string;
    departure_airport: {
        address: string;
        code: string;
        country: string;
        name: string;
        _id: string;
    };
    destination_airport: {
        address: string;
        code: string;
        country: string;
        name: string;
        _id: string;
    };
    departure_datetime: string;
    duration: number;
    seats: [
        {
            class: string;
            count: number;
            booked_seats: number;
            status: boolean;
        },
        {
            class: string;
            count: number;
            booked_seats: number;
            status: boolean;
        }
    ];
    ticket_price: number;
    transit_airports: {
        airport_id: {
            address: string;
            code: string;
            country: string;
            name: string;
            _id: string;
        };
        airport_name: string;
        stop_duration: number;
        note: string;
    }[];
    rules: {
        type: Array;
        default: [];
    };
}

interface FlightScheduleValidation {
    flightNumber: string;
    flightCode: string;
    duration: number;
    ticketPrice: number;
    departureDate: Date;
    departureTime: string;
    bookingDeadline: Date;
    cancellationDeadline: Date;

    firstClassCapacity: number;
    firstClassBookedSeats: number;

    secondClassCapacity: number;
    secondClassBookedSeats: number;

    intermediateAirport: Array<{
        stopDuration: number;
        note: string;
    }>;
}

interface UserData {
    email: string;
    fullname: string;
    group_id: string;
    isBlocked: boolean;
    mobile: string;
    // tickets: [];
    _id: string;
}

enum BookingStatus {
    "Booked",
    "Cancelled",
    "Paid"
}

interface BookingFormData {
    user_id: object;
    flight_id: object;
    seat_class: string;
    full_name: string;
    CMND: string;
    phone_number: string;
    price: number;
    booking_date: Date;
    status: BookingStatus;
}
