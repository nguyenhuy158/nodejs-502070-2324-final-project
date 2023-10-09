const mongoose = require('mongoose');
const User = require('../../models/userModel');
const bcrypt = require('bcryptjs'); // Import bcryptjs


const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected ${connect.connection.host}`);
        checkAndCreateAdminUser();

    } catch (error) {
        console.log("🚀 ~ file: db.js:12 ~ connectDB ~ error:", error);
    }
};


// Function to check and create the admin user
async function checkAndCreateAdminUser() {
    try {
        const adminUser = await User.findOne({ username: 'admin' });

        if (!adminUser) {

            const newUser = new User({
                email: 'noreplay.nodejs.502070@gmail.com',
                username: 'admin',
                fullName: 'Admin User',
                role: 'admin',
                password: 'admin',
                password_confirm: 'admin',
                token: undefined,
                tokenExpiration: undefined,
            });

            await newUser.save();
            console.log('Admin user created.');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (err) {
        console.error('Error checking/creating admin user:', err);
    } finally {
    }
}

module.exports = connectDB;