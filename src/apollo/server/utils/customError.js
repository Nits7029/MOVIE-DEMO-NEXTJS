export class CustomError extends Error {
  constructor(...args) {
    super(...args);
    this.code = args[1] || 500;
    this.message = args[0];
    Error.captureStackTrace(this, 'Error');
  }
}