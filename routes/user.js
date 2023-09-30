const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// middleware that is specific to this router
router
    .use((req, res, next) => {
        console.log('Time: ', Date.now());
        next();
    })
    .get('/', (req, res) => {
        res.render('home');
    })
    .get('/about', (req, res) => {
        res.render('about');
    })
    .post('/', userController.createUser);

module.exports = router;