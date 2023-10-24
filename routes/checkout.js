const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');


router
    .get('', checkoutController.get)
    .post('/get-customer', checkoutController.getCustomer);

module.exports = router;