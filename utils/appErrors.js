class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    let str = String(this.statusCode).charAt(0);
    console.log(str);

    this.status = `${str == '4' ? 'fail' : 'error'}`;

    this.isOperational = true;
  }
}

module.exports = AppError;
