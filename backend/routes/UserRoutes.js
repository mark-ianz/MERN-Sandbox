import express from "express";
import { signup_user,login_user } from "../controller/UserController.js";
import { signup_validator,login_validator } from "../util/validators.js";

const router = express.Router();

router.post("/signup", signup_validator, signup_user);
router.post("/login", login_validator, login_user);

export default router;
