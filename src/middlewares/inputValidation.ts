import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { statusCodes } from "../utils";
import AppError from "../AppError";

const registerUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(18).required(),
});

const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(18).optional(),
});

const validateRegisterSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = registerUserSchema.validate(req.body);
  if (error) {
    handleValidationError(error.details[0].message);
  }
  next();
};

const validateLoginSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = loginUserSchema.validate(req.body);
  if (error) {
    handleValidationError(error.details[0].message);
  }
  next();
};

const validateUpdateSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    handleValidationError(error.details[0].message);
  }
  next();
};

const handleValidationError = (message: string) => {
  throw new AppError({
    statusCode: statusCodes.BAD_REQUEST,
    message: `Invalid Input Error : ${message}`,
  });
};

export default { validateLoginSchema, validateRegisterSchema, validateUpdateSchema };
