
const mongoose = require("mongoose");
const User = require("../models/user");
const ProductCategory = require("../models/product-category");
const logger = require("./logger");

exports.connectDb = async () => {
    try {
        mongoose.set("strictQuery", false);
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        mongoose.connection.on("connected", () => {
            logger.info("[DB] Connected to DB successfully.");
        });
        mongoose.connection.on("error", (error) => {
            logger.info(`[DB] Error while connecting to DB. ${error}`);
        });
        mongoose.connection.on("disconnected", () => {
            logger.info("[DB] DB connection disconnected.");
        });

        logger.info(`[DB] Database connected ${connect.connection.host}`);
        checkAndCreateAdminUser();
        checkAndCreateDefaultCategory();
    } catch (error) {
        logger.error("[DB] error:", error);
    }
};

async function checkAndCreateDefaultCategory() {
    try {
        const phoneCategoryExists = await ProductCategory.exists({ name: "Phone" });

        const accessoriesCategoryExists = await ProductCategory.exists({ name: "Accessories" });

        if (!phoneCategoryExists) {
            const phoneCategory = new ProductCategory({
                name: "Phone",
                description: "Category for mobile phones and smartphones",
            });
            await phoneCategory.save();
        }

        if (!accessoriesCategoryExists) {
            const accessoriesCategory = new ProductCategory({
                name: "Accessories",
                description: "Category for various accessories for electronic devices",
            });
            await accessoriesCategory.save();
        }

        logger.info("Product categories created or checked successfully.");
    } catch (error) {
        logger.error("Error creating/checking product categories:", error);
    }
}

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
            logger.info("[DB] Admin user created.");
        } else {
            logger.info("[DB] Admin user already exists.");
        }
    } catch (err) {
        logger.error("[DB] Error checking/creating admin user:", err);
    }
}