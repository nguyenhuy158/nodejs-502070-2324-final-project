const Customer = require('../models/customer');
const Cart = require('../models/customer');
const Order = require('../models/order');

const { getOrCreateCart } = require('./apiCartController');
const { getOrCreateCustomer } = require('./apiCustomerController');

exports.checkout = async (req, res, next) => {
    const { phone, givenAmount } = req.body;

    try {
        const cart = await getOrCreateCart(req.user._id);
        const customer = await getOrCreateCustomer(phone);

        const totalAmount = await cart.calculateTotalPrice();

        const order = new Order({
            customer,
            products: cart.products.map(p => {
                return {
                    product: p.product._id,
                    quantity: p.quantity,
                    unitPrice: p.product.retailPrice,
                };
            }),
            totalAmount,
            givenAmount,
            changeAmount: totalAmount - givenAmount,
        });

        await order.save();
        return res.json({ error: false, message: 'Get order successfully.', order });
    } catch (error) {
        console.log(`🚀 🚀 file: checkoutController.js:13 🚀 exports.checkout= 🚀 error`, error);
        res.status(500).json({ error: true, message: 'Could not delete the cart' + error });
    }
};

exports.get = async (req, res, next) => {
    try {
        const carts = await Cart.find();
        return res.render('pages/checkouts/home', { carts, sideLink: process.env.SIDEBAR_CHECKOUT });
    } catch (error) {
        next(error);
    }
};

exports.getCustomer = async (req, res, next) => {
    const { phone } = req.body;
    // const customer = { phone };
    try {

        const customer = await Customer.findOne({ phone });
        res.json({
            error: false,
            customer,
            message: 'Get data success'
        });
    } catch (error) {
        return res.json({
            error: true,
            message: error
        });
    }
};