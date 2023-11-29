const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Order = require("../models/order");


exports.checkAndParseObjectId = async (req, res, next) => {
    const id = req.params[0];
    if (ObjectId.isValid(id)) {
        req.id = new ObjectId(id);
        try {
            await Order.findOne(req.id);
            return next();
        } catch (error) {
            res.status(400).json({
                error: true,
                message: 'Id not found! please reload and try again!'
            });
        }
    } else {
        res.status(400).json({
            error: true,
            message: 'Id not valid! please reload and try again!'
        });
    }
};

exports.getApiOrders = async (req, res) => {
    try {
        let orders = await Order.find().populate('products.product').populate('customer');

        // orders = await Promise.all(orders.map(async (customer) => ({
        //     ...customer.toObject(),
        //     address: await customer.getFullAddress(),
        //     birthDay: customer.getBirthDay()
        // })));

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not get the customers' + error });
    }
};


exports.postApiCustomer = async (req, res) => {
    try {
        const { phone, fullName, address } = req.body;

        const customer = new Order({ phone, fullName, address });

        await customer.save();

        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not create the customer' + error });
    }
};

exports.getApiCustomer = async (req, res) => {
    try {
        const customer = await Order.find(req.id);
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not get the customer' + error });
    }
};

exports.checkAndCheckPhone = async (req, res, next) => {
    const phone = req.params[0];
    console.log(`🚀 🚀 file: apiOrderController.js:62 🚀 exports.checkAndCheckPhone= 🚀 req.params`, req.params);
    console.log(`🚀 🚀 file: apiOrderController.js:61 🚀 exports.checkAndCheckPhone= 🚀 phone`, phone);
    try {
        const customer = await Order.findOne({ phone });
        req.apiCustomer = customer;
        return next();
    } catch (error) {
        res.status(400).json({
            error: true,
            message: 'Phone not found! please reload and try again!'
        });
    }
};

exports.getApiCustomerByPhone = async (req, res) => {
    try {
        const customer = await Order.findOne({ phone: req.phone });
        if (!customer) return res.json({ error: false, message: 'Customer no payment before.', customer });
        return res.json({ error: false, message: 'Get info customer successfully.', customer });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not get the customer by phone' + error });
    }
};


exports.putApiCustomer = async (req, res) => {
    try {
        const id = req.id;

        const customer = await Order.findOneAndUpdate(id, { $set: req.body }, { new: true });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not update the customer' + error });
    }
};

exports.deleteApiCustomerById = async (req, res) => {
    try {
        const id = req.id;
        const customer = await Order.findByIdAndDelete(id);
        return res.json({
            error: false,
            customer,
            message: "Deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not delete the customer' + error });
    }
};

exports.getOrCreateCustomer = async function getOrCreateCustomer(phone) {
    let customer = await Order.findOne({ phone });
    let flagNewCustomer = false;

    if (!customer) {
        customer = new Order({ phone });
        await customer.save();
        flagNewCustomer = true;
    }

    return { customer, flagNewCustomer };
};