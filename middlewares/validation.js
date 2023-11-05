const { query, body, param, validationResult } = require('express-validator');
const User = require('../models/user');

exports.validateCreateAccount = [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name cannot be empty!")
        .custom((value) => {
            const words = value.split(" ");
            if (words.length >= 2) {
                return true;
            } else {
                throw new Error("Full name must contain at least two words");
            }
        }),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty!")
        .isEmail()
        .withMessage("Not a valid e-mail address")
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error("E-mail exits! Please user another email!");
            }
            return true;
        }),
    (req, res, next) => {
        const result = validationResult(req);
        if (result.errors.length === 0) {
            next();
        } else {
            return res
                .status(500)
                .json({
                    error: true, message: result.errors[0].msg
                });
        }
    }
];


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
];

exports.validationChangePassword = [
    body("currentPassword")
        .custom((value, { req }) => {
            return req.user.isFirstLogin;
        })
        .notEmpty()
        .withMessage("Password cannot be empty!")
        .isLength({ min: 6 })
        .withMessage("Password must have at least 6 characters!"),
    body("newPassword")
        .notEmpty()
        .withMessage("Password cannot be empty!")
        .isLength({ min: 6 })
        .withMessage("Password must have at least 6 characters!")
        .custom((value, { req }) => {
            return value !== req.body.currentPassword;
        })
        .withMessage("Please don't use old password!"),
    body("confirmPassword")
        .notEmpty()
        .withMessage("Password cannot be empty!")
        .isLength({ min: 6 })
        .withMessage("Password must have at least 6 characters!")
        .custom((value, { req }) => {
            return value === req.body.newPassword;
        })
        .withMessage("Confirm Password not match!"),
]

