const express = require('express');
const router = express.Router();
const { register } = require('../controllers/userController');
const { UserValidator } = require('../validators/validator');

router.post('/register', UserValidator, register);

module.exports = router;
