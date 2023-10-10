const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const routerController = require('../controllers/routerController');
const { UserValidator } = require('../validators/validator');
const { upload } = require('../config/upload');

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
    res.render('pages/about', { navLink: 'About' });
});

router.get('/profile', userController.viewProfile);

router.post('/upload-profile-pic', upload.single('profilePic'), userController.changeProfilePicture);

router.get('/permission-denied', (req, res) => {
    res.render('pages/permission-denied');
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
