const express = require('express');
const router = express.Router();
const { register } = require('../controllers/userController');
const { UserValidator } = require('../validators/validator');
const { seedDatabase } = require('../controllers/productController');
const flash = require('../utils/flash');
const { transporter } = require('../config/email');
const pug = require('pug');
const path = require('path');

const compiledFunction = pug.compileFile('./views/email/email-template.pug');
const emailData = {
    username: 'Tech Hut',
    password: 'Tech Hut',
};

router.use(function checkAuth(req, res, next) {
    const { user } = req.session;

    if (user && user.isFirstLogin) {
        return res.redirect('/change-password');
    }

    next();
});

router.post('/register', UserValidator, register);

router.get('/sent-mail', (req, res) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: 'quocanh01062002@gmail.com',
        subject: 'TEST MESSAGE',
        // html: `
        // This is mail auto sent from website when you are salespeople.Please don't replay
        // `,
        html: compiledFunction(emailData)
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
        res.redirect('/');
    });
});

router.get('/', (req, res) => {
    // insertUser();
    console.log('go /');
    flash.addFlashMessage(req, 'success', 'Success', 'Messgeeee success flash message');
    res.render('pages/index', { title: 'Home', app_name: process.env.APP_NAME });
});

router.get('/about', (req, res) => {
    // insertUser();
    console.log('go /about');
    res.render('pages/about', { title: 'About' });
});

router.get('/random-product', (req, res) => {
    // insertUser();
    seedDatabase();
    res.redirect('/');
});

router.get('/error', (req, res) => {
    throw Error('ERROR');
});

module.exports = router;
