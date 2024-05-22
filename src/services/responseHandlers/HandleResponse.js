// helpers/responseHelper.js

const { logger } = require("../logHandlers/HandleWinston");

const sendResponse = (res, status, message, data = null) => {
  return res.status(status).json({
    status,
    message,
    data,
  });
};

const sendError = (res, status, message) => {
  return res.status(status).json({
    status,
    message,
  });
};

// error handler for async functions
class CustomError extends Error {
  constructor(statusCode = 500, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

//global error handler
const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  sendError(res, statusCode, err.message);
};

module.exports = {
  sendResponse,
  sendError,
  CustomError,
  globalErrorHandler,
};
