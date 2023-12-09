const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderId: { type: String, unique: true },

    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, default: 1 },
            salePrice: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    subtotalAmount: { type: Number, required: true },
    givenAmount: { type: Number, required: true },
    changeAmount: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
    discount: { type: Number, default: 0 },

    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true,
});

// // Pre-save middleware to generate the orderId
// orderSchema.pre('save', async function (next) {
//     try {
//         if (!this.orderId) {
//             const count = await mongoose.model('Order').countDocuments({});
//             // Format the count to a six-digit string
//             const formattedCount = String(count + 1).padStart(6, '0');
//             this.orderId = formattedCount;
//         }
//         next();
//     } catch (err) {
//         next(err);
//     }
// });

// Pre-save middleware to generate the orderId and compute subtotal and total
orderSchema.pre('save', async function (next) {
    try {
        if (!this.orderId) {
            const count = await mongoose.model('Order').countDocuments({});
            // Format the count to a six-digit string
            const formattedCount = String(count + 1).padStart(6, '0');
            this.orderId = formattedCount;
        }

        // Compute subtotalAmount based on products' salePrice and quantity
        this.subtotalAmount = this.products.reduce((total, product) => {
            return total + (product.salePrice * product.quantity);
        }, 0);

        // Apply discount if available
        const discountedAmount = this.subtotalAmount * (this.discount / 100);
        this.totalAmount = this.subtotalAmount - discountedAmount;

        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("Order", orderSchema);

