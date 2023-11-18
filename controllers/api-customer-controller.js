const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Customer = require("../models/customer");


exports.checkAndParseObjectId = async (req, res, next) => {
    const id = req.params[0];
    if (ObjectId.isValid(id)) {
        req.id = new ObjectId(id);
        try {
            await Customer.findOne(req.id);
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

exports.getApiCustomers = async (req, res) => {
    try {
        let customers = await Customer.find();

        customers = await Promise.all(customers.map(async (customer) => ({
            ...customer.toObject(),
            address: await customer.getFullAddress(),
            birthDay: customer.getBirthDay()
        })));

        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not get the customers' + error });
    }
};


exports.postApiCustomer = async (req, res) => {
    try {
        const { phone, fullName, address } = req.body;

        const customer = new Customer({ phone, fullName, address });

        await customer.save();

        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not create the customer' + error });
    }
};

exports.getApiCustomer = async (req, res) => {
    try {
        const customer = await Customer.find(req.id);
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not get the customer' + error });
    }
};

exports.checkAndCheckPhone = async (req, res, next) => {
    const phone = req.params[0];
    console.log(`🚀 🚀 file: apiCustomerController.js:62 🚀 exports.checkAndCheckPhone= 🚀 req.params`, req.params);
    console.log(`🚀 🚀 file: apiCustomerController.js:61 🚀 exports.checkAndCheckPhone= 🚀 phone`, phone);
    try {
        const customer = await Customer.findOne({ phone });
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
        const customer = await Customer.findOne({ phone: req.phone });
        if (!customer) return res.json({ error: false, message: 'Customer no payment before.', customer });
        return res.json({ error: false, message: 'Get info customer successfully.', customer });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not get the customer by phone' + error });
    }
};


exports.putApiCustomer = async (req, res) => {
    try {
        const id = req.id;

        const customer = await Customer.findOneAndUpdate(id, { $set: req.body }, { new: true });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not update the customer' + error });
    }
};

exports.deleteApiCustomerById = async (req, res) => {
    try {
        const id = req.id;
        const customer = await Customer.findByIdAndDelete(id);
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
    let customer = await Customer.findOne({ phone });
    let flagNewCustomer = false;

    if (!customer) {
        customer = new Customer({ phone });
        await customer.save();
        flagNewCustomer = true;
    }

    return { customer, flagNewCustomer };
};