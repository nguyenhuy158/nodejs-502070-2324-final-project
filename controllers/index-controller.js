
const currency = require('currency.js');
const moment = require('moment');

const ProductCategory = require("../models/product-category");
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const Customer = require("../models/customer");

const productController = require("./product-controller");

const logger = require('../config/logger');
const { categories } = require("./product-category-controller");
const { faker } = require("@faker-js/faker");


exports.checkFirstLogin = (req, res, next) => {
    const user = req.user;

    if (user && (user.isFirstLogin || user.isPasswordReset)) {
        req.flash("info", "You need to change password to continue use system.");
        return res.redirect("/change-password");
    }

    next();
};

async function getBestSellingProduct() {
    const product = await Product.find();

    const salesByProduct = {};
    const orders = await Order.find().populate("products.product");

    orders.forEach(order => {
        order.products.forEach(product => {
            const productId = product.product._id;
            if (salesByProduct[productId]) {
                salesByProduct[productId] += product.quantity;
            } else {
                salesByProduct[productId] = product.quantity;
            }
        });
    });

    const totalAmountByProduct = {};
    orders.forEach(order => {
        order.products.forEach(product => {
            const productId = product.product._id;
            if (totalAmountByProduct[productId]) {
                totalAmountByProduct[productId] += product.salePrice * product.quantity;
            } else {
                totalAmountByProduct[productId] = product.salePrice * product.quantity;
            }
        });
    });

    const sortedProducts = Object.keys(salesByProduct).sort((a, b) =>
        salesByProduct[b] - salesByProduct[a] || totalAmountByProduct[b] - totalAmountByProduct[a]);

    const top3Products = sortedProducts.slice(0, 3);

    return top3Products.map((productId) => ({
        productId,
        productName: product.find(p => p._id == productId).productName,
        imageUrl: product.find(p => p._id == productId).imageUrls[0],
        salesQuantity: salesByProduct[productId],
        salePrice: totalAmountByProduct[productId]
    }));
}

async function getTopSeller() {
    const currentMonthStart = moment().startOf('month');
    const currentMonthEnd = moment().endOf('month');

    const user = await User.find();

    const orders = await Order.find({
        createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd }
    }).populate("products.product");

    // get top 3 seller in current month
    const salesBySeller = {};
    orders.forEach(order => {
        const sellerId = order.seller;
        if (salesBySeller[sellerId]) {
            salesBySeller[sellerId] += order.totalAmount;
        } else {
            salesBySeller[sellerId] = order.totalAmount;
        }
    });

    const sortedSellers = Object.keys(salesBySeller).sort((a, b) =>
        salesBySeller[b] - salesBySeller[a]);

    const top3Sellers = sortedSellers.slice(0, 3);

    const topSeller = top3Sellers.map((sellerId) => ({
        sellerId,
        sellerName: user.find(u => u._id == sellerId).fullName,
        salesAmount: salesBySeller[sellerId],
    }));

    return topSeller;
}

exports.getDashboardPage = async (req, res) => {
    const response = {};
    response.totalOrderOfDay = await Order.find({
        createdAt: {
            $gte: moment().startOf("day"),
            $lte: moment().endOf("day")
        }
    }).countDocuments();

    response.revenueOfDay = (await Order.find({
        createdAt: {
            $gte: moment().startOf("day"),
            $lte: moment().endOf("day")
        }
    })).reduce((total, order) => total + order.totalAmount, 0);

    response.revenueOfMonth = (await Order.find({
        createdAt: {
            $gte: moment().startOf("month"),
            $lte: moment().endOf("month")
        }
    })).reduce((total, order) => total + order.totalAmount, 0);

    response.totalQuantityOfDay = (await Order.find({
        createdAt: {
            $gte: moment().startOf("day"),
            $lte: moment().endOf("day")
        }
    })).reduce((total, order) => total + order.products.reduce((total, product) => total + product.quantity, 0), 0);

    response.bestSellerOfDay = await getBestSellingProduct();

    response.topSeller = await getTopSeller();

    res.render("pages/dashboard", {
        pageTitle: "Dashboard - Tech Hut",
        app_name: process.env.APP_NAME,
        products: await Product.find({}).limit(3),
        sideLink: process.env.SIDEBAR_HOME,
        ...response
    });
};

exports.about = (req, res) => {
    res.render("pages/about", { navLink: "About" });
};

exports.randomProduct = (req, res) => {
    productController.seedDatabaseV1();
    res.redirect("/");
};

async function createSampleDataCustomer() {
    try {
        // Create Customers
        const customers = [];
        for (let i = 0; i < 10; i++) {
            const customer = new Customer({
                phone: faker.phone.number("##########"),
                fullName: faker.person.fullName(),
                address: faker.location.streetAddress(),
            });
            customers.push(customer);
        }
        await Customer.insertMany(customers);

        console.log("Sample customer data created successfully.");
    } catch (error) {
        console.error("Error creating sample customer data:", error);
    }
}

async function createSampleDataProduct() {
    try {
        // Create Product Categories
        const productCategories = await ProductCategory.find();

        // Create Products
        const products = [];
        for (let i = 0; i < 20; i++) {
            const product = new Product({
                barcode: faker.datatype.uuid(),
                productName: faker.commerce.productName(),
                importPrice: faker.datatype.number({
                    min: 1000,
                    max: 1000000000
                }),
                retailPrice: faker.datatype.number({
                    min: 1000,
                    max: 2000000000
                }),
                imageUrls: [faker.image.imageUrl()],
                category: productCategories[Math.floor(Math.random() * productCategories.length)],
                creationDate: faker.date.past(),
                lastUpdateDate: faker.date.recent(),
            });
            products.push(product);
        }
        await Product.insertMany(products);

        console.log("Sample product data created successfully.");
    } catch (error) {
        console.error("Error creating sample product data:", error);
    }
}

async function createSampleDataProductCategory() {
    try {
        // Create Product Categories
        const productCategories = [];
        for (let i = 0; i < 5; i++) {
            const category = new ProductCategory({
                name: faker.commerce.productName(),
                description: faker.lorem.sentence(),
            });
            productCategories.push(category);
        }
        await ProductCategory.insertMany(productCategories);

        console.log("Sample product category data created successfully.");
    } catch (error) {
        console.error("Error creating sample product category data:", error);
    }
}

async function createSampleDataOrder() {
    try {
        // Create Customers and Products
        const customers = await Customer.find();
        const products = await Product.find();

        // Create Orders
        const orders = [];
        for (let i = 0; i < 30; i++) {
            const order = new Order({
                customer: customers[Math.floor(Math.random() * customers.length)],
                products: products
                    .slice(faker.datatype.number({
                        min: 0,
                        max: products.length - 1
                    }))
                    .map((product) => {
                        return {
                            product: product,
                            unitPrice: 100
                        };
                    }),
                totalAmount: faker.datatype.number({
                    min: 10,
                    max: 5000
                }),
                givenAmount: faker.datatype.number({
                    min: 10,
                    max: 6000
                }),
                changeAmount: faker.datatype.number({
                    min: 0,
                    max: 1000
                }),
                purchaseDate: faker.date.recent(),
            });
            orders.push(order);
        }
        await Order.insertMany(orders);

        console.log("Sample order data created successfully.");
    } catch (error) {
        console.error("Error creating sample order data:", error);
    }
}

exports.createSampleData = async function (req, res, next) {
    // await createSampleDataCustomer();
    // await createSampleDataProductCategory();
    // await createSampleDataProduct();
    // await createSampleDataOrder();
    return res.redirect("/");
};

exports.setLocalCategories = async (req, res, next) => {
    try {
        req.app.locals.categories = await categories();
    } catch (error) {
        // console.log(`🚀 🚀 file: indexController.js:10 🚀 exports.setLocalCategories= 🚀 error`, error);
        req.app.locals.categories = [];
    }
    next();
};

exports.setVNDFormat = (req, res, next) => {
    req.app.locals.VND = (value) => currency(value, {
        symbol: '₫',
        precision: 0,
        separator: ',',
        pattern: `# !`,
    });
    next();
};

exports.winstonLog = (req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
};
