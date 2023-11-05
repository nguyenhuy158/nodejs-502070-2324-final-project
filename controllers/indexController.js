const winstonLogger = require('../config/logger');
const { categories } = require("../controllers/productCategoryController");



exports.setLocalCategories = async (req, res, next) => {
    try {
        req.app.locals.categories = await categories();
    } catch (error) {
        console.log(`🚀 🚀 file: indexController.js:10 🚀 exports.setLocalCategories= 🚀 error`, error);
        req.app.locals.categories = [];
    }
    next();
};

exports.winstonLog = (req, res, next) => {
    winstonLogger.info(`${req.method} ${req.url}`);
    next();
};