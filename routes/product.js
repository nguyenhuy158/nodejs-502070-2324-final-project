const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const {upload} = require("../config/upload");

router
    // .get('/', authController.checkAdmin, productController.gets)
    .get("/", productController.gets)
    .get("/add", productController.add)
    .post("/", upload.array("imageUrls", 5), productController.create)
    .get(/^\/([0-9a-fA-F]{24})$/, productController.detail)
    .put(/^\/([0-9a-fA-F]{24})$/, upload.array("imageUrls", 5), productController.update)
    .get("/:id/edit", productController.edit)
    // .post("/:id/edit", productController.update)
    .delete(/^\/([0-9a-fA-F]{24})$/, productController.delete)
    .get("/about", productController.gets)
    .post("/:id/imageUrls", upload.array("imageUrls", 5), productController.addThumbnails)
    .put("/:id/imageUrls", productController.removeThumbnails)
    .put("/:id/main-thumbnail", productController.mainThumbnail);

module.exports = router;