const app = require('express');
const { createProduct } = require('../controller/product.controller');
const router = app.Router();

router.post("/", createProduct);

module.exports = router;