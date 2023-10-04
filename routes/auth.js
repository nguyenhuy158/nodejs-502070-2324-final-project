const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const dateFormat = require('dateformat');


// middleware that is specific to this router
router
    .use((req, res, next) => {
        console.log('Time: ', dateFormat(new Date(), " hh:MM:ss dd/mm/yyyy"));
        next();
    })
    .get('/register', (req, res) => {
        res.render('register');
    })
    .post('/register', async (req, res) => {
    })
    .get('/login', authController.get)
    .post('/login', authController.checkUser)
    .get('/get-age', (req, res) => {
    })
    .use(authController.checkAuth);


module.exports = router;