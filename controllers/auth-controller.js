require('dotenv').config();

const User = require('../models/user');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const logger = require('../config/logger');

const { cookieOptions } = require('../config/config');
const { generateToken, sendEmail } = require('../utils/utils');
const { faker } = require('@faker-js/faker');
const { query, body, param, validationResult } = require('express-validator');

exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

exports.ensureNotAuthenticated = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

exports.checkAdmin = async function (req, res, next) {
    const currentRole = req.session.user.role;
    if (currentRole != process.env.ROLE_ADMIN) {
        return res.redirect('/permission-denied');
    }
    next();
};

exports.logger = async function (req, res, next) {
    const timestamp = moment().format('DD/MM/yyyy HH:mm');
    console.log('Timestamp: ', timestamp);
    next();
};


// LOGIN
exports.get = async function (req, res, next) {
    const { token } = req.query;

    if (token) {
        try {
            const salesperson = await User.findOne({ token });

            if (!salesperson || salesperson.tokenExpiration < moment()) {
                // flash.addFlash(
                //     req,
                //     "warning",
                //     "Please login by clicking on the link in your email."
                // );
                return res.redirect('/login');
            }

            salesperson.token = undefined;
            salesperson.tokenExpiration = undefined;
            await salesperson.save();

            // flash.addFlash(req, "success", "Welcome Now you are salespeople.");

            const token = salesperson.generateAccessJWT();
            res.cookie(process.env.COOKIE_NAME, token, cookieOptions);

            res.redirect('/');
        } catch (error) {
            // flash.addFlash(req, "warning", "An error occurred while logging in.");
            next(error);
        }
    } else {
        return res.render('pages/auth/login', {
            messages: req.flash('info'),
            pageTitle: 'Login - Tech Hut'
        });
    }
};
exports.customAuthenticateCallback = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        console.log(`🚀 🚀 file: auth-controller.js:75 🚀 passport.authenticate 🚀 info`, info);
        console.log(`🚀 🚀 file: auth-controller.js:75 🚀 passport.authenticate 🚀 user`, user);
        console.log(`🚀 🚀 file: auth-controller.js:75 🚀 passport.authenticate 🚀 err`, err);
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Username or Password not correct ', error: true });
        }

        req.login(user, (loginErr) => {
            if (loginErr) {
                return res.status(500).json({ message: 'Username or Password not correct', error: true });
            }

            return res.status(200).json({ message: 'Login successful', user, error: false });
        });
    })(req, res, next);
};
// LOGIN

exports.emailConfirm = async (req, res, next) => {
    const token = req.query.token;
    console.log('=>(authController.js:70) token', token);

    if (token) {
        try {
            const salesperson = await User.findOne({ token });

            if (!salesperson) {
                req.flash(
                    'info',
                    'Link invalid or used, please contact to admin and try again.',
                );
                return res.redirect('/login');
            }

            if (salesperson && salesperson.tokenExpiration < moment()) {
                req.flash(
                    'info',
                    'Link expired, please contact to admin and try again.',
                );
                return res.redirect('/login');
            }

            req.login(salesperson, async (err) => {
                console.log('=>(authController.js:138) err', err);
                if (err) {
                    return next(err);
                }
                req.flash('info', 'Welcome Now you are salespeople.');

                salesperson.token = undefined;
                salesperson.tokenExpiration = undefined;
                await salesperson.save();
                return res.redirect('/');
            });
        } catch (error) {
            req.flash('error', 'An error occurred while logging in.');
            next(error);
        }
    } else {
        return res.redirect('/login');
    }
};

exports.createUser = async function (req, res, next) {
    const { email } = req.body;
    try {
        const newUser = new User({
            email,
            username: req.body.username,
            password: req.body.password,
            role: 'salespeople',
        });

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.render('pages/auth/login', {
                isRegister: true,
                status: 'failed',
                data: [],
                message:
                    'It seems you already have an account, please log in instead.',
            });
        }

        const savedUser = await newUser.save();
        const { password, role, ...user_data } = savedUser._doc;
        return res.redirect('/login');
    } catch (err) {
        next(err);
    }
};

exports.checkUser = async function (req, res, next) {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username }).select('+password');

        if (user) {
            if (!user.lockedStatus) {
                if (user.token) {
                    if (moment(user.tokenExpiration).isBefore(moment())) {
                        // flash.addFlash(
                        //     req,
                        //     "warning",
                        //     `You can ask the administrator's support to resend another email with another link.`
                        // );
                        return res.redirect('/login');
                    } else {
                        // flash.addFlash(
                        //     req,
                        //     "warning",
                        //     "Please login by clicking on the link in your email."
                        // );
                        return res.redirect('/login');
                    }
                } else if (await bcrypt.compare(password, user.password)) {
                    // req.session.loggedIn = true;
                    // req.session.user = user;
                    // req.session.userId = user._id;
                    //
                    // req.app.locals.user = user;
                    //
                    const token = user.generateAccessJWT();
                    console.log('=>(authController.js:123) token', token);
                    console.log(
                        '=>(authController.js:155) res.cookie',
                        res.cookies,
                    );
                    res.cookie(process.env.COOKIE_NAME, token, cookieOptions);
                    console.log(
                        '=>(authController.js:155) res.cookie',
                        res.cookies,
                    );
                    return res.redirect('/');
                }
            } else {
                return res.render('pages/auth/login', {
                    username,
                    password,
                    error: `You can contact the administrator's support unlock account link.`,
                });
            }
        }

        return res.render('pages/auth/login', {
            username,
            password,
            error: 'Username or Password is not correct',
        });
    } catch (err) {
        console.error('Error finding user:', err);
        next(err);
    }
};

exports.logout = function (req, res) {
    req.logout(function (err) {
        if (err) {
            return res.json({ error: true, message: 'Logout failed.' });
        } else {
            req.flash('info', 'Logout successfully.');
            req.session = null;
            res.locals = null;
            res.clearCookie(process.env.COOKIE_NAME);
            res.cookies = null;
            return res.json({ error: false, message: 'Logout successfully.' });
        }
    });
};

exports.getRegister = async function (req, res) {
    res.render('pages/auth/login', { isRegister: true });
};

// CHANGE PASSWORD 
exports.getChangePassword = async function (req, res) {
    if (req.user.isFirstLogin || req.user.isPasswordReset) {
        return res.render('pages/auth/change-password', {
            isFirstLogin: true,
            currentPassword: req.user.username,
        });
    }
    return res.render(
        'pages/auth/change-password', {
        pageTitle: 'Change Password - Tech Hut'
    });
};
exports.postChangePassword = async function (req, res, next) {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    console.log(`🚀 🚀 file: auth-controller.js:277 🚀 currentPassword`, currentPassword);
    console.log(`🚀 🚀 file: auth-controller.js:277 🚀 confirmPassword`, confirmPassword);
    console.log(`🚀 🚀 file: auth-controller.js:277 🚀 newPassword`, newPassword);

    try {
        const user = req.user;

        if (!user.isPasswordReset && !user.isFirstLogin) {
            const isPasswordValid = await bcrypt.compare(
                currentPassword,
                user.password,
            );

            if (!isPasswordValid) {
                return res.json({
                    error: true,
                    message: 'The password is incorrect.'
                });
            }
        }

        user.password = newPassword;
        user.isFirstLogin = false;
        user.isPasswordReset = false;
        await user.save();
        req.session.user = user;

        return res.json({
            error: false,
            message: 'Password changed successfully.'
        });
    } catch (error) {
        logger.error(error);
        return res.json({
            error: true,
            message: 'An error occurred during processing please reload the page and try again.'
        });
    }
};
// CHANGE PASSWORD 

// PASSWORD RESET | FORGOT PASSWORD
exports.getResetPassword = async (req, res) => {
    return res.render('pages/auth/reset-password', {
        pageTitle: 'Reset Password - Tech Hut'
    });
};
exports.postResetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        const resetToken = generateToken();
        // const resetTokenExpires = new Date(Date.now() + 1 * 60 * 1000);
        const resetTokenExpires = moment().add(1, 'minutes');

        user.token = resetToken;
        user.tokenExpiration = resetTokenExpires;
        user.isPasswordReset = true;
        user.isFirstLogin = false;
        await user.save();

        sendEmail(req, user, resetToken, "forgot-password");

        return res.json({
            error: false,
            message: 'Password reset success, please check mail to login.'
        });
    } catch (error) {
        console.log(`🚀 🚀 file: auth-controller.js:303 🚀 error`, error);
        return res.json({
            error: true,
            message: 'Password reset failed, an error has occurred please reload the page and try again.'
        });
    }
};
// PASSWORD RESET | FORGOT PASSWORD
