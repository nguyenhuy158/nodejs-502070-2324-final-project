const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { currentTime } = require('../utils/format');

router
    .use((req, res, next) => {
        console.log('[controller] user controller');
        console.log('[controller] Time: ', currentTime);
        next();
    })
    .get('/', userController.getUsers)
    .post('/', userController.createUser)
    .get('/resend/:id', userController.resendEmail)
    .get('/create-account', userController.getCreateAccount)
    .post('/create-account', userController.createAccount)
    .get('/:id', userController.getUser)
    .get('/login', userController.login)
    .post('/login', userController.loginSubmit)
    .get('/lock/:id', userController.lockAccount)
    .get('/unlock/:id', userController.unlockAccount);


module.exports = router;