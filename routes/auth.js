const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { currentTime } = require('../utils/format');

router
    .use((req, res, next) => {
        console.log('[controller] auth controller');
        console.log('[controller] Time: ', currentTime());
        next();
    })
    .get('/register', authController.getRegister)
    .post('/register', authController.createUser)
    .get('/login', authController.get)
    .post('/login', authController.checkUser)
    .get('/logout', authController.logout)
    .get('/change-password', authController.changePassword)
    .post('/change-password', authController.postChangePassword)
    .use(authController.checkAuth);

module.exports = router;