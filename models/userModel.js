const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
// import jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN;

const userSchema = new Schema({
    email: { type: String, unique: true, required: true, trim: true },
    username: { type: String, trim: true, minlength: 1 },
    fullName: { type: String, trim: true, minlength: 2 },
    role: { type: String, enum: ['admin', 'salespeople'], default: 'salespeople', lowercase: true },
    password: { type: String, trim: true, minlength: 1, select: false },
    password_confirm: { type: String, trim: true, minlength: 1 },
    token: { type: String },
    tokenExpiration: { type: Date },
    isFirstLogin: { type: Boolean, default: true }
}, {
    timestamps: true
});

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

userSchema.methods.generateAccessJWT = function () {
    let payload = {
        id: this._id,
    };
    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
        expiresIn: '20m',
    });
};

module.exports = mongoose.model('User', userSchema);
