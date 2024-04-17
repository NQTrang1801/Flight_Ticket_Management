const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // Mã sân bay, bắt buộc
    name: { type: String, required: true }, // Tên sân bay, bắt buộc
    country: { type: String, required: true }, // Quốc gia của sân bay, bắt buộc
    address: { type: String, required: false }, // Thành phố của sân bay
    timezone: { type: String, required: true }, // Múi giờ của sân bay, bắt buộc
    terminals: { type: Number, required: true }, // Số lượng terminal của sân bay, bắt buộc
    capacity: { type: Number, required: true }, // Sức chứa của sân bay, bắt buộc
    isInternational: { type: Boolean, default: false }, // Sân bay có phải là quốc tế hay không, mặc định là false
    coordinates: {
        type: { type: String, default: 'Point'},
        coordinates: { type: [Number], required: false } // Tọa độ địa lý của sân bay, bắt buộc
    },
    status: { type: Boolean, default: true },
    rules: {
        type: Array,
        default: [],
    }
});

// Tạo index cho trường coordinates để hỗ trợ truy vấn vị trí địa lý
airportSchema.index({ coordinates: '2dsphere' });

const Airport = mongoose.model('Airport', airportSchema);

module.exports = Airport;
