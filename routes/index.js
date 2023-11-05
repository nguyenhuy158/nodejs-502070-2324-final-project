const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const routerController = require("../controllers/routerController");
const errors = require("./errors");
const { UserValidator } = require("../middlewares/validator");
const { upload } = require("../config/upload");
const authRoutes = require("./auth");
const userRouter = require("./user");
const apiProductRouter = require("./apiProduct");
const apiUserRouter = require("./apiUser");
const apiProductCategoryRouter = require("./apiProductCategory");
const checkoutRouter = require("./checkout");
const customerRouter = require("./customer");
const productRouter = require("./product");
const { autoViews } = require("../middlewares/auto-views");
const { flashMiddleWare } = require("../middlewares/flash");
const logger = require("../middlewares/handler");
const { logRequestDetails } = require("../middlewares/access-log");
const { winstonLog, setLocalCategories } = require("../controllers/indexController");
const path = require("path");
const config = require("../config/config");
const { updateCurrentUser } = require("../middlewares/authentication");
const { ensureAuthenticated } = require("../controllers/authController");
const authController = require("../controllers/authController");
const { limiter } = require("../config/config");
const { requireRole } = require("../middlewares/authorization");
const { validationChangePassword } = require('../middlewares/validation');

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
        validationChangePassword,
        authController.postChangePassword)

    // other middleware and server
    .use(routerController.checkFirstLogin)
    .use(autoViews)
    .get("/log", logger.morganLog)
    .get("/", routerController.home)
    .get("/profile", userController.viewProfile)
    .post("/upload-profile-pic", upload.single("profilePic"), userController.changeProfilePicture)
    .get("/random-product", routerController.randomProduct)
    .get("/create-sample-data", routerController.createSampleData)
    .get("/search", routerController.searchResults)
    .post("/api/setting", userController.postApiSetting)
    .get("/api/setting", userController.getApiSetting);

// main router
router
    .use(setLocalCategories)
    .use("/users", requireRole(process.env.ROLE_ADMIN), userRouter)
    .use("/products", requireRole(process.env.ROLE_ADMIN), productRouter)
    .use("/customers", customerRouter)
    .use("/checkout", checkoutRouter);

router
    .use("/api/products", apiProductRouter)
    .use("/api/users", apiUserRouter)
    .use("/api/productCategories", apiProductCategoryRouter);

// error router
router
    .use(errors);

module.exports = router;
