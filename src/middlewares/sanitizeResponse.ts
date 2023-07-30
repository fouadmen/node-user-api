import { NextFunction, Response, Request, Send } from "express";

/**
 * Middleware to sanitize sensitive data in the response before sending it to the client.
 * @param req Request object.
 * @param res Response object.
 * @param next NextFunction
 */
const sanitizeResponse = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  res.json = function (data) {
    if (typeof data === "object" && Object.keys(data).includes("password")) {
      const sanitizedData = { ...data };
      delete sanitizedData.password;
      originalJson.call(this, sanitizedData);
    } else {
      originalJson.call(this, data);
    }
  } as Send;
  next();
};

export default sanitizeResponse;
