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
            const cart = await Cart.findOne(req.id).populate('products.product');
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

exports.putApiProductIncrement = async (req, res, next) => {
    try {
        const cart = await this.getOrCreateCart(req.user._id);

        await cart.adjustProductQuantity(req.productId, await cart.getQuantityByProductId(req.productId) + 1);
        await cart.save();

        return res.json({ error: false, message: 'Update successfully', cart });
    } catch (error) {
        return res.json({ error: true, message: 'Update successfully' + error });
    }
};

exports.putApiProductDecrement = async (req, res, next) => {
    try {
        const cart = await this.getOrCreateCart(req.user._id);

        await cart.adjustProductQuantity(req.productId, await cart.getQuantityByProductId(req.productId) - 1);
        await cart.save();

        return res.json({ error: false, message: 'Update successfully', cart });
    } catch (error) {
        return res.json({ error: true, message: 'Update successfully' + error });
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
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
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
        if (!cart) return res.json({ error: false, message: 'Cart empty.', cart });
        return res.json({ error: false, message: 'Get cart successfully.', cart });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not gets the cart' + error });
    }
};

exports.getApiCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product');
        if (!carts) return res.json({ error: false, message: 'Carts empty.', carts });
        return res.json({ error: false, message: 'Get carts successfully.', carts });
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
        const cart = await Cart.find(req.id).populate('products.product');
        if (!cart) return res.json({ error: false, message: 'Cart not found.', cart });
        return res.json({ error: false, message: 'Get cart successfully.', cart });
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

// exports.getCartByCurrentLoginUser = async function getCartByCurrentLoginUser(req) {
//     const userId = req.user._id;
//     try {
//         const cart = await Cart.findOne({ user: userId });
//         req.apiCart = cart;
//     } catch (error) {
//         console.log(`🚀 🚀 file: apiCartController.js:181 🚀 getCartByCurrentLoginUser 🚀 error`, error);
//     }
// };

exports.getOrCreateCart = async function getOrCreateCart(userId) {
    let cart = await Cart.findOne({ user: userId }).populate('products.product');

    if (!cart) {
        cart = new Cart({ user: userId });
        await cart.save();
    }

    return cart;
};