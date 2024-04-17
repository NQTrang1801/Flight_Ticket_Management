const express = require("express");
const { createUser, loginUserCtrl, handleRefreshToken, logout } = require("../controller/userController");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
module.exports = router;
