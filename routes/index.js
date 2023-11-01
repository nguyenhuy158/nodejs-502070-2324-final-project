const express                 = require("express");
const router                  = express.Router();
const userController          = require("../controllers/userController");
const routerController        = require("../controllers/routerController");
const errors                  = require("./errors");
const { UserValidator }       = require("../middlewares/validator");
const { upload }              = require("../config/upload");
const authRoutes              = require("./auth");
const userRouter              = require("./user");
const checkoutRouter          = require("./checkout");
const customerRouter          = require("./customer");
const productRouter           = require("./product");
const { autoViews }           = require("../middlewares/auto-views");
const { flashMiddleWare }     = require("../middlewares/flash");
const logger                  = require("../middlewares/handler");
const { logRequestDetails }   = require("../middlewares/access-log");
const { winstonLog }          = require("../controllers/appController");
const path                    = require("path");
const config                  = require("../config/config");
const { updateCurrentUser }   = require("../middlewares/authentication");
const { ensureAuthenticated } = require("../controllers/authController");
const authController          = require("../controllers/authController");
const { limiter }             = require("../config/config");
const { requireRole }         = require("../middlewares/authorization");
const { categories }          = require("../controllers/productCategoryController");
const { body }                = require("express-validator");

// other middleware and server

router
    .use(logRequestDetails)
    .use(limiter)
    // .use(require("morgan")("tiny", config.morganOptions))
    // .use(winstonLog)
    .use(updateCurrentUser)
    .get("/error", (req, res, next) => {
        try {
            throw new Error("This is a 500 error.");
        } catch (err) {
            next(err);
        }
    });

// auth router
router
    .use(authRoutes)
    .use(ensureAuthenticated)
    .get("/change-password", authController.changePassword)
    .post("/change-password",
          body("password")
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
                  return value !== req.body.password;
              })
              .withMessage("Don't use old password!"),
          body("confirmPassword")
              .notEmpty()
              .withMessage("Password cannot be empty!")
              .isLength({ min: 6 })
              .withMessage("Password must have at least 6 characters!")
              .custom((value, { req }) => {
                  return value === req.body.newPassword;
              })
              .withMessage("Confirm Password not match!"),
          authController.postChangePassword)
    
    // other middleware and server
    .use(routerController.checkFirstLogin)
    .use(autoViews)
    .get("/log", logger.morganLog)
    .get("/sent-test-mail", routerController.sentMail)
    .get("/", routerController.home)
    .get("/profile", userController.viewProfile)
    .post("/upload-profile-pic", upload.single("profilePic"), userController.changeProfilePicture)
    .get("/random-product", routerController.randomProduct)
    .get("/create-sample-data", routerController.createSampleData)
    .get("/search", routerController.searchResults)
    .post("/update-settings", userController.apiUpdateSetting);

// main router
router
    .use(async (req, res, next) => {
        try {
            req.app.locals.categories = await categories();
        } catch (e) {
            console.log("=>(index.js:71) e", e);
            req.app.locals.categories = [];
        }
        next();
    })
    .use("/users", requireRole(process.env.ROLE_ADMIN), userRouter)
    .use("/products", requireRole(process.env.ROLE_ADMIN), productRouter)
    .use("/customers", customerRouter)
    .use("/checkout", checkoutRouter);

// error router
router
    .use(errors);

module.exports = router;
