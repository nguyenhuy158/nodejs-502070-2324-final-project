const Product = require('../models/productModel');
const { faker } = require('@faker-js/faker');

exports.gets = async (req, res) => {
    const perPage = 10;
    let page = req.query.page || 1;

    try {
        const products = await Product.find();
        console.log("🚀 ~ file: productController.js:7 ~ exports.gets= ~ products:", products);

        res.render('pages/products/list', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.seedDatabase = async function () {
    const products = [];

    // Generate 50 sample products
    for (let i = 0; i < 50; i++) {
        const product = {
            barcode: faker.string.uuid(),
            productName: faker.commerce.productName(),
            importPrice: faker.number.int({ min: 1000, max: 10000 }),
            retailPrice: faker.number.int({ min: 1000, max: 10000 }),
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
