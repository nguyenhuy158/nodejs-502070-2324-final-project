const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


// middleware that is specific to this router
router
    .use((req, res, next) => {
        console.log('Time: ', Date.now());
        next();
    })
    .get('/', productController.gets)
    .get('/:id', productController.get)
    .get('/edit/:id', productController.edit)
    .get('/about', (req, res) => {
        res.render('pages/about');
    });

module.exports = router;