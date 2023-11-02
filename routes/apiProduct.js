const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const {upload} = require("../config/upload");

router
    .get("/", productController.getApiProducts);

module.exports = router;