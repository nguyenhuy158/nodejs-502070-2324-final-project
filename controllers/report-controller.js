/* eslint-disable no-unused-vars */

const moment = require('moment');

const Order = require('../models/order');
const Customer = require('../models/customer');
const User = require('../models/user');
const Product = require('../models/product');
const ProductCategories = require('../models/product-category');


exports.getReportPage = (req, res) => {
    res.render('pages/reports/home', {
        pageTitle: 'Report - Tech Hut',
        sideLink: process.env.SIDEBAR_REPORTS,
    });
};

exports.extractQueryParams = (req, res, next) => {
    try {

        const from = req.query.from;
        const to = req.query.to;

        if (!from || !to) {
            return res.status(400).json({
                message: "Missing query parameters (need from and to)"
            });
        }

        if (moment(from) > moment(to)) {
            return res.status(400).json({
                message: "From date must be before to date"
            });
        }

        req.fromDate = new Date(from);
        req.toDate = new Date(to);
        req.fromDate = moment(req.fromDate).startOf('day').toDate();
        req.toDate = moment(req.toDate).endOf('day').toDate();
    } catch (error) {
        return res.status(400).json({
            message: "Invalid query parameters"
        });
    }
    next();
};

exports.getStatisticalPage = async (req, res) => {
    let data = [];
    const fromDate = req.fromDate;
    const toDate = req.toDate;

    data = await Order.find({
        purchaseDate: { $gte: fromDate, $lte: toDate },
    });

    data = data.map((order) => ({
        purchaseDateShort: moment(order.purchaseDate).format('DD/MM/YYYY'),
        purchaseDate: moment(order.purchaseDate).format('DD/MM/YYYY HH:mm:ss'),
        totalAmount: order.totalAmount,
    }));

    return res.json({
        data,
        fromDate,
        toDate,
        message: "Get data successfully"
    });
};

exports.getProfitPage = async (req, res) => {
    try {
        let data = [];
        const fromDate = req.fromDate;
        const toDate = req.toDate;

        const type = req.query.type;

        if (!['DD-MM-YYYY', 'MM-YYYY', 'YYYY'].includes(type)) {
            return res.status(400).json({
                error: true,
                message: 'Invalid type, type is DD-MM-YYYY, MM-YYYY, YYYY'
            });
        }

        data = await Order.find({
            purchaseDate: { $gte: fromDate, $lte: toDate },
        });

        // compute profit by day, month or year by type in data
        let response = data.reduce((acc, order) => {
            const date = moment(order.purchaseDate).format(type);
            if (!acc[date]) {
                acc[date] = {
                    purchaseDate: date,
                    totalAmount: 0,
                    totalProfit: 0,
                    totalQuantity: 0,
                };
            }
            acc[date].totalAmount += order.totalAmount;
            acc[date].totalProfit += order.totalAmount - order.subtotalAmount;
            acc[date].totalQuantity += order.products.reduce((total, product) => {
                return total + product.quantity;
            }, 0);
            return acc;
        }, {});

        response = {
            data: Object.values(response),
            fromDate,
            toDate,
            message: "Get data successfully"
        };
        // console.log(`🚀 response`, response);
        return res.json(response);
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: "Internal server error" + error
        });
    }
};

exports.getCustomerStatist = async (req, res) => {
    // get id customer from query
    let data = [];
    const fromDate = req.fromDate;
    const toDate = req.toDate;

    try {
        // get all orders by customer ID from the database
        const customerStats = await Order.aggregate([
            {
                $match: {
                    purchaseDate: {
                        $gte: new Date(fromDate),
                        $lte: new Date(toDate),
                    },
                },
            },
            {
                $group: {
                    _id: '$customer',
                    totalAmountSpent: { $sum: '$totalAmount' },
                },
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'customerInfo',
                },
            },
            {
                $project: {
                    _id: 0,
                    customer: {
                        $arrayElemAt: ['$customerInfo', 0],
                    },
                    totalAmountSpent: 1,
                },
            },
        ]);


        console.log(`🚀 customerStats`, customerStats);
        let response = {
            data: customerStats,
            fromDate,
            toDate,
            message: "Get data successfully"
        };
        return res.json(response);

    } catch (error) {
        // handle the error
        return res.status(400).json({
            error: true,
            message: "Internal server error" + error
        });
    }
};

exports.getSellerStatist = async (req, res) => {
    const fromDate = req.fromDate;
    const toDate = req.toDate;

    try {
        // Aggregate totalAmount sold by each seller
        const sellerStats = await Order.aggregate([
            {
                $match: {
                    purchaseDate: {
                        $gte: new Date(fromDate),
                        $lte: new Date(toDate),
                    },
                },
            },
            {
                $group: {
                    _id: '$seller',
                    totalAmountSold: { $sum: '$totalAmount' },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'sellerInfo',
                },
            },
            {
                $project: {
                    _id: 0,
                    seller: {
                        $arrayElemAt: ['$sellerInfo', 0],
                    },
                    totalAmountSold: 1,
                },
            },
        ]);

        let response = {
            data: sellerStats,
            fromDate,
            toDate,
            message: 'Get data successfully',
        };
        return res.json(response);

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            error: true,
            message: 'Internal server error',
        });
    }
};