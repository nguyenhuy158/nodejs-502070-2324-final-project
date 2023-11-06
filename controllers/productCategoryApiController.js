const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const ProductCategory = require("../models/productCategory");

exports.checkAndParseObjectId = async (req, res, next) => {
    const id = req.params[0];
    if (ObjectId.isValid(id)) {
        req.id = new ObjectId(id);
        try {
            req.apiProductCategory = await ProductCategory.findOne(req.id);
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

exports.getApiProductCategories = async (req, res) => {
    try {
        const productCategories = await ProductCategory.find();
        res.json(productCategories);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not gets the product categories' + error });
    }
};

exports.postApiProductCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const productCategory = new ProductCategory({
            name, description
        });

        await productCategory.save();

        res.status(201).json(productCategory);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not create the product category' + error });
    }
};

exports.getApiProductCategory = async (req, res) => {
    try {
        const id = req.id;
        const productCategory = await ProductCategory.findById(id);
        res.json(productCategory);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not get the product category' + error });
    }
};

exports.putApiProductCategory = async (req, res) => {
    try {
        const id = req.id;
        const productCategory = await ProductCategory.findOneAndUpdate(id, { $set: req.body }, { new: true });
        res.json(productCategory);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not update the product category' + error });
    }
};

exports.deleteApiProductCategoryById = async (req, res) => {
    try {
        const id = req.id;
        const product = await ProductCategory.findByIdAndDelete(id);
        return res.json({
            error: false,
            product,
            message: "Deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not delete the product category' + error });
    }
};
