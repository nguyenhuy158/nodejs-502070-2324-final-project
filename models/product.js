const mongoose = require("mongoose");
const { formatTimestamp } = require("../utils/format");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    barcode: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    productName: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    importPrice: {
        type: Number,
        min: 1000
    },
    retailPrice: {
        type: Number,
        min: 1000
    },
    imageUrls: {
        type: [String],
    },
    desc: { type: String },
    category: {
        type: Schema.Types.ObjectId,
        ref: "ProductCategory"
    },
    creationDate: { type: Date },
    lastUpdateDate: { type: Date },
}, {
    timestamps: true,
});

productSchema.virtual("creationDateFormatted")
    .get(function () {
        return formatTimestamp(this.creationDate);
    });

productSchema.virtual("lastUpdateDateFormatted")
    .get(function () {
        return formatTimestamp(this.lastUpdateDate);
    });

productSchema.virtual("createdAtFormatted")
    .get(function () {
        return formatTimestamp(this.createdAt);
    });

productSchema.virtual("updatedAtFormatted")
    .get(function () {
        return formatTimestamp(this.updatedAt);
    });

module.exports = mongoose.model("Product", productSchema);
