const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { formatTimestamp } = require('../middlewares/format');
require('dotenv').config();

const userSchema = new Schema({
    email: { type: String, unique: true, required: true, trim: true },
    username: { type: String, trim: true, minlength: 1 },
    fullName: { type: String, trim: true, minlength: 2 },
    role: { type: String, enum: [process.env.ROLE_ADMIN, process.env.ROLE_SALE], default: process.env.ROLE_SALE, lowercase: true },
    password: { type: String, trim: true, minlength: 1, select: false },
    password_confirm: { type: String, trim: true, minlength: 1 },
    token: { type: String },
    tokenExpiration: { type: Date },
    isFirstLogin: { type: Boolean, default: true },
    profilePicture: { type: String },
    inactivateStatus: { type: Boolean, default: false },
    lockedStatus: { type: Boolean, default: false }
}, {
    timestamps: true
});

userSchema.methods.updateProfilePicture = function (newProfilePicture) {
    this.profilePicture = newProfilePicture;
    return this.save();
};

userSchema.pre('save', function (next) {
    const user = this;

    if (!user.username) {
        const emailParts = user.email.split('@');
        if (emailParts.length > 0) {
            user.username = emailParts[0];
            user.password = user.username;
            user.password_confirm = user.username;
        }
    }

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            user.password_confirm = hash;
            next();
        });
    });
});


userSchema.virtual('createdAtFormatted').get(function () {
    return formatTimestamp(this.createdAt);
});

userSchema.virtual('updatedAtFormatted').get(function () {
    return formatTimestamp(this.updatedAt);
});

userSchema.methods.generateAccessJWT = function () {
    let payload = {
        id: this._id,
    };
    return jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, {
        expiresIn: '20m',
    });
};

module.exports = mongoose.model('User', userSchema);
