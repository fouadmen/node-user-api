import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      error: err.message,
    });
  } else {
    // Logging could be useful here to check critical errors.
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      error: "Internal Error : Something went wrong!",
    });
  }
};

export default errorHandler;
