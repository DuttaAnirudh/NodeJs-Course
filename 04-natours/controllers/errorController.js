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

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }
  // RENDERED WEBSITE
  else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // A.) API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming or other unknown error: don't leak error details
    // 1. Log Error
    console.error('ERROR: ', err);

    // 2. Send generic response
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }

  // B.) RENDERED WEBSITE
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details
  // 1. Log Error
  console.error('ERROR: ', err);

  // 2. Send generic response
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const handleJWTError = () =>
  new AppError('Invalid Token. Please logn again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please login again', 401);

// By specifying 4 parameters, express already knows that the
// following entire function is an error handling middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, req, res);
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

    if (errorName === 'JsonWebTokenError') {
      error = handleJWTError();
    }

    if (errorName === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }
    return sendErrorProd(error, req, res);
  }
};
