const express = require("express");
const { register, login, getMe, updateUser, deleteUser } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", verifyToken, getMe);

router.put("/:username", verifyToken, updateUser);

router.delete("/delete-user", verifyToken, deleteUser);

module.exports = router;