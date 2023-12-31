
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const addFlash = require('../utils/flash');
const moment = require("moment");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const logger = require("../config/logger");

const { generateToken, sendEmail, uploadImage } = require("../utils/utils");

exports.changeProfilePicture = async (req, res, next) => {
    const user = req.user;
    try {
        const { path: pathFile } = req.file;

        await sharp(pathFile)
            .resize(600, 600, {
                fit: sharp.fit.cover,
                withoutEnlargement: true
            })
            .webp({ quality: 90 })
            .toFile(path.join(__dirname, "..", "public", `uploads/${user._id}-profile.webp`));

        user.profilePicture = await uploadImage(`public/uploads/${user._id}-profile.webp`);
        await user.save();
        req.session.user = user;
        fs.unlinkSync(pathFile);

        addFlash.addFlash(req, "success", "Change picture success");
        res.redirect("/profile");
    } catch (error) {
        console.log("🚀 ~ file: userController.js:31 ~ exports.changeProfilePicture= ~ error:", error);
        user.profilePicture = `uploads/${req.file.filename}`;
        await user.save();
        req.session.user = user;

        next(error);
    }
};

exports.viewProfile = async (req, res, next) => {
    console.log("🚀 ~ file: userController.js:31 ~ exports.viewProfile= ~ req.user", req.user);
    try {
        res.render("pages/users/profile", {
            pageTitle: "Profile - Tech Hut",
            user: req.user
        });
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

exports.deleteUser = async (req, res) => {
    const id = req.params[0];
    console.log("=>(userController.js:55) id", id);
    console.log("=>(userController.js:56) ObjectId.isValid(id)", ObjectId.isValid(id));
    if (!ObjectId.isValid(id)) {
        res.status(400)
            .json({
                code: 400,
                success: false,
                message: "Invalid ObjectId"
            });
        return;
    }
    try {
        const currentUser = await User.findByIdAndDelete(id);
        if (currentUser) {
            req.flash("success", `Successfully deleted ${currentUser.fullName}`);
            res.json({
                code: 200,
                success: true,
                message: "User deleted successfully"
            });
        } else {
            req.flash("error", `User not found`);
            res.json({
                code: 404,
                success: false,
                message: "User not found"
            });
        }
    } catch (error) {
        req.flash("error", `Failed to delete for ${id}`);
        res.status(500)
            .json({
                code: 500,
                success: false,
                message: "Internal Server Error"
            });
    }
};

exports.createUser = function (req, res, next) {
    const newData = req.body;
    // dataModel.addData(newData);
    // res.status(201).json(newData);
};

exports.getUser = async (req, res, next) => {
    const userId = req.params[0];
    if (ObjectId.isValid(userId)) {
        const user = await User.findById(userId);
        return res.render("pages/users/detail", {
            user,
            pageTitle: user.fullName + " User Detail - Tech Hut",
        });
    }
    next();
};

exports.getUsers = async function (req, res, next) {
    const perPage = parseInt(req.query.perPage) || 10;
    let page = parseInt(req.query.page) || 1;

    try {
        const users = await User
            .find()
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await User.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const response = {
            users,
            current: page,
            count,
            perPage,
            nextPage: hasNextPage ? nextPage : null
        };
        res.render("pages/users/home", {
            ...response,
            sideLink: process.env.SIDEBAR_USER,
            pageTitle: "Users Manager - Tech Hut"
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        next(error);
    }
};

exports.resendEmail = async function resendEmail(req, res, next) {
    const id = req.params[0];

    try {
        const user = await User.findById(id);

        if (!user) {
            addFlash.addFlash(req, "warning", `No user found with the provided ${id}.`);
            return res.redirect("/users");
        }

        user.token = generateToken();
        user.tokenExpiration = moment()
            .add(1, "minutes");
        await user.save();

        await sendEmail(req, user, user.token, "create-account");


        addFlash.addFlash(req, "success", "Email has been resent. Please check your email for further instructions.");
        res.redirect("/users");
    } catch (error) {
        console.error("Error resending email:", error);
        next(error);
    }
};
// CREATE NEW SALE PEOPLE
// exports.getCreateAccount = (req, res) => {
//     res.render("pages/users/create-account", {
//         pageTitle: "Create Account - Tech Hut",
//     });
// };
// exports.postCreateAccount = async (req, res, next) => {
//     const { fullName, email } = req.body;

//     try {
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             req.flash("error", "Email already exists Please use a different email address.");
//             return res.redirect("/user/create-account");
//         }

//         const token = generateToken();
//         const tokenExpiration = moment()
//             .add(1, "minutes");

//         const salesperson = new User({
//             fullName,
//             email,
//             token,
//             tokenExpiration
//         });

//         await salesperson.save();
//         await sendEmail(req, existingUser, token, "create-account");

//         req.flash("success", "Account created successfully: Please check your email for further instructions.");
//         res.redirect("/users");
//     } catch (error) {
//         req.flash("error", `Account created fail: ${error}.`);
//         next(error);
//     }
// };
// CREATE NEW SALE PEOPLE

exports.login = async (req, res, next) => {
    const { token } = req.query;

    try {
        const salesperson = await User.findOne({ token });

        if (!salesperson || salesperson.tokenExpiration < Date.now()) {
            addFlash.addFlash(req, "warning", "Please login by clicking on the link in your email.");
            return res.redirect("/login");
        }

        res.render("pages/auth/login", { token });
    } catch (error) {
        addFlash.addFlash(req, "warning", "An error occurred while logging in.");
        next(error);
    }
};

exports.loginSubmit = async (req, res, next) => {
    const {
        token,
        password
    } = req.body;

    try {
        const salesperson = await User.findOne({ token });

        if (!salesperson || salesperson.tokenExpiration < Date.now()) {
            addFlash.addFlash(req, "warning", "Please login by clicking on the link in your email.");
            return res.redirect("/login");
        }

        salesperson.password = password;
        salesperson.token = undefined;
        salesperson.tokenExpiration = undefined;
        await salesperson.save();

        addFlash.addFlash(req, "success", "Password updated. You can now log in using your" + " credentials.");
        res.redirect("/login");
    } catch (error) {
        addFlash.addFlash(req, "warning", "An error occurred while logging in.");
        next(error);
    }
};

exports.lockAccount = async (req, res) => {
    const id = req.params[0];

    if (!ObjectId.isValid(id)) {
        res.status(400)
            .json({
                code: 400,
                success: false,
                message: "Invalid ObjectId"
            });
        return;
    }
    try {
        const user = await User.findById(id);

        if (user) {
            user.lockedStatus = true;
            await user.save();

            req.flash("success", `Change locked account`);
            res.json({
                code: 200,
                success: true,
                message: "Change locked account"
            });
        } else {
            req.flash("error", `Change locked account fail`);
            res.json({
                code: 404,
                success: false,
                message: "Change locked account fail"
            });
        }
    } catch (error) {
        req.flash("error", `Change locked account fail`);
        res.status(500)
            .json({
                code: 500,
                success: false,
                message: "Internal Server Error"
            });
    }
};

exports.unlockAccount = async (req, res) => {
    const id = req.params[0];
    console.log("=>(userController.js:315) id", id);

    if (!ObjectId.isValid(id)) {
        res.status(400)
            .json({
                code: 400,
                success: false,
                message: "Invalid ObjectId"
            });
        return;
    }
    try {
        const user = await User.findById(id);
        console.log("=>(userController.js:323) user", user);

        if (user) {
            user.lockedStatus = false;
            await user.save();

            req.flash("success", `Change locked account`);
            res.json({
                code: 200,
                success: true,
                message: "Change unlocked account"
            });
        } else {
            req.flash("error", `Change unlocked account fail`);
            res.json({
                code: 404,
                success: false,
                message: "Change unlocked account fail"
            });
        }
    } catch (error) {
        req.flash("error", `Change unlocked account fail`);
        res.status(500)
            .json({
                code: 500,
                success: false,
                message: "Internal Server Error"
            });
    }
};


exports.getApiSetting = async (req, res) => {
    res.json({ ...req.user.settings });
};

exports.postApiSetting = async (req, res) => {
    try {
        const userId = req.user._id;
        const { darkMode } = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, { "settings.darkMode": darkMode }, { new: true });

        res.status(200)
            .json({
                error: false,
                settings: updatedUser.settings
            });
    } catch (error) {
        res.status(500)
            .json({
                error,
                message: "Internal Server Error"
            });
    }
};


