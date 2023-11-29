const logger = require('../config/logger');
const Customer = require('../models/customer');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.getCustomers = (req, res) => {
    res.render('pages/customers/home', {
        pageTitle: 'Customers Manager - Tech Hut',
    });
};

exports.checkAndParseObjectId = async (req, res, next) => {
    const id = req.params[0];
    try {
        const customer = await Customer.findById(id);
        logger.error(JSON.stringify(customer));
        logger.error(id);

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


exports.getCustomerWithPurchase = async (req, res, next) => {
    let customer = req.customer;
    customer.fullAddress = await customer.getFullAddress();
    console.log(`🚀 🚀exports.getCustomerWithPurchase= 🚀 customer`, customer);

    return res.render('pages/customers/purchase-history', {
        customer,
        pageTitle: 'Customer Purchase History - Tech Hut',
    });
};