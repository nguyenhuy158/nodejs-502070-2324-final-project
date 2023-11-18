const ProductCategory = require("../models/product-category");


exports.categories = () => ProductCategory.find()
    .sort({ name: 1 });