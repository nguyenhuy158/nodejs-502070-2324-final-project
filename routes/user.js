const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router
    .use((req, res, next) => {
        console.log('[controller] user controller');
        console.log('Time: ', require('dateformat')(new Date(), " hh:MM:ss dd/mm/yyyy"));
        next();
    })
    .get('/', userController.getUsers)
    .get('/:id', userController.getUser)
    .get('/about', (req, res) => {
        res.render('pages/about');
    })
    .post('/', userController.createUser)
    .get('/register', (req, res) => {
        res.render('register');
    })
    .post('/register', async (req, res) => {
    })
    .get('/resend/:id', userController.resendEmail)
    .get('/login', (req, res) => {
        res.render('pages/auth/form');
    })
    .get('/create-account', (req, res) => {
        res.render('pages/auth/createAccount');
    })
    .post('/create-account', userController.createAccount)
    .get('/login', userController.login)
    .post('/login', userController.loginSubmit);



module.exports = router;