const express = require("express");
const router = express.Router();
const logger = require("../config/logger");

const userController = require("../controllers/user-controller");
const indexController = require("../controllers/index-controller");
const searchController = require("../controllers/search-controller");

const authRoutes = require("./auth");
const userRouter = require("./user");
const orderRouter = require("./order");
const errorRouter = require("./error");
const productRouter = require("./product");
const checkoutRouter = require("./checkout");
const customerRouter = require("./customer");
const authController = require("../controllers/auth-controller");

const apiUserRouter = require("./api-user");
const apiOrderRouter = require("./api-order");
const apiCartRouter = require("./api-cart");
const apiProductRouter = require("./api-product");
const apiCustomerRouter = require("./api-customer");
const apiProductCategoryRouter = require("./api-product-category");

const { upload } = require("../config/upload");
const { limiter } = require("../config/config");
const { requireRole } = require("../middlewares/auth");
const { autoViews } = require("../middlewares/auto-views");
const { updateCurrentUser } = require("../middlewares/auth");
const { checkFirstLogin } = require("../controllers/index-controller");
const { setLocalCategories } = require("../controllers/index-controller");
const { ensureAuthenticated } = require("../controllers/auth-controller");
const { validationChangePassword, validateSearch } = require('../middlewares/validation');

router
    .use(limiter)
    .get("/search/address", searchController.searchAddress)
    .use(updateCurrentUser)
    .get("/error", (req, res, next) => {
        next(new Error("This is a 500 error."));
    })
    // auth router
    .use(authRoutes)
    .use(ensureAuthenticated)
    .get("/change-password", authController.getChangePassword)
    .post("/change-password",
        validationChangePassword,
        authController.postChangePassword)
    // other middleware and server
    .use(checkFirstLogin)
    .use(autoViews)
    .use(setLocalCategories)
    .get("/", indexController.getDashboardPage)
    .get("/profile", userController.viewProfile)
    .post("/upload-profile-pic", upload.single("profilePic"), userController.changeProfilePicture)
    .get("/search",
        validateSearch,
        searchController.searchResults)
    .post("/api/setting", userController.postApiSetting)
    .get("/api/setting", userController.getApiSetting)

    // main router
    .use("/users", requireRole(process.env.ROLE_ADMIN), userRouter)
    .use("/products", requireRole(process.env.ROLE_ADMIN), productRouter)
    .use("/customers", customerRouter)
    .use("/orders", orderRouter)
    .use("/checkout", checkoutRouter)

    // api router
    .use("/api/products", apiProductRouter)
    .use("/api/users", apiUserRouter)
    .use("/api/productCategories", apiProductCategoryRouter)
    .use("/api/customers", apiCustomerRouter)
    .use("/api/orders", apiOrderRouter)
    .use("/api/carts", apiCartRouter)

    // error router
    .use(errorRouter);


module.exports = router;
