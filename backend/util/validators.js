import { body } from "express-validator";
import User from "../model/UserSchema.js";

export const post_validator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),
];

export const login_validator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),
]

export const signup_validator = [
  body ("username")
    .notEmpty()
    .withMessage ("Username is required")
    .isLength ({min: 5})
    .withMessage ("Username must be at least 5 characters long")
    .isString()
    .withMessage ("Username must be a string")
    .custom (async (value)=> {
      const user = await User.find ({username: value});
      if (user.length > 0) {
        throw new Error ("Username already exists");
      }
    }),

  body ("email")
    .notEmpty()
    .withMessage ("Email is required")
    .isEmail()
    .withMessage ("Email must be a valid email")
    .custom (async (value)=> {
      const user = await User.find ({email: value});
      if (user.length > 0) {
        throw new Error ("Email already exists");
      }
    }),

  body ("password")
    .notEmpty()
    .withMessage ("Password is required")
    .isString()
    .withMessage ("Password must be a string")
    .isLength ({min: 5})
    .withMessage ("Password must be at least 5 characters long"),

  body ("confirmPassword")
    .notEmpty()
    .withMessage ("Confirm Password is required")
    .isString()
    .withMessage ("Confirm Password must be a string")
    .custom ((value, {req})=> {
      if (value !== req.body.password) {
        throw new Error ("Passwords do not match");
      }
      return true;
    }),
]