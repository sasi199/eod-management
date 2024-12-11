const mongoose = require('mongoose');
const {status} = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/apiError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? status.BAD_REQUEST : status.INTERNAL_SERVER_ERROR;
    const message = error.message || status[statusCode];
    error = new ApiError(statusCode, message, false, error.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  let { statusCode, message,details } = error;
  if (config.env === 'production' && !error.isOperational) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = status[status.INTERNAL_SERVER_ERROR];
    details= details || null;
  }

  res.locals.errorMessage = error.message;

  const response = {
    code: statusCode,
    message,
    details: details || null,
    ...(config.env === 'development' && { stack: error.stack }),
  };

  if (config.env === 'development') {
    logger.error(error);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
