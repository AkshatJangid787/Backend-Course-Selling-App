const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Failed');
        console.error(error);
        process.exit(1);
    }
};
module.exports = connectDB;