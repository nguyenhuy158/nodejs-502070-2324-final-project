const Product = require("../models/product");
const ProductCategory = require("../models/productCategory");
const { faker } = require("@faker-js/faker");
const moment = require("moment");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const {
    uploadImage,
    removeImageByUrl
} = require("../middlewares/utils");
const { categories } = require("./productCategoryController");
const { processImageUrlsBeforeStore } = require('./productController');

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
        console.log(`🚀 ---------------------------------------------------------------------------------🚀`);
        console.log(`🚀 🚀 file: productApiController.js:41 🚀 exports.postApiProduct= 🚀 error`, error);
        console.log(`🚀 ---------------------------------------------------------------------------------🚀`);
        res.status(500).json({ error: true, message: 'Could not create the product' });
    }
};

exports.getApiProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category");
        res.json(products);
    } catch (error) {
        res.json({});
    }
};

exports.getApiProduct = async (req, res) => {
    try {
        const id = req.id;
        const product = await Product.findOne(id).populate("category");
        res.json(product);
    } catch (error) {
        res.json({});
    }
};

exports.putApiProduct = async (req, res) => {
    try {
        const id = req.id;

        const product = await Product.findOneAndUpdate(id, { $set: req.body }, { new: true });
        res.json(product);
    } catch (error) {
        res.json({});
    }
};

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

exports.deleteApiProductsById = async (req, res) => {
    try {
        const id = req.id;
        const product = await Product.findByIdAndDelete(id);
        return res.json({
            error: false,
            product,
            message: "Deleted successfully"
        });
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: 'Please reload and try again!'
        });
    }
};