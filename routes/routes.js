const express = require('express');
const router = express.Router();
const { register } = require('../controllers/userController');
const { UserValidator } = require('../validators/validator');
const { seedDatabase } = require('../controllers/productController');

router.post('/register', UserValidator, register);

router.get('/', (req, res) => {
    // insertUser();
    res.render('index', { title: 'Home', app_name: process.env.APP_NAME });
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
