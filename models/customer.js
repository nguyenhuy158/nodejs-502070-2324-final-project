const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    phone: { type: String, unique: true, required: true, trim: true },
    fullName: { type: String, trim: true },
    address: { type: String, },
    gender: { type: String, enum: ['Male', 'Female', 'Unknown'], default: 'Unknown' },
    rank: { type: String, enum: ['Bronze', 'Gold', 'Platinum', 'Diamond'], default: 'Bronze' },
    email: { type: String },
    birthDay: { type: Date },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Customer", customerSchema);