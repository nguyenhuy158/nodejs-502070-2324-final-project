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
    const { username, password } = req.body;

    // Check if the username and password match a user in your database
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.loggedIn = true;
        return res.redirect('/dashboard');
    }

    res.redirect('/login');
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
    console.log("🚀 ~ file: authController.js:39 ~ checkUser ~ password:", password);
    console.log("🚀 ~ file: authController.js:39 ~ checkUser ~ username:", username);

    try {
        const user = await User.findOne({ username });
        console.log("🚀 ~ file: authController.js:42 ~ checkUser ~ user:", user);

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

module.exports = {
    logger: login,
    get,
    createUser,
    checkAuth,
    checkUser
};
