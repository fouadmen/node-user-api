import express from "express";
import {
  userAuthentication,
  sanitizeResponse,
  userAuthorization,
  inputValidation,
} from "../../middlewares";
import { UserController } from "../../controllers";

const router = express.Router();
router.use(sanitizeResponse);

// This can be protected by another level of role validation (e.g Only admin can fetch all the users)
router.get("/", userAuthentication, UserController.getUsers);

router.get(
  "/:id",
  userAuthentication,
  userAuthorization,
  UserController.getUser
);

router.put(
  "/:id",
  userAuthentication,
  userAuthorization,
  inputValidation.validateUpdateSchema,
  UserController.updateUser
);

router.delete(
  "/:id",
  userAuthentication,
  userAuthorization,
  UserController.deleteUser
);

export default router;
