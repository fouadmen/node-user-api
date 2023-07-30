
import express from "express";
import { inputValidation } from "../../middlewares";
import { UserController } from "../../controllers";

const router = express.Router();

router.post("/register", inputValidation.validateRegisterSchema, UserController.register);

router.post("/login", inputValidation.validateLoginSchema, UserController.login);

export default router;
