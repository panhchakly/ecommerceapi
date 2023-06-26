// Error Not Found
const notFound = (req, res, next) => {
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status = 404;
    next(error); // This will continue to function 2
};

// Error Handler

const errorHandler = (err, req, res, next) => {
    // console.log(err);
    const statuscode = res.statuscode === 200 ? 500 : res.statuscode;
    req.status = statuscode;
    res.json({
        message: err?.message,
        stack: err?.stack
    })
}

module.exports = { notFound, errorHandler }