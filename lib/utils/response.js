export function apiResponse(success = true, message = '', data = null, statusCode = 200) {
  return {
    success,
    message,
    data,
    statusCode,
  };
}

export function errorResponse(message = 'An error occurred', statusCode = 500, error = null) {
  return {
    success: false,
    message,
    data: null,
    statusCode,
    error: error?.message || error,
  };
}

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
