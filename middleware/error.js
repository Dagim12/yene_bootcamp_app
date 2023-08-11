const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
  //log to console for dev
  console.log(err);
  let error = { ...err };
  error.message = err.message;

  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  //Mongoose duplicate key
  if (error.code === 11000) {
    const message = `Duplicate value entered`;
    error = new ErrorResponse(message, 400);
  }

  //Mongoose validation error
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(msg, 400);
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "server error",
  });
};

module.exports = errorHandler;
