const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const currency = require('currency.js');

const logger = require('../config/logger');
const Customer = require('../models/customer');
const Order = require('../models/order');

exports.getCustomers = (req, res) => {
    res.render('pages/customers/home', {
        pageTitle: 'Customers Manager - Tech Hut',
        sideLink: process.env.SIDEBAR_CUSTOMERS,
    });
};

exports.checkAndParseObjectId = async (req, res, next) => {
    const id = req.params[0];
    try {
        const customer = await Customer.findById(id);

        if (!ObjectId.isValid(id) || !customer) {
            return res.status(404).render('pages/auto/user-not-found');
        }

        req.customer = customer;

    } catch (error) {
        logger.error(error);
        return next(error);
    }
    next();
};


exports.getCustomerWithPurchase = async (req, res) => {
    let customer = req.customer;
    customer.fullAddress = await customer.getFullAddress();

    const orders = await Order.find({ customer: customer._id }).populate('products.product');
    customer.orders = orders || [];
    console.log(`🚀 🚀 file: customer-controller.js:42 🚀 exports.getCustomerWithPurchase= 🚀 orders`, orders);
    console.log(`🚀 🚀 file: customer-controller.js:43 🚀 exports.getCustomerWithPurchase= 🚀 customer`, customer);

    return res.render('pages/customers/purchase-history', {
        customer,
        pageTitle: 'Customer Purchase History - Tech Hut',
    });
};
exports.getCustomerWithoutPurchase = async (req, res) => {
    let customer = req.customer;
    customer.fullAddress = await customer.getFullAddress();

    const orders = await Order.find({ customer: customer._id }).populate('products.product');
    customer.orders = orders || [];
    console.log(`🚀 🚀 file: customer-controller.js:42 🚀 exports.getCustomerWithPurchase= 🚀 orders`, orders);
    console.log(`🚀 🚀 file: customer-controller.js:43 🚀 exports.getCustomerWithPurchase= 🚀 customer`, customer);

    return res.render('pages/customers/purchase-history', {
        customer,
        pageTitle: 'Customer Purchase History - Tech Hut',
    });
};