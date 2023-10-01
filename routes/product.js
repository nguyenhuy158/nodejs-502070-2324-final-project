const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


// middleware that is specific to this router
router
    .use(productController.logger)
    .get('/', productController.gets)
    .post('/', productController.create)
    .get('/add', productController.add)
    .get('/:id', productController.get)
    .get('/:id/edit', productController.edit)
    .put('/:id/edit', productController.logger)
    .delete('/delete/:id', productController.logger)
    .get('/about', productController.about);

module.exports = router;