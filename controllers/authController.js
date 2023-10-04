const User = require('../models/userModel');
const { faker } = require('@faker-js/faker');
const moment = require('moment');
const bcrypt = require('bcryptjs');


async function login(req, res, next) {
    const timestamp = moment().format('DD/MM/yyyy HH:mm');
    console.log('Timestamp: ', timestamp);
    next();
};

async function get(req, res, next) {
    if (!req.session.loggedIn) {
        return res.render('pages/auth/form');
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
        console.log("🚀 ~ file: authController.js:43 ~ createUser ~ user_data:", user_data)
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
    console.log("🚀 ~ file: authController.js:67 ~ checkUser ~ password:", password);
    console.log("🚀 ~ file: authController.js:67 ~ checkUser ~ username:", username)
    try {
        const user = await User.findOne({ username }).select('+password');
        console.log("🚀 ~ file: authController.js:68 ~ checkUser ~ user:", user)
        console.log("🚀 ~ file: authController.js:68 ~ checkUser ~ user:", user.password)
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.loggedIn = true;
            return res.redirect('/');
        }

        res.render('pages/auth/form', { username, password, error: 'Username or Password is not correct' });
    } catch (err) {
        console.error('Error finding user:', err);
        next(err);
    }
}

function logout(req, res, next) {
    if (req.session) {
        req.session.loggedIn = false;
        // req.session.destroy((err) => {
        //     if (err) {
        //         console.error('Error destroying session:', err);
        //     }
        // });
    }
    res.redirect('/login');
}

async function getRegister(req, res, next) {
    res.render('pages/auth/form', { isRegister: true });
}

module.exports = {
    logger: login,
    get,
    createUser,
    checkAuth,
    checkUser,
    logout,
    getRegister
};
