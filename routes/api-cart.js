const express = require("express");
const router = express.Router();
const apiCartController = require("../controllers/api-cart-controller");



// api/carts/
router
    .get("/",
        apiCartController.getApiCarts)
    // .post("/",
    //     apiCartController.postApiCart)
    .get(/^\/([0-9a-fA-F]{24})$/,
        apiCartController.checkAndParseObjectId,
        apiCartController.getApiCart)
    .get("/current",
        apiCartController.checkCurrentLoginUser,
        apiCartController.getApiCartByCurrentLoginUser)
    .put("/products/:productId/increment",
        apiCartController.checkProductIdAndParseObjectId,
        apiCartController.putApiProductIncrement)
    .put("/products/:productId/decrement",
        apiCartController.checkProductIdAndParseObjectId,
        apiCartController.putApiProductDecrement)
    .put("/:id/:productId/:quantity",
        apiCartController.checkAndParseObjectId,
        apiCartController.checkProductIdAndParseObjectId,
        apiCartController.checkQuantity,
        apiCartController.putApiCart
    )
    .put("/:id/clear",
        apiCartController.checkAndParseObjectId,
        apiCartController.clearApiCartById
    )
    .delete("/products/:productId",
        apiCartController.checkProductIdAndParseObjectId,
        apiCartController.deleteApiProduct)
    .delete(/^\/([0-9a-fA-F]{24})$/,
        apiCartController.checkAndParseObjectId,
        apiCartController.deleteApiCartById);

module.exports = router;