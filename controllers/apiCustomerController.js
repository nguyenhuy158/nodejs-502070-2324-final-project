const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Customer = require("../models/customer");


exports.checkAndParseObjectId = async (req, res, next) => {
    const id = req.params.id;
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
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not gets the customers' + error });
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
    const phone = req.params.phone;
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
        res.json(customer);
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
