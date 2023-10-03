const User = require('../models/userModel');
const { faker } = require('@faker-js/faker');
const moment = require('moment');


async function login(req, res, next) {
    const timestamp = moment().format('DD/MM/yyyy HH:mm');
    console.log('Timestamp: ', timestamp);
    next();
};
async function get(req, res, next) {
    res.render('pages/auth/FORM');
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

module.exports = {
    logger: login,
    get,
    createUser,
    checkAuth,
};
