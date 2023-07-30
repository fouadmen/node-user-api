import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { comparePasswords, hashPassword, statusCodes } from "../utils";
import { User } from "../models";
import AppError from "../AppError";
import config from "../config";

const register = async (req: Request, res: Response, next: NextFunction) => {
  const userData: User = req.body;
  try {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        message: "User already exists.",
      });
    }
    const hashedPassword = hashPassword(userData.password);
    const newUser: User = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    };
    const user = await User.insert(newUser);
    const access_token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      config.jwt.JWT_SECRET_KEY,
      { expiresIn: config.jwt.JWT_TOKEN_DURATION }
    );
    res.status(statusCodes.CREATED).json({ user, access_token });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        message: "User not found.",
      });
    }

    const isValidPassword = comparePasswords(user.password, password);
    if (!isValidPassword) {
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        message: "Invalid password.",
      });
    }

    const access_token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      config.jwt.JWT_SECRET_KEY,
      { expiresIn: config.jwt.JWT_TOKEN_DURATION }
    );
    delete user.password;
    res.status(statusCodes.CREATED).json({ user, access_token });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll(req.query);
    res.status(statusCodes.OK).json(users);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({ id: userId });

    if (!user) {
      throw new AppError({
        statusCode: statusCodes.NOT_FOUND,
        message: "User not found.",
      });
    }
    res.status(statusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: User = req.body;
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        message: "User already exists.",
      });
    }
    const hashedPassword = hashPassword(userData.password);
    const newUser: User = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    };
    const user = await User.insert(newUser);
    return user;
  } catch (error) {}
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  const userData: User = req.body;
  try {
    const existingUser = await User.findOne({ id: userId });
    if (!existingUser) {
      throw new AppError({
        statusCode: statusCodes.NOT_FOUND,
        message: "User does not exist.",
      });
    }

    // Check if the new email is already taken by another user
    if (userData.email && userData.email !== existingUser.email) {
      const userWithNewEmail = await User.findOne({ email: userData.email });
      if (userWithNewEmail) {
        throw new AppError({
          statusCode: statusCodes.BAD_REQUEST,
          message: "Email is already taken.",
        });
      }
    }

    // Check if the user wants to update the password
    if (userData.password) {
      const hashedPassword = await hashPassword(userData.password);
      userData.password = hashedPassword;
    }

    const newUser = { ...existingUser, ...userData };
    const user = await User.update(userId, newUser);
    res.status(statusCodes.CREATED).json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  try {
    const existingUser = await User.findOne({ id: userId });
    if (!existingUser) {
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        message: "User does not exist.",
      });
    }
    await User.delete(userId);
    res.json({ deleted: true });
  } catch (error) {
    next(error);
  }
};

export default {
  getUsers,
  getUser,
  register,
  login,
  createUser,
  updateUser,
  deleteUser,
};
