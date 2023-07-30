class AppError extends Error {
  public message: string;
  public statusCode: number;
  public isOperational: boolean; // If true it indicates if the error is a normal operational error or not, default : True.

  constructor({
    message,
    statusCode,
    isOperational,
  }: {
    message: string;
    statusCode: number;
    isOperational?: boolean;
  }) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = !`${statusCode}`.startsWith("5");

    Error.captureStackTrace(this);
  }
}

export default AppError;
