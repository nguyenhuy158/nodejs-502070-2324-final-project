const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

router
    .use((req, res, next) => {
        console.log('[controller] product controller');
        console.log('Time: ', require('dateformat')(new Date(), " hh:MM:ss dd/mm/yyyy"));
        next();
    })
    .get('/', authController.checkAdmin, productController.gets)
    .post('/', productController.create)
    .get('/add', productController.add)
    .get('/:id', productController.get)
    .get('/:id/edit', productController.edit);
// .put('/:id/edit', productController.logger)
// .delete('/delete/:id', productController.logger)
// .get('/about', productController.about);

module.exports = router;