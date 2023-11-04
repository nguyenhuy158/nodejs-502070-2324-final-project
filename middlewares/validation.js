const { query, body, param, validationResult } = require('express-validator');
const User = require('../models/user');

exports.validateCreateProduct = [
    body('name').notEmpty().isString(),
    body('price').isNumeric(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

exports.validateUpdateProduct = [
    body('name').optional().isString(),
    body('price').optional().isNumeric(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

exports.validateLogin = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username cannot be empty!"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password cannot be empty!")
        .isLength({ min: 2 })
        .withMessage("Password must have at least 6 characters!")
];

exports.validatePasswordReset = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty!")
        .isEmail()
        .withMessage("Not a valid e-mail address")
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (!user) {
                throw new Error("E-mail not exits");
            }
            return true;
        })
]

