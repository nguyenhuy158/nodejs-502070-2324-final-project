const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Product = require("../models/product");
const { processImageUrlsBeforeStore } = require('./productController');

exports.checkAndParseObjectId = async (req, res, next) => {
    const id = req.params.id;
    if (ObjectId.isValid(id)) {
        req.id = new ObjectId(id);
        try {
            await Product.findOne(req.id).populate("category");
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

exports.postApiProduct = async (req, res) => {
    try {
        const {
            barcode,
            productName,
            importPrice,
            retailPrice,
            category
        } = req.body;
        const imageUrls = await processImageUrlsBeforeStore(req.files);

        const product = new Product({
            barcode,
            productName,
            importPrice,
            retailPrice,
            imageUrls,
            category,
        });

        await product.save();

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not create the product' + error });
    }
};

exports.getApiProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category");
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not gets the products' + error });
    }
};

exports.getApiProduct = async (req, res) => {
    try {
        const id = req.id;
        const product = await Product.findOne(id).populate("category");
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not get the product' + error });
    }
};

exports.putApiProduct = async (req, res) => {
    try {
        const id = req.id;

        const product = await Product.findOneAndUpdate(id, { $set: req.body }, { new: true });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not update the product' + error });
    }
};

exports.deleteApiProductById = async (req, res) => {
    try {
        const id = req.id;
        const product = await Product.findByIdAndDelete(id);
        return res.json({
            error: false,
            product,
            message: "Deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not delete the product' + error });
    }
};