const { query, body, param, validationResult } = require('express-validator');
const User = require('../models/user');


exports.validateSearch = [
    query('q')
        .trim()
        .notEmpty()
        .withMessage("Search not empty!"),
    (req, res, next) => {
        const result = validationResult(req);
        if (result.errors.length === 0) {
            next();
        } else {
            req.flash('error', result.errors[0].msg);

            return res.render('pages/search/search-results');
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
        .withMessage("Password must have at least 6 characters!"),
    (req, res, next) => {
        const result = validationResult(req);
        if (result.errors.length === 0) {
            next();
        } else {
            return res.json({
                error: true,
                message: result.errors[0].msg
            });
        }
    }
];

exports.validateResetPassword = [
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
        }),
    (req, res, next) => {
        const result = validationResult(req);
        if (result.errors.length === 0) {
            next();
        } else {
            return res.json({
                error: true,
                message: result.errors[0].msg
            });
        }
    }
];

exports.validationChangePassword = [
    body("currentPassword")
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
    (req, res, next) => {
        const result = validationResult(req);
        if (result.errors.length !== 0) {
            req.flash("error", result.errors[0].msg);
            res.redirect("/change-password");
        }
        next();
    }
]

