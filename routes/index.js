const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");
const indexController = require("../controllers/index-controller");
const searchController = require("../controllers/search-controller");

const errorRouter = require("./error");
const authRoutes = require("./auth");
const userRouter = require("./user");
const checkoutRouter = require("./checkout");
const productRouter = require("./product");
const customerRouter = require("./customer");
const authController = require("../controllers/auth-controller");

const apiProductRouter = require("./api-product");
const apiUserRouter = require("./api-user");
const apiProductCategoryRouter = require("./api-product-category");
const apiCustomerRouter = require("./api-customer");
const apiCartRouter = require("./api-cart");

const { upload } = require("../config/upload");
const { checkFirstLogin } = require("../controllers/index-controller");
const { updateCurrentUser } = require("../middlewares/auth");
const { ensureAuthenticated } = require("../controllers/auth-controller");
const { autoViews } = require("../middlewares/auto-views");
const { logRequestDetails } = require("../middlewares/log");
const { limiter } = require("../config/config");
const { morganLog } = require("../middlewares/log");
const { requireRole } = require("../middlewares/auth");
const { validationChangePassword, validateSearch } = require('../middlewares/validation');
const { setLocalCategories } = require("../controllers/index-controller");
const { morganOptions } = require("../config/config");

router
    .use(logRequestDetails)
    .use(limiter)
    .get("/search/address", searchController.searchAddress)
    .use(require("morgan")("tiny", morganOptions))
    // .use(winstonLog)
    .use(updateCurrentUser)
    .get("/error", (req, res, next) => {
        try {
            throw new Error("This is a 500 error.");
        } catch (err) {
            next(err);
        }
    })
    // auth router
    .use(authRoutes)
    .use(ensureAuthenticated)
    .get("/change-password", authController.changePassword)
    .post("/change-password",
        validationChangePassword,
        authController.postChangePassword)
    // other middleware and server
    .use(checkFirstLogin)
    .use(autoViews)
    .use(setLocalCategories)
    .get("/log", morganLog)
    .get("/", indexController.home)
    .get("/profile", userController.viewProfile)
    .post("/upload-profile-pic", upload.single("profilePic"), userController.changeProfilePicture)
    .get("/random-product", indexController.randomProduct)
    .get("/create-sample-data", indexController.createSampleData)
    .get("/search",
        validateSearch,
        searchController.searchResults)
    .post("/api/setting", userController.postApiSetting)
    .get("/api/setting", userController.getApiSetting)

    // main router
    .use("/users", requireRole(process.env.ROLE_ADMIN), userRouter)
    .use("/products", requireRole(process.env.ROLE_ADMIN), productRouter)
    .use("/customers", customerRouter)
    .use("/checkout", checkoutRouter)

    // api router
    .use("/api/products", apiProductRouter)
    .use("/api/users", apiUserRouter)
    .use("/api/productCategories", apiProductCategoryRouter)
    .use("/api/customers", apiCustomerRouter)
    .use("/api/carts", apiCartRouter)

    // error router
    .use(errorRouter);


module.exports = router;
