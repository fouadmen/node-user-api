import { NextFunction, Response, Request } from "express";
import { statusCodes } from "../utils";
import AppError from "../AppError";

/**
 * Middleware to check if the authenticated user has enough permissions.
 */
const userAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.id;
  if (req.user.id !== userId) {
      throw new AppError({
        statusCode: statusCodes.FORBIDDEN,
        message: "Unauthorized Operation" ,
      });
  }
  next();
};

export default userAuthorization;
