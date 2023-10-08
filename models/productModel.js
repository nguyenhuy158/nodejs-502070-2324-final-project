const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    barcode: { type: String, unique: true, required: true, trim: true },
    productName: { type: String, required: true, trim: true, minlength: 6 },
    importPrice: { type: Number, min: 1000 },
    retailPrice: { type: Number, min: 1000 },
    imageUrls: {
        type: [String],
        validate: {
            validator: function (value) {
                const urlRegex = /^(http|https):\/\/[^\s/$.?#].[^\s]*$/;
                return value.every(url => urlRegex.test(url));
            },
            message: 'One or more image URLs are not valid.'
        }
    },
    category: { type: String, enum: ['phone', 'accessories'] },
    creationDate: { type: Date },
    lastUpdateDate: { type: Date },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
