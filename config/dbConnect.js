const { default: mongoose } = require("mongoose")

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log('DB connected!')
    }
    catch (err) {
        throw new Error(err);
    }
}

module.exports = dbConnect;