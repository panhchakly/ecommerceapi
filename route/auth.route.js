const { registerUser, loginUser, getAllUser, getUser, DeleteUser, UpdateUser, blockUser, unBlockUser, handleRefreshToken, logout } = require('../controller/user.controller');
const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// router.get("/", (req, res) => {
//     res.send('Hello Welcome to cambodia')
// }) 

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all-user", getAllUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.delete("/:id", DeleteUser);
router.put("/:id", authMiddleware, isAdmin, UpdateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);

module.exports = router; 