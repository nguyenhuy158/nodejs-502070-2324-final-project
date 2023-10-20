const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

router
    // .get('/', authController.checkAdmin, productController.gets)
    .get("/", productController.gets)
    .post("/", productController.create)
    .get("/add", productController.add)
    .get("/:id", productController.detail)
    .get("/:id/edit", productController.edit)
    .post("/:id/edit", productController.update)
    .put("/:id/edit", productController.gets)
    .delete("/:id", productController.delete)
    .get("/about", productController.gets);

module.exports = router;