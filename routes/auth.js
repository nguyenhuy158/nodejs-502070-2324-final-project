const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


// middleware that is specific to this router
router
    .use((req, res, next) => {
        console.log('Time: ', Date.now());
        next();
    })
    .get('/register', (req, res) => {
        res.render('register');
    })
    .post('/register', async (req, res) => {
    })
    .get('/login', authController.get)
    .post('/login', async (req, res) => {
    })
    .get('/get-age', (req, res) => {
    })
    .use(authController.checkAuth);


module.exports = router;