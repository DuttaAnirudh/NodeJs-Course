const AppError = require('../utils/appError');

const handleCastErrorDb = (err) => {
  const message = `Invalid Path - ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}, Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or other unknown error: don't leak error details
  else {
    // 1. Log Error
    console.error('ERROR: ', err);

    // 2. Send generic response
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

// By specifying 4 parameters, express already knows that the
// following entire function is an error handling middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    const errorName = err.name;
    let error = { ...err };

    // Handling Invalid Pathname
    if (errorName === 'CastError') {
      error = handleCastErrorDb(err);
    }

    // Handling Duplicate Field(input values)
    if (err.code === 11000) error = handleDuplicateFieldDB(err);

    // Handling Validation Errors
    if (errorName === 'ValidationError') {
      error = handleValidationErrorDB(err);
    }

    return sendErrorProd(error, res);
  }
};
