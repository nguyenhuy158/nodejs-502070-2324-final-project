const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router
    .get("/", userController.getUsers)
    .post("/", userController.createUser)
    .put("/:id/lock", userController.lockAccount)
    .put("/:id/unlock", userController.unlockAccount)
    .get("/:id/resend", userController.resendEmail)
    .get("/create-account", userController.getCreateAccount)
    .post("/create-account", userController.createAccount)
    .post("/update-settings", userController.apiUpdateSetting)
    .delete("/:id", userController.deleteUser)
    .get("/:id", userController.getUser)
    .get("/login", userController.login)
    .post("/login", userController.loginSubmit);


module.exports = router;