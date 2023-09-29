const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected ${connect.connection.host}`);
    } catch (error) {
        console.log("🚀 ~ file: db.js:12 ~ connectDB ~ error:", error);
    }
};

module.exports = connectDB;