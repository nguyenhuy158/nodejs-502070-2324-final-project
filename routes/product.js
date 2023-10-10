const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const { currentTime } = require('../utils/format');

router
    .use((req, res, next) => {
        console.log('[controller] product controller');
        console.log('[controller] Time: ', currentTime);
        next();
    })
    .get('/', authController.checkAdmin, productController.gets)
    .post('/', productController.create)
    .get('/add', productController.add)
    .get('/:id', productController.get)
    .get('/:id/edit', productController.edit)
    .put('/:id/edit', productController.gets)
    .delete('/delete/:id', productController.gets)
    .get('/about', productController.gets);

module.exports = router;