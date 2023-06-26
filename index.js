//process env require from config db
require('./config/db.js');
const express = require('express');
const authRouter = require('./route/auth.route.js');
const productRouter = require('./route/product.route.js')
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandller.js');
const app = express();
const cookies = require("cookie-parser");
const port = process.env.PORT || 4000;

// app.use('/', (req, res) => {
//     res.send('Hello how are you today?')
// });

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// body req cookie
app.use(cookies());

// router
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);

//middlewares
app.use(notFound);
app.use(errorHandler);

//server listen
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})