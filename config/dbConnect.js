const { default: mongoose } = require("mongoose")
const Functionality = require('../models/functionalityModel')
const User = require('../models/userModel')
const Group = require('../models/groupModel')
const Permission = require('../models/permissionModel')
const Rule = require('../models/ruleModel')
const Flight = require('../models/flightModel')
const RequestReservation = require('../models/requestReservationModel')
const Reservation = require('../models/reservationModel')
const ONE_DAY = 24 * 60 * 60 * 1000;

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        mongoose.connection.once('open', async () => {
            try {
                const countF = await Functionality.countDocuments();
                const countG = await Group.countDocuments();
                const countP = await Permission.countDocuments();
                const countR = await Rule.countDocuments();

                if (countF === 0) {
                    await Functionality.create([
                        { functionalityCode: '511320617', functionalityName: 'GET COLLECTION FUNCTIONS', screenNameToLoad: 'USER MANAGEMENT FUNCTIONALITY' },

                        { functionalityCode: '511320447', functionalityName: 'GET COLLECTION USER', screenNameToLoad: 'USER MANAGEMENT' },
                        { functionalityCode: '511246447', functionalityName: 'PUT COLLECTION USER', screenNameToLoad: 'USER MANAGEMENT' },
                        { functionalityCode: '511454447', functionalityName: 'POST COLLECTION USER', screenNameToLoad: 'USER MANAGEMENT' },
                        { functionalityCode: '511627447', functionalityName: 'DELETE COLLECTION USER', screenNameToLoad: 'USER MANAGEMENT' },
                        { functionalityCode: '511457447', functionalityName: 'PATCH COLLECTION USER', screenNameToLoad: 'USER MANAGEMENT' },
                        { functionalityCode: '999457447', functionalityName: 'PATCH GROUP_ID COLLECTION USER', screenNameToLoad: 'USER MANAGEMENT' },

                        { functionalityCode: '511320340', functionalityName: 'GET COLLECTION RULE', screenNameToLoad: 'RULE MANAGEMENT' },
                        { functionalityCode: '511246340', functionalityName: 'PUT COLLECTION RULE', screenNameToLoad: 'RULE MANAGEMENT' },
                        { functionalityCode: '511454340', functionalityName: 'POST COLLECTION RULE', screenNameToLoad: 'RULE MANAGEMENT' },
                        { functionalityCode: '511627340', functionalityName: 'DELETE COLLECTION RULE', screenNameToLoad: 'RULE MANAGEMENT' },
                        { functionalityCode: '511457340', functionalityName: 'PATCH COLLECTION RULE', screenNameToLoad: 'RULE MANAGEMENT' },

                        { functionalityCode: '511320641', functionalityName: 'GET COLLECTION FLIGHT', screenNameToLoad: 'FLIGHT MANAGEMENT' },
                        { functionalityCode: '511246641', functionalityName: 'PUT COLLECTION FLIGHT', screenNameToLoad: 'FLIGHT MANAGEMENT' },
                        { functionalityCode: '511454641', functionalityName: 'POST COLLECTION FLIGHT', screenNameToLoad: 'FLIGHT MANAGEMENT' },
                        { functionalityCode: '511627641', functionalityName: 'DELETE COLLECTION FLIGHT', screenNameToLoad: 'FLIGHT MANAGEMENT' },
                        { functionalityCode: '511457641', functionalityName: 'PATCH COLLECTION FLIGHT', screenNameToLoad: 'FLIGHT MANAGEMENT' },

                        { functionalityCode: '511320675', functionalityName: 'GET COLLECTION AIRPORT', screenNameToLoad: 'AIRPORT MANAGEMENT' },
                        { functionalityCode: '511246675', functionalityName: 'PUT COLLECTION AIRPORT', screenNameToLoad: 'AIRPORT MANAGEMENT' },
                        { functionalityCode: '511454675', functionalityName: 'POST COLLECTION AIRPORT', screenNameToLoad: 'AIRPORT MANAGEMENT' },
                        { functionalityCode: '511627675', functionalityName: 'DELETE COLLECTION AIRPORT', screenNameToLoad: 'AIRPORT MANAGEMENT' },
                        { functionalityCode: '511457675', functionalityName: 'PATCH COLLECTION AIRPORT', screenNameToLoad: 'AIRPORT MANAGEMENT' },

                        { functionalityCode: '511320884', functionalityName: 'GET COLLECTION RESERVATION', screenNameToLoad: 'RESERVATION MANAGEMENT' },
                        { functionalityCode: '511246884', functionalityName: 'PUT COLLECTION RESERVATION', screenNameToLoad: 'RESERVATION MANAGEMENT' },
                        { functionalityCode: '511454884', functionalityName: 'POST COLLECTION RESERVATION', screenNameToLoad: 'RESERVATION MANAGEMENT' },
                        { functionalityCode: '511627884', functionalityName: 'DELETE COLLECTION RESERVATION', screenNameToLoad: 'RESERVATION MANAGEMENT' },
                        { functionalityCode: '511457884', functionalityName: 'PATCH COLLECTION RESERVATION', screenNameToLoad: 'RESERVATION MANAGEMENT' },

                        { functionalityCode: '580320946', functionalityName: 'GET COLLECTION REQUEST RESERVATION', screenNameToLoad: 'BOOKING' },
                        { functionalityCode: '511320946', functionalityName: 'ADMIN GET COLLECTION REQUEST RESERVATION', screenNameToLoad: 'BOOKING' },
                        { functionalityCode: '580246946', functionalityName: 'PUT COLLECTION REQUEST RESERVATION', screenNameToLoad: 'BOOKING' },
                        { functionalityCode: '511246946', functionalityName: 'ADMIN PUT COLLECTION REQUEST RESERVATION', screenNameToLoad: 'BOOKING' },
                        { functionalityCode: '580454946', functionalityName: 'POST COLLECTION REQUEST RESERVATION', screenNameToLoad: 'BOOKING' },
                        { functionalityCode: '511454946', functionalityName: 'ADMIN POST COLLECTION REQUEST RESERVATION', screenNameToLoad: 'BOOKING' },
                        { functionalityCode: '580457946', functionalityName: 'PATCH COLLECTION REQUEST RESERVATION', screenNameToLoad: 'BOOKING' },
                        { functionalityCode: '511457946', functionalityName: 'ADMIN PATCH COLLECTION REQUEST RESERVATION', screenNameToLoad: 'BOOKING' },

                        { functionalityCode: '511320413', functionalityName: 'GET COLLECTION GROUP', screenNameToLoad: 'GROUP MANAGEMENT' },
                        { functionalityCode: '511246413', functionalityName: 'PUT COLLECTION GROUP', screenNameToLoad: 'GROUP MANAGEMENT' },
                        { functionalityCode: '511454413', functionalityName: 'POST COLLECTION GROUP', screenNameToLoad: 'GROUP MANAGEMENT' },
                        { functionalityCode: '511627413', functionalityName: 'DELETE COLLECTION GROUP', screenNameToLoad: 'GROUP MANAGEMENT' },
                        { functionalityCode: '511457413', functionalityName: 'PATCH COLLECTION GROUP', screenNameToLoad: 'GROUP MANAGEMENT' },

                        { functionalityCode: '511320990', functionalityName: 'GET COLLECTION PERMISSION', screenNameToLoad: 'PERMISSION MANAGEMENT' },
                        { functionalityCode: '511246990', functionalityName: 'PUT COLLECTION PERMISSION', screenNameToLoad: 'PERMISSION MANAGEMENT' },
                        { functionalityCode: '511454990', functionalityName: 'POST COLLECTION PERMISSION', screenNameToLoad: 'PERMISSION MANAGEMENT' },
                        { functionalityCode: '511627990', functionalityName: 'DELETE COLLECTION PERMISSION', screenNameToLoad: 'PERMISSION MANAGEMENT' },
                        { functionalityCode: '511457990', functionalityName: 'PATCH COLLECTION PERMISSION', screenNameToLoad: 'PERMISSION MANAGEMENT' },

                        { functionalityCode: '000000000', functionalityName: 'NORMAL', screenNameToLoad: 'WEB CLIENT' },
                        { functionalityCode: '511000000', functionalityName: 'ADMIN', screenNameToLoad: 'WEB ADMIN SERVER' },
                        { functionalityCode: '999999999', functionalityName: 'ADMINISTRATOR', screenNameToLoad: 'WEB ADMINITRATOR SERVER' }

                    ]);
                    console.log('Inserted FUNC default documents successfully.');
                }

                if (countG === 0) {
                    await Group.create([
                        { groupCode: "511", groupName: "ADMIN" },
                        { groupCode: "000", groupName: "USER" },
                        { groupCode: "999", groupName: "ADMINISTRATOR" }
                    ]);
                    console.log('Inserted GROUP default documents successfully.');
                }

                const gr999 = await Group.findOne({ groupCode: "999" });

                if (countP === 0) {
                    const functionalities = await Functionality.find({}, '_id');
                    const functionalityIds = functionalities.map(func => func._id);
                    const permissions = functionalityIds.map(functionalityId => ({
                        group_id: gr999._id,
                        functionality_id: functionalityId
                    }));

                    await Permission.create(permissions);

                    const grAdmin = await Group.findOne({ groupCode: "511" });
                    const funcsAdmin = await Functionality.find({
                        functionalityCode: { $regex: /^(511)/ }
                    }).select('_id');
                    
                    const funcsAdminIds = funcsAdmin.map(func => func._id);
                    const permissionsAdmin = funcsAdminIds.map(functionalityId => ({
                        group_id: grAdmin._id,
                        functionality_id: functionalityId
                    }));

                    await Permission.create(permissionsAdmin);

                    const grclient = await Group.findOne({ groupCode: "000" });
                    const funcsclient = await Functionality.find({
                        functionalityCode: { $regex: /^(580|000)/ }
                    }).select('_id');
                    
                    const funcsclientIds = funcsclient.map(func => func._id);
                    const permissionsClient = funcsclientIds.map(functionalityId => ({
                        group_id: grclient._id,
                        functionality_id: functionalityId
                    }));

                    await Permission.create(permissionsClient);

                    console.log('Inserted PERMISSION default documents successfully.');
                }

                const countU = await User.countDocuments();
                if (countU === 0) {
                    await User.create([
                        {
                            fullname: "ADMINISTRATOR",
                            email: "ADMINISTRATOR@gmail.com",
                            mobile: "0000000000",
                            password: "ADMINISTRATOR999",
                            group_id: gr999._id
                        }
                    ]);
                    console.log('Inserted ADMINISTRATOR default documents successfully.');
                }

                if (countR == 0) {
                    await Rule.create([
                        { 
                            ruleName: "Regulation Airport", 
                            code: "R1-1", 
                            detail: "Maximum number of airports",
                            values: { 
                                max_airports: 10
                            }
                        },
                        { 
                            ruleName: "Regulation flight time", 
                            code: "R1-2", 
                            detail: "minimum flight time",
                            values: { 
                                min_flight_time: 30
                            }
                        },
                        { 
                            ruleName: "Regulation intermediary airports", 
                            code: "R1-3", 
                            detail: "Maximum intermediate airports with a stop time limit",
                            values: { 
                                max_transit_airports: 2,
                                min: 10,
                                max: 20
                            }
                        },
                        { 
                            ruleName: "Regulations on tickets", 
                            code: "R2", 
                            detail: "Only sell tickets when there is room. There are 2 classes (1, 2). The ticket price is bound with different types of classes, each flight has a separate ticket price.",
                            values: { 
                                sell_only_available_seats: true,
                                ticket_classes: { 
                                    1: { price_multiplier: 1.05 },
                                    2: { price_multiplier: 1 }
                                },
                                separate_ticket_prices: true
                            }
                        },
                        { 
                            ruleName: "Regulations booking", 
                            code: "R3", 
                            detail: "Only book tickets later 1 day before departure. On the date of departure, all votes will be canceled.",
                            values: { 
                                max_booking_days_before_departure: -1, 
                                cancel_bookings_days_before_departure: 0,
                            }
                        }
                    ]);
                    console.log('Inserted Rules default documents successfully.');
                }                

            } catch (err) {
                console.error('Error inserting default documents:', err);
            }
        });

        cancelRequestReservations();
        setTimeout(cancelRequestReservations, ONE_DAY);
    }
    catch (err) {
        throw new Error(err);
    }
}

const cancelRequestReservations = async () => {
    try {
        const flights = await Flight.find().populate('rules.regulation_3.booking', 'values');

        const today = new Date();
        const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        for (const flight of flights) {
            let cancelDays = flight.rules?.regulation_3?.booking?.values?.cancel_bookings_days_before_departure || 0;
            cancelDays = parseInt(cancelDays);
            const cancelDate = new Date(flight.departure_datetime);
            cancelDate.setDate(cancelDate.getDate() + cancelDays);
            const cancelDateWithoutTime = new Date(cancelDate.getFullYear(), cancelDate.getMonth(), cancelDate.getDate());

            if (todayWithoutTime.getTime() == cancelDateWithoutTime.getTime()) {
                await RequestReservation.updateMany({ flight_id: flight._id }, { status: 'Cancelled' });
                await Reservation.updateMany({ flight_id: flight._id }, { status: 'Cancelled' });
                console.log(`Cancelled requestReservations for flight ${flight.flight_code}.`);
            }
        }
    } catch (error) {
        console.error('Error cancelling requestReservations:', error);
    }
};


module.exports = dbConnect;