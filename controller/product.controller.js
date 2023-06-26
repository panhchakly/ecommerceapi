const Product = require('../models/product.model');
const asyncHandler = require('express-async-handler');

//Create Products
const createProduct = asyncHandler(async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = { createProduct }