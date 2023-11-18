const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    phone: { type: String, unique: true, required: true, trim: true },
    fullName: { type: String, trim: true },
    address: {
        region: String,
        district: String,
        ward: String,
        address: String,
        zip: String,
    },
    gender: { type: String, enum: ['Male', 'Female', 'Unknown'], default: 'Unknown' },
    rank: { type: String, enum: ['Bronze', 'Gold', 'Platinum', 'Diamond'], default: 'Bronze' },
    email: { type: String, default: '' },
    birthDay: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

customerSchema.methods.getShortAddress = function () {
    return `${this.address.address}, ${this.address.ward}`;
};

customerSchema.methods.getFullAddress = function () {
    return `${this.address.address}, ${this.address.ward}, ${this.address.district}, ${this.address.region}`;
};

customerSchema.methods.setAddress = function (region, district, ward, address, zip) {
    region = region || '';
    district = district || '';
    ward = ward || '';
    address = address || '';
    zip = zip || '';

    this.address = { region, district, ward, address, zip };
};

customerSchema.methods.setRank = function (rank) {
    this.rank = rank;
};

customerSchema.methods.getFullName = function () {
    return this.fullName;
};

customerSchema.methods.getPhone = function () {
    return this.phone;
};

customerSchema.methods.setFullName = function (fullName) {
    this.fullName = fullName;
};

customerSchema.methods.setPhone = function (phone) {
    this.phone = phone;
};


module.exports = mongoose.model("Customer", customerSchema);