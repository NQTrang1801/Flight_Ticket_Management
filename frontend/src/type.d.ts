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
