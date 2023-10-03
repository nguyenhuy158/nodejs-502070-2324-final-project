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
        res.render('pages/home');
    })
    .get('/about', (req, res) => {
        res.render('pages/about');
    })
    .post('/', userController.createUser)
    .get('/register', (req, res) => {
        res.render('register');
    })
    .post('/register', async (req, res) => {
    })
    .get('/login', (req, res) => {
        res.render('pages/auth/form');
    })
    .post('/login', async (req, res) => {
    })
    .get('/get-age', (req, res) => {
    })


module.exports = router;