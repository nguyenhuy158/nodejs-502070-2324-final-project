const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require('../models/user');
const moment = require("moment");
const {
    generateToken,
    getFullUrlForMailConfirm,
    sendEmail,
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
    try {
        const { fullName, email } = req.body;
        const salesperson = new User({ fullName, email });
        await salesperson.save();

        const resetToken = generateToken();

        salesperson.sentMail(resetToken);

        const resetLink = getFullUrlForMailConfirm(req, resetToken);

        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: salesperson.email,
            subject: "Welcome to Tech Hut - Activate Sales Account [Retail Store]",
            text: `Dear ${salesperson.fullName}\n\n` +
                `An account has been created for you in the Sales System. To log in, please click the following link within 1 minute:\n\n` +
                `${resetLink}\n\n` +
                `Best regards,` +
                `${req.user.fullName}`,
        };

        sendEmail(req, salesperson, resetToken, mailOptions);

        res.status(201).json({
            error: false,
            message: 'Account created successfully: Please check your email for further instructions.',
            user: salesperson
        });

    } catch (error) {
        res.status(500).json({ error: true, message: 'Could not create the user account' + error });
    }
};

exports.checkAndParseObjectId = async (req, res, next) => {
    const id = req.params.id;
    if (ObjectId.isValid(id)) {
        req.id = new ObjectId(id);
        try {
            const apiUser = await User.findOne(req.id);
            req.apiUser = apiUser;
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
};

exports.getApiResentMail = async (req, res) => {
    try {
        const user = await User.findById(req.id);

        const resetToken = generateToken();

        user.reSentMail(resetToken);

        const resetLink = getFullUrlForMailConfirm(req, resetToken);

        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: "Welcome to Tech Hut - Activate Sales Account [Retail Store]",
            text: `Dear ${user.fullName}\n\n` +
                `An account has been created for you in the Sales System. To log in, please click the following link within 1 minute:\n\n` +
                `${resetLink}\n\n` +
                `Best regards,` +
                `${req.user.fullName}`,
        };

        sendEmail(req, user, resetToken, mailOptions);
        return res.json({
            error: false,
            message: "Resent success, please check mail to login."
        });
    } catch (error) {
        return res.json({
            error: true,
            message: error
        });
    }
};

exports.getApiSentMail = async (req, res) => {
    try {
        const user = await User.findById(req.id);

        const resetToken = generateToken();

        user.reSentMail(resetToken);

        const resetLink = getFullUrlForMailConfirm(req, resetToken);

        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: "Welcome to Tech Hut - Activate Sales Account [Retail Store]",
            text: `Dear ${user.fullName}\n\n` +
                `An account has been created for you in the Sales System. To log in, please click the following link within 1 minute:\n\n` +
                `${resetLink}\n\n` +
                `Best regards,` +
                `${req.user.fullName}`,
        };


        sendEmail(req, user, resetToken, mailOptions);
        return res.json({
            error: false,
            message: "Sent success, please check mail to login."
        });
    } catch (error) {
        return res.json({
            error: true,
            message: error
        });
    }
};

exports.putApiLockAccount = async (req, res) => {
    try {
        req.apiUser.lockedStatus = true;
        await req.apiUser.save();
        return res.json({
            error: false,
            message: `${req.apiUser.fullName} is locked`
        });
    } catch (error) {
        return res.json({
            error: true,
            message: error
        });
    }
};
exports.putApiUnLockAccount = async (req, res) => {
    try {
        req.apiUser.lockedStatus = false;
        await req.apiUser.save();
        return res.json({
            error: false,
            message: `${req.apiUser.fullName} is unlocked`
        });
    } catch (error) {
        return res.json({
            error: true,
            message: error
        });
    }
};