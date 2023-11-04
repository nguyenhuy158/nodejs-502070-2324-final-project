const express = require("express");
const router = express.Router();
const productApiController = require("../controllers/productApiController.js");
const authController = require("../controllers/authController");
const { upload } = require("../config/upload");

router
    .get("/",
        productApiController.getApiProducts)
    .delete("/:id",
        productApiController.checkAndParseObjectId,
        productApiController.deleteApiProductsById);

module.exports = router;