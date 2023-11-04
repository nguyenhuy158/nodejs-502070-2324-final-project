const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require('../models/user');
const moment = require("moment");
const {
    generateToken,
    sendEmail,
    uploadImage
} = require("../middlewares/utils");

exports.getApiUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.json({});
    }
};

exports.postApiUser = async (req, res) => {
    const { fullName, email } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            req.flash("error", "Email already exists Please use a different email address.");
            return res.redirect("/user/create-account");
        }

        const token = generateToken();
        const tokenExpiration = moment()
            .add(1, "minutes");

        const salesperson = new User({
            fullName,
            email,
            token,
            tokenExpiration
        });

        await salesperson.save();
        await sendEmail(req, existingUser, token);

        res.status(201).json({
            error: false,
            message: 'Account created successfully: Please check your email for further instructions.',
            user: salesperson
        });

    } catch (error) {
        console.log(`🚀 ---------------------------------------------------------------------------🚀`);
        console.log(`🚀 🚀 file: userApiController.js:48 🚀 exports.postApiUser= 🚀 error`, error);
        console.log(`🚀 ---------------------------------------------------------------------------🚀`);
        res.status(500).json({ error: true, message: 'Could not create the product' });
    }
};

exports.checkAndParseObjectId = async (req, res, next) => {
    const id = req.params.id;
    if (ObjectId.isValid(id)) {
        req.id = new ObjectId(id);
        try {
            const user = await User.findOne(req.id);
            req.api.user = user;
            return next();
        } catch (error) {
            res.status(400).json({
                error: true,
                message: 'Id not found! please reload and try again!'
            });
        }
    } else {
        res.status(400).json({
            error: true,
            message: 'Id not valid! please reload and try again!'
        });
    }
};

exports.getApiUser = async (req, res) => {
    try {
        const id = req.id;
        const user = await User.findOne(id);
        res.json(user);
    } catch (error) {
        res.json({});
    }
};

exports.putApiUser = async (req, res) => {
    try {
        const id = req.id;

        const user = await User.findOneAndUpdate(id, { $set: req.body }, { new: true });
        res.json(user);
    } catch (error) {
        res.json({});
    }
};

exports.deleteApiUserById = async (req, res) => {
    try {
        const id = req.id;
        const user = await User.findByIdAndDelete(id);
        return res.json({
            error: false,
            user,
            message: "Deleted successfully"
        });
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: 'Please reload and try again!'
        });
    }
}

