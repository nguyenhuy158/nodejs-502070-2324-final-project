const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Cart = require("../models/cart");
const Product = require("../models/product");

const { isNumeric } = require('../utils/utils');

exports.checkAndParseObjectId = async (req, res, next) => {
    const id = req.params[0];
    if (ObjectId.isValid(id)) {
        req.id = new ObjectId(id);
        try {
            const cart = await Cart.findOne(req.id);
            req.apiCart = cart;
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

exports.checkProductIdAndParseObjectId = async (req, res, next) => {
    const productId = req.params.productId;
    if (ObjectId.isValid(productId)) {
        try {
            await Product.findById(productId);
            req.productId = new ObjectId(productId);
            return next();
        } catch (error) {
            res.status(400).json({
                error: true,
                message: 'Product Id not found! please reload and try again!'
            });
        }
    } else {
        res.status(400).json({
            error: true,
            message: 'Product Id not valid! please reload and try again!'
        });
    }
};

exports.checkQuantity = async (req, res, next) => {
    const quantity = req.params.quantity;
    if (isNumeric(quantity)) {
        req.quantity = quantity;
        next();
    } else {
        res.status(400).json({
            error: true,
            message: 'Quantity must be numeric! please reload and try again!'
        });
    }
};

exports.checkCurrentLoginUser = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const cart = await Cart.findOne({ user: userId });
        req.apiCart = cart;
        next();
    } catch (error) {
        res.status(400).json({
            error: true,
            message: 'Current login user not found! please reload and try again!'
        });
    }
};

exports.getApiCartByCurrentLoginUser = async (req, res) => {
    try {
        const cart = req.apiCart;
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not gets the cart' + error });
    }
};

exports.getApiCarts = async (req, res) => {
    try {
        const carts = await Cart.find();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not gets the carts' + error });
    }
};

// exports.postApiCart = async (req, res) => {
//     try {
//         const { phone, fullName, address } = req.body;

//         const cart = new Cart({ phone, fullName, address });

//         await cart.save();

//         res.status(201).json(Cart);
//     } catch (error) {
//         res.status(500).json({ error: true, message: 'Could not create the cart' + error });
//     }
// };

exports.getApiCart = async (req, res) => {
    try {
        const cart = await Cart.find(req.id);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not get the cart' + error });
    }
};

exports.putApiCart = async (req, res) => {
    try {
        const cart = req.apiCart;
        const productId = req.apiCartProductId;
        const quantity = req.apiCartQuantity;

        const exists = cart.productExists(productId);

        if (exists) {
            cart.adjustProductQuantity(productId, quantity);
        } else {
            cart.addProduct(productId, quantity);
        }

        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not update the cart' + error });
    }
};

exports.clearApiCartById = async (req, res) => {
    try {
        const cart = req.apiCart;
        cart.clearAllProducts();

        await cart.save();

        return res.json({
            error: false,
            cart,
            message: "Clear successfully"
        });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not clear the cart' + error });
    }
};

exports.deleteApiCartById = async (req, res) => {
    try {
        const id = req.id;
        const cart = await Cart.findByIdAndDelete(id);
        return res.json({
            error: false,
            cart,
            message: "Deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not delete the cart' + error });
    }
};
