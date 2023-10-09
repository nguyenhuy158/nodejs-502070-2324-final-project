const User = require('../models/userModel');
const { faker } = require('@faker-js/faker');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const flash = require('../utils/flash');
const session = require('express-session');

async function login(req, res, next) {
    const timestamp = moment().format('DD/MM/yyyy HH:mm');
    console.log('Timestamp: ', timestamp);
    next();
};

async function get(req, res, next) {
    if (!req.session.loggedIn) {
        const { token } = req.query;

        if (token) {
            try {
                const salesperson = await User.findOne({ token });

                if (!salesperson || salesperson.tokenExpiration < Date.now()) {
                    flash.addFlashMessage(req, 'warning', '', 'Please login by clicking on the link in your email.');
                    return res.redirect('/login');
                }

                res.render('pages/auth/loginEmail', { token });
            } catch (error) {
                flash.addFlashMessage(req, 'warning', '', 'An error occurred while logging in.');
                next(error);
            }
        } else {
            return res.render('pages/auth/form');
        }
    }
    res.redirect('/');
};

async function createUser(req, res, next) {
    const { email } = req.body;
    try {
        const newUser = new User({
            email,
            username: req.body.username,
            password: req.body.password,
            role: 'salespeople'
        });

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.render('pages/auth/form', {
                isRegister: true,
                status: 'failed',
                data: [],
                message: 'It seems you already have an account, please log in instead.',
            });
        }

        const savedUser = await newUser.save();
        const { password, role, ...user_data } = savedUser._doc;
        console.log("🚀 ~ file: authController.js:43 ~ createUser ~ user_data:", user_data);
        // return res.render('pages/auth/form', {
        //     isRegister: true,
        //     status: 'success',
        //     data: [user_data],
        //     message: 'Thank you for registering with us. Your account has been successfully created.',
        // });
        return res.redirect('/login');
    } catch (err) {
        next(err);
    }
};

function checkAuth(req, res, next) {
    console.log('go check auth');

    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    next();
}

async function checkUser(req, res, next) {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username }).select('+password');

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.loggedIn = true;
            req.session.user = user;
            req.session.userId = user._id;
            let options = {
                maxAge: 20 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: 'None',
            };
            const token = user.generateAccessJWT();
            res.cookie('SessionID', token, options);

            return res.redirect('/');
        }

        res.render('pages/auth/form', { username, password, error: 'Username or Password is not correct' });
    } catch (err) {
        console.error('Error finding user:', err);
        next(err);
    }
}

function logout(req, res, next) {
    req.session = null;
    res.redirect('/login');
}

async function getRegister(req, res, next) {
    res.render('pages/auth/form', { isRegister: true });
}

async function changePassword(req, res, next) {
    res.render('pages/auth/change_password');
}

async function postChangePassword(req, res, next) {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.userId;

    try {
        const user = await User.findById(userId).select('+password');

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            flash.addFlashMessage(req, 'warning', 'Change password fail: ', 'Password is not correct');
            return res.status(401).redirect('/change-password');
        }

        if (newPassword !== confirmPassword) {
            flash.addFlashMessage(req, 'warning', 'Change password fail: ', 'Password not match');
            return res.status(400).redirect('/change-password');
        }

        user.password = newPassword;
        await user.save();

        flash.addFlashMessage(req, 'success', 'Change password success: ', 'Password changed');
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = {
    logger: login,
    get,
    createUser,
    checkAuth,
    checkUser,
    logout,
    changePassword,
    getRegister,
    postChangePassword
};
