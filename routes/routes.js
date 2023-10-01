const express = require('express');
const router = express.Router();
const { register } = require('../controllers/userController');
const { UserValidator } = require('../validators/validator');
const { seedDatabase } = require('../controllers/productController');
const flash = require('../utils/flash');
const { transporter } = require('../config/email');

router.post('/register', UserValidator, register);

router.get('/sent-mail', (req, res) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: process.env.TO_EMAIL,
        subject: 'TEST MESSAGE',
        text: `This is mail auto sent from website when you are salespeople.Please don't replay`,
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
    flash.addFlashMessage(req, 'success', 'Messgeeee success flash message');
    res.render('pages/index', { title: 'Home', app_name: process.env.APP_NAME });
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
