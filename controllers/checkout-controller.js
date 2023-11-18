const Customer = require('../models/customer');
const Cart = require('../models/customer');
const Order = require('../models/order');

const { getOrCreateCart } = require('./api-cart-controller');
const { getOrCreateCustomer } = require('./api-customer-controller');

exports.checkout = async (req, res) => {
    const { phone, fullName, address, region, district, ward, givenAmount } = req.body;

    try {
        const cart = await getOrCreateCart(req.user._id);
        const { customer, flagNewCustomer } = await getOrCreateCustomer(phone);
        if (flagNewCustomer) {
            customer.setAddress(region, district, ward, address);
            customer.setFullName(fullName);
            await customer.save();
        }

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

exports.checkAndParseObjectId = async (req, res, next) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: true, message: 'Missing id' });
    try {
        const order = await Order.findById(id);

        if (order) {
            req.order = order;
            return next();
        }

        return res.status(400).json({ error: true, message: 'Invalid id' });
    } catch (error) {
        return res.status(400).json({ error: true, message: 'Invalid id' });
    }
};

exports.getOrderById = (req, res) => {
    const order = req.order;
    res.json({ error: false, order });
};  
