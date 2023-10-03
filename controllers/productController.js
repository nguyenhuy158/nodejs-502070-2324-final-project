const Product = require('../models/productModel');
const { faker } = require('@faker-js/faker');
const moment = require('moment');


async function logger(req, res, next) {
    const timestamp = moment().format('DD/MM/yyyy HH:mm');
    console.log('Timestamp: ', timestamp);
    next();
};

async function add(req, res, next) {
    res.render('pages/products/form');
};

async function about(req, res, next) {
    res.render('pages/about');
};

async function create(req, res, next) {
    const productId = req.params.id;
    const {
        barcode,
        productName,
        importPrice,
        retailPrice,
        imageUrls,
        category,
        creationDate,
        lastUpdateDate,
    } = req.body;

    let product;

    try {

        if (productId) {
            // Editing an existing product
            product = await Product.findByIdAndUpdate(
                productId,
                {
                    barcode,
                    productName,
                    importPrice,
                    retailPrice,
                    imageUrls: imageUrls.split('\n'), // Split image URLs by line breaks
                    category,
                    creationDate,
                    lastUpdateDate,
                },
                { new: true }
            );
        } else {
            // Creating a new product
            product = new Product({
                barcode,
                productName,
                importPrice,
                retailPrice,
                imageUrls: imageUrls.split('\n'), // Split image URLs by line breaks
                category,
                creationDate,
                lastUpdateDate,
            });
            await product.save();
        }

        res.redirect('/products'); // Redirect to the product list page after submission
    } catch (error) {
        // console.error('Error:', error);
        res.render('pages/products/form', { product });
        next(error);
        // res.status(500).send('Internal Server Error');
    }
};

async function edit(req, res, next) {
    try {

        const id = req.params.id;

        const product = await Product.findById({ _id: id });

        res.render('pages/products/form', { product });
    } catch (error) {
        console.error('Error fetching products:', error);
        next(error);
    }
};

async function get(req, res, next) {

    try {
        const id = req.params.id;

        const product = await Product.findById({ _id: id });
        res.render('pages/products/detail', { product });
    } catch (error) {
        console.error('Error fetching products:', error);
        next(error);
    }
};


async function gets(req, res, next) {
    const perPage = parseInt(req.query.perPage) || 10;
    let page = parseInt(req.query.page) || 1;

    try {

        const products = await Product
            .aggregate([{ $sort: { creationDate: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Product.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const output = {
            products,
            current: page,
            count,
            perPage,
            nextPage: hasNextPage ? nextPage : null
        };
        res.render('pages/products/list', output);

    } catch (error) {
        console.error('Error fetching products:', error);
        next(error);
    }
};

async function seedDatabase() {
    const products = [];

    // Generate 50 sample products
    for (let i = 0; i < 50; i++) {
        const product = {
            barcode: faker.string.uuid(),
            productName: faker.commerce.productName(),
            importPrice: faker.number.int({ min: 1000, max: 10000 }),
            retailPrice: faker.number.int({ min: 1000, max: 10000 }),
            imageUrls: [faker.image.url(), faker.image.url(), faker.image.url()],
            category: faker.helpers.arrayElements(['phone', 'accessories'])[0],
            creationDate: faker.date.past(),
            lastUpdateDate: faker.date.recent(),
        };
        products.push(product);
    }

    console.log("🚀 ~ file: productController.js:19 ~ product:", products[0]);

    try {
        // Insert the generated products into the database
        await Product.insertMany(products);
        console.log('Sample products inserted successfully.');
    } catch (err) {
        console.error('Error inserting sample products:', err);
    } finally {
    }
};


module.exports = {
    create,
    logger,
    add,
    about,
    add,
    edit,
    get,
    gets,
    seedDatabase,
};