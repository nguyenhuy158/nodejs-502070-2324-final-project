const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout-controller');


router
    .get('', checkoutController.getCheckoutPage)
    .post('', checkoutController.checkout)
    .get(/^\/([0-9a-fA-F]{24})$/, checkoutController.checkAndParseObjectId, checkoutController.getOrderById)
    .post('/get-customer', checkoutController.getCustomer)
    .get(/^\/recipe\/([0-9a-fA-F]{24})$/, checkoutController.checkAndParseObjectId, checkoutController.getRecipe);

module.exports = router;