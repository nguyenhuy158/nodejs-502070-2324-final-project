const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, default: 1 },
        },
    ],
}, {
    timestamps: true,
});

cartSchema.methods.getQuantityByProductId = async function (productId) {
    const productIndex = this.products.findIndex(item => item.product.equals(productId));
    if (productIndex !== -1) {
        return this.products[productIndex].quantity;
    }
    return 0;
}

cartSchema.methods.calculateTotalPrice = async function () {
    let total = 0;

    for (const productItem of this.products) {
        const product = await mongoose.model("Product").findById(productItem.product);

        if (product) {
            total += product.retailPrice * productItem.quantity;
        }
    }

    return total;
};

cartSchema.methods.productExists = function (productId) {
    return this.products.some(item => item.product.equals(productId));
};

cartSchema.methods.adjustProductQuantity = function (productId, newQuantity) {
    const productIndex = this.products.findIndex(item => item.product.equals(productId));
    if (productIndex !== -1) {
        this.products[productIndex].quantity += newQuantity;
    }
};

cartSchema.methods.updateProductQuantity = function (productId, newQuantity) {
    const productIndex = this.products.findIndex(item => item.product.equals(productId));
    if (productIndex !== -1) {
        this.products[productIndex].quantity = newQuantity;
    }
};

cartSchema.methods.addProduct = function (productId, quantity = 1) {
    const productIndex = this.products.findIndex(item => item.product.equals(productId));

    if (productIndex !== -1) {
        this.products[productIndex].quantity += quantity;
    } else {
        this.products.push({ product: productId, quantity });
    }
};

cartSchema.methods.clearAllProducts = function () {
    this.products = [];
};

module.exports = mongoose.model("Cart", cartSchema);