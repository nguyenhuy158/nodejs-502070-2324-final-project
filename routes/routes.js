const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const routerController = require('../controllers/routerController');
const { UserValidator } = require('../validators/validator');
const { upload } = require('../config/upload');
const { currentTime } = require('../utils/format');

router
    .use((req, res, next) => {
        console.log('[controller] routers controller');
        console.log('[controller] Time: ', currentTime());
        next();
    })
    .use(routerController.checkFirstLogin)
    .post('/register', UserValidator, userController.register)
    .get('/sent-mail', routerController.sentMail)
    .get('/', routerController.home)
    .get('/about', routerController.about)
    .get('/profile', userController.viewProfile)
    .post('/upload-profile-pic', upload.single('profilePic'), userController.changeProfilePicture)
    .get('/permission-denied', routerController.permissionDenied)
    .get('/random-product', routerController.randomProduct)
    .get('/error', (req, res) => {
        throw Error('ERROR');
    });

module.exports = router;
