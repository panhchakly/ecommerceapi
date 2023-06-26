const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');
const { validateMongobdId } = require('../utils/validateMongodbid');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require("jsonwebtoken");

//Register a user
const registerUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        //Create a new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error('User Already Exists.');
    }
});

//Login a user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //if user exists
    const findUser = await User.findOne({ email });
    const passMatched = await findUser.isPasswordMatched(password);
    if (findUser && passMatched) {
        //refreshToken
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(findUser?._id, { refreshToken }, { new: true });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 72 * 60 * 60 * 1000 });
        //respone
        res.json({ ...findUser?._doc, token: generateToken(findUser?._id) });
    } else {
        throw new Error('Invalid Credentials');
    }
});

//Handle Refresh Token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No refresh token in cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error('No refresh token present in db or not matched.');
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        // console.log(decoded);
        if (err || user.id !== decoded.id) throw new Error('There is something wrong with refresh token');
        const accessToken = generateToken(user?._id);
        res.json({ accessToken })
    });
});

//Logout functionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No refresh token in cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", { httpOnly: true, secure: true });
        return res.sendStatus(204); //forbidden
    }
    await User.findOneAndUpdate(refreshToken, { refreshToken: "" });
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.sendStatus(204); //forbidden
})

// Update a user
const UpdateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongobdId(id);
    const { firstname, lastname, email, mobile } = req.body;
    // console.log(id);
    try {
        const updateUser = await User.findByIdAndUpdate({ _id: id }, { firstname, lastname, email, mobile }, { new: true });
        res.json(updateUser);
    } catch (error) {
        throw new Error(error);
    }
});

//Get All user

const getAllUser = asyncHandler(async (req, res) => {
    try {
        const getUser = await User.find();
        res.json(getUser);
    } catch (error) {
        throw new Error(error)
    }
});

// Get a single user
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongobdId(id);
    // console.log(id);
    try {
        const getauser = await User.findOne({ _id: id });
        res.json(getauser);
    } catch (error) {
        throw new Error(error);
    }
});

// Delete a single user
const DeleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongobdId(id);
    // console.log(id);
    try {
        const deleteUser = await User.findByIdAndDelete({ _id: id });
        res.json(deleteUser);
    } catch (error) {
        throw new Error(error);
    }
});

//Block User
const blockUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    validateMongobdId(id);
    try {
        await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
        res.json({ message: "User Blocked" });
    } catch (error) {
        throw new Error(error);
    }
});

//Unblock User
const unBlockUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    validateMongobdId(id);
    try {
        await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        res.json({ message: "User unBlocked" });
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { registerUser, loginUser, getAllUser, getUser, DeleteUser, UpdateUser, blockUser, unBlockUser, handleRefreshToken, logout };