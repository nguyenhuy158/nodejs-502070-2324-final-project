const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");

router
    .get("/", userController.getUsers)
    .post("/", userController.createUser)
    .put("/:id/lock", userController.lockAccount)
    .put("/:id/unlock", userController.unlockAccount)
    .get("/:id/resend", userController.resendEmail)
    // .get("/create-account", userController.getCreateAccount)
    // .post("/create-account", userController.postCreateAccount)
    .delete(/^\/([0-9a-fA-F]{24})$/, userController.deleteUser)
    .get(/^\/([0-9a-fA-F]{24})$/, userController.getUser)
    .get("/login", userController.login)
    .post("/login", userController.loginSubmit);


module.exports = router;