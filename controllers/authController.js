const User = require("../models/user");
const { faker } = require("@faker-js/faker");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const flash = require("../middlewares/flash");
const { cookieOptions } = require("../config/config");
require("dotenv").config();

exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

exports.checkAdmin = async function (req, res, next) {
    const currentRole = req.session.user.role;
    if (currentRole != process.env.ROLE_ADMIN) {
        return res.redirect("/permission-denied");
    }
    next();
};

exports.logger = async function (req, res, next) {
    const timestamp = moment().format("DD/MM/yyyy HH:mm");
    console.log("Timestamp: ", timestamp);
    next();
};

exports.get = async function (req, res, next) {
    // console.log("=>(authController.js:23) req.session.loggedIn", req.session.loggedIn);
    // if (!req.session.loggedIn) {
    //     const { token } = req.query;
    //
    //     if (token) {
    //         try {
    //             const salesperson = await User.findOne({ token });
    //
    //             if (!salesperson || salesperson.tokenExpiration < moment()) {
    //                 flash.addFlash(req, "warning", "Please login by clicking on the link in your email.");
    //                 return res.redirect("/login");
    //             }
    //
    //             salesperson.token = undefined;
    //             salesperson.tokenExpiration = undefined;
    //             await salesperson.save();
    //
    //             flash.addFlash(req, "sucess", "Welcome Now you are salespeople.");
    //
    //             req.session.loggedIn = true;
    //             req.session.user = salesperson;
    //             req.session.userId = salesperson._id;
    //             res.locals.user = salesperson;
    //
    //             res.redirect("/");
    //         } catch (error) {
    //             flash.addFlash(req, "warning", "An error occurred while logging in.");
    //             next(error);
    //         }
    //     } else {
    //         return res.render("pages/auth/form");
    //     }
    // }
    const { token } = req.query;
    
    if (token) {
        try {
            const salesperson = await User.findOne({ token });
            
            if (!salesperson || salesperson.tokenExpiration < moment()) {
                flash.addFlash(
                    req,
                    "warning",
                    "Please login by clicking on the link in your email."
                );
                return res.redirect("/login");
            }
            
            salesperson.token = undefined;
            salesperson.tokenExpiration = undefined;
            await salesperson.save();
            
            flash.addFlash(req, "success", "Welcome Now you are salespeople.");
            
            const token = salesperson.generateAccessJWT();
            res.cookie(process.env.COOKIE_NAME, token, cookieOptions);
            
            res.redirect("/");
        } catch (error) {
            flash.addFlash(req, "warning", "An error occurred while logging in.");
            next(error);
        }
    } else {
        return res.render("pages/auth/form", {
            messages: req.flash(),
        });
    }
};

exports.createUser = async function (req, res, next) {
    const { email } = req.body;
    try {
        const newUser = new User({
            email,
            username: req.body.username,
            password: req.body.password,
            role: "salespeople",
        });
        
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.render("pages/auth/form", {
                isRegister: true,
                status: "failed",
                data: [],
                message: "It seems you already have an account, please log in instead.",
            });
        }
        
        const savedUser = await newUser.save();
        const { password, role, ...user_data } = savedUser._doc;
        console.log(
            "🚀 ~ file: authController.js:43 ~ createUser ~ user_data:",
            user_data
        );
        return res.redirect("/login");
    } catch (err) {
        next(err);
    }
};

exports.checkUser = async function (req, res, next) {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username }).select("+password");
        
        if (user) {
            if (!user.lockedStatus) {
                if (user.token) {
                    if (moment(user.tokenExpiration).isBefore(moment())) {
                        flash.addFlash(
                            req,
                            "warning",
                            `You can ask the administrator's support to resend another email with another link.`
                        );
                        return res.redirect("/login");
                    } else {
                        flash.addFlash(
                            req,
                            "warning",
                            "Please login by clicking on the link in your email."
                        );
                        return res.redirect("/login");
                    }
                } else if (await bcrypt.compare(password, user.password)) {
                    // req.session.loggedIn = true;
                    // req.session.user = user;
                    // req.session.userId = user._id;
                    //
                    // req.app.locals.user = user;
                    //
                    const token = user.generateAccessJWT();
                    console.log("=>(authController.js:123) token", token);
                    console.log("=>(authController.js:155) res.cookie", res.cookies);
                    res.cookie(process.env.COOKIE_NAME, token, cookieOptions);
                    console.log("=>(authController.js:155) res.cookie", res.cookies);
                    return res.redirect("/");
                }
            } else {
                return res.render("pages/auth/form", {
                    username,
                    password,
                    error: `You can contact the administrator's support unlock account link.`,
                });
            }
        }
        
        return res.render("pages/auth/form", {
            username,
            password,
            error: "Username or Password is not correct",
        });
    } catch (err) {
        console.error("Error finding user:", err);
        next(err);
    }
};

exports.logout = function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            res.redirect("/error");
        } else {
            req.session = null;
            res.locals = null;
            res.clearCookie(process.env.COOKIE_NAME);
            res.cookies = null;
            res.redirect("/login");
        }
    });
};

exports.getRegister = async function (req, res, next) {
    res.render("pages/auth/form", { isRegister: true });
};

exports.changePassword = async function (req, res, next) {
    res.render("pages/auth/change-password");
};

exports.postChangePassword = async function (req, res, next) {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    try {
        const user = req.user;
        console.log("=>(authController.js:226) user", user);
        
        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );
        
        if (!isPasswordValid) {
            flash.addFlash(
                req,
                "warning",
                "Change password fail: Password is not correct"
            );
            return res.status(401).redirect("/change-password");
        }
        
        if (newPassword !== confirmPassword) {
            flash.addFlash(
                req,
                "warning",
                "Change password fail: Password not match"
            );
            return res.status(400).redirect("/change-password");
        }
        
        user.password = newPassword;
        user.isFirstLogin = false;
        await user.save();
        req.session.user = user;
        
        flash.addFlash(req, "success", "Change password success: Password changed");
        res.redirect("/");
    } catch (error) {
        console.error(error);
        next(error);
    }
};
