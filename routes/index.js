const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const routerController = require("../controllers/routerController");
const errors = require("./errors");
const { UserValidator } = require("../validators/validator");
const { upload } = require("../config/upload");
const authRoutes = require("./auth");
const userRouter = require("./user");
const productRouter = require("./product");
const { autoViews } = require("../middlewares/auto-views");
const { flashMiddleWare } = require("../middlewares/flash");
const logger = require("../log/handler");
const { logRequestDetails } = require("../middlewares/access-log");
const { winstonLog } = require("../controllers/appController");
const path = require("path");
const config = require("../config/config");
const { updateCurrentUser } = require("../middlewares/authentication");

// other middleware and server
router
    // .use(require("morgan")("tiny", config.morganOptions))
    // .use(winstonLog)
    .use(updateCurrentUser)
    .use(logRequestDetails)
    .use(flashMiddleWare)
    .use(autoViews)
    .get("/error", (req, res, next) => {
        try {
            throw new Error("This is a 500 error.");
        } catch (err) {
            next(err);
        }
    });

// auth router
router.use(authRoutes);

// other middleware and server
router
    .get("/log", logger.morganLog)
    .use(routerController.checkFirstLogin)
    .post("/register", UserValidator, userController.register)
    .get("/sent-mail", routerController.sentMail)
    .get("/", routerController.home)
    .get("/profile", userController.viewProfile)
    .post("/upload-profile-pic", upload.single("profilePic"), userController.changeProfilePicture)
    .get("/random-product", routerController.randomProduct);


// main router
router.use("/users", userRouter);
router.use("/products", productRouter);

// middleware error
router.use(errors);


module.exports = router;
