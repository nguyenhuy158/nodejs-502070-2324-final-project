require('dotenv').config();
const { transporter } = require('../config/email');
const compiledFunction = require('pug').compileFile('./views/email/email-template.pug');
const productController = require('../controllers/productController');


const emailData = {
    username: 'Tech Hut',
    password: 'Tech Hut',
};

exports.checkFirstLogin = (req, res, next) => {
    const { user } = req.session;

    if (user && user.isFirstLogin) {
        return res.redirect('/change-password');
    }

    next();
};

exports.sentMail = (req, res) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: 'quocanh01062002@gmail.com',
        subject: 'TEST MESSAGE',
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
};

exports.randomProduct = (req, res) => {
    productController.seedDatabase();
    res.redirect('/');
};

exports.home = (req, res) => {
    res.render('pages/home', { title: 'Home', app_name: process.env.APP_NAME });
};

exports.about = (req, res) => {
    res.render('pages/about', { navLink: 'About' });
};

exports.permissionDenied = (req, res) => {
    res.render('pages/permission-denied');
};