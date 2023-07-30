import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "src/models";
import { statusCodes } from "../utils";
import AppError from "../AppError";
import config from "../config";

/**
 * Middleware to check if the user is authenticated.
 */
const userAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    throw new AppError({
      statusCode: statusCodes.UNAUTHORIZED,
      message: "Unauthorized access",
    });
  }

  jwt.verify(token, config.jwt.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      throw new AppError({
        statusCode: statusCodes.FORBIDDEN,
        message: "Invalid token",
      });
    }
    req.user = user as User;
    next();
  });
};

export default userAuthentication;
