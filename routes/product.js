const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


// middleware that is specific to this router
router
    .use((req, res, next) => {
        console.log('Time: ', Date.now());
        next();
    })
    .get('/', (req, res) => {
        res.render('pages/products/product-home');
    })
    .get('/about', (req, res) => {
        res.render('pages/about');
    });

module.exports = router;