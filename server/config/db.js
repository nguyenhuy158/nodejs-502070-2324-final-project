require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../../models/userModel');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`[db] Database connected ${connect.connection.host}`);
        checkAndCreateAdminUser();
    } catch (error) {
        console.log("[db] error:", error);
    }
};

async function checkAndCreateAdminUser() {
    try {
        const adminUser = await User.findOne({ username: process.env.DEFAULT_ACCOUNT_USERNAME_ADMIN });
        if (!adminUser) {
            const newUser = new User({
                email: process.env.EMAIL_USERNAME,
                username: process.env.DEFAULT_ACCOUNT_USERNAME_ADMIN,
                fullName: process.env.APP_NAME,
                role: process.env.ROLE_ADMIN,
                isFirstLogin: false,
                password: process.env.DEFAULT_ACCOUNT_PASSWORD_ADMIN,
                password_confirm: process.env.DEFAULT_ACCOUNT_PASSWORD_ADMIN,
                token: undefined,
                tokenExpiration: undefined,
            });

            await newUser.save();
            console.log('[db] Admin user created.');
        } else {
            console.log('[db] Admin user already exists.');
        }
    } catch (err) {
        console.error('[db] Error checking/creating admin user:', err);
    } finally {
    }
}

module.exports = connectDB;