const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Order = require('../models/order');

exports.getOrders = (req, res) => {
    res.render('pages/orders/home', {
        pageTitle: 'Orders Manager - Tech Hut',
        sideLink: process.env.SIDEBAR_ORDERS,
    });
};

exports.getOrder = (req, res) => {
    res.render('pages/orders/detail', {
        pageTitle: 'Order detail - Tech Hut',
        sideLink: '',
        order: req.order,
    });
};

exports.checkOrderIdAndParseObjectId = async (req, res, next) => {
    const id = req.params[0];
    try {
        req.order = await Order.findById(id)
            .populate('products.product')
            .populate('products.product.category');

        next();
    } catch (error) {
        next(error);
    }
};