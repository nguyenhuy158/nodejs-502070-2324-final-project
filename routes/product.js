const express    = require("express");
const router     = express.Router();
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const { upload } = require("../config/upload");

router
    // .get('/', authController.checkAdmin, productController.gets)
    .get("/", productController.gets)
    .get("/add", productController.add)
    .post("/", upload.array("imageUrls", 5), productController.create)
    .get("/:id", productController.detail)
    .get("/:id/edit", productController.edit)
    .post("/:id/edit", productController.update)
    .put("/:id/edit", productController.gets)
    .delete("/:id", productController.delete)
    .get("/about", productController.gets);

module.exports = router;