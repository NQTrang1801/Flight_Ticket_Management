const { default: mongoose } = require("mongoose")
const Functionality = require('../models/functionalityModel')
const User = require('../models/userModel')
const Group = require('../models/groupModel')
const Permission = require('../models/permissionModel')
const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        mongoose.connection.once('open', async () => {
            try {
                const countF = await Functionality.countDocuments();
                const countG = await Group.countDocuments();
                const countP = await Permission.countDocuments();
                if (countF === 0) {
                    // Thêm các document mặc định nếu không có bản ghi nào
                    await Functionality.create([
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
                        { functionalityCode: '580246946', functionalityName: 'PUT COLLECTION REQUEST RESERVATION', screenNameToLoad: 'BOOKING' },
                        { functionalityCode: '580454946', functionalityName: 'POST COLLECTION REQUEST RESERVATION', screenNameToLoad: 'BOOKING' },
                        { functionalityCode: '580457946', functionalityName: 'PATCH COLLECTION REQUEST RESERVATION', screenNameToLoad: 'BOOKING' },

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
                        // Thêm các document mặc định khác ở đây nếu cần
                    ]);
                    console.log('Inserted FUNC default documents successfully.');
                }

                if (countG === 0) {
                    await Group.create([
                        { groupCode: "511", groupName: "ADMIN" },
                        { groupCode: "000", groupName: "NORMAL" },
                        { groupCode: "999", groupName: "ADMINISTRATOR" }
                    ]);
                    console.log('Inserted GROUP default documents successfully.');
                }
                if (countP === 0) {
                    const gr999 = await Group.findOne({groupCode: "999"});
                    const functionalities = await Functionality.find({}, '_id');
                    const functionalityIds = functionalities.map(func => func._id);
                    const permissions = functionalityIds.map(functionalityId => ({
                        group_id: gr999._id,
                        functionality_id: functionalityId
                    }));
                    
                    await Permission.create(permissions);

                    console.log('Inserted PERMISSION default documents successfully.');
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
                }
                
                
            } catch (err) {
                console.error('Error inserting default documents:', err);
            }
        });

    }
    catch (err) {
        throw new Error(err);
    }
}

module.exports = dbConnect;