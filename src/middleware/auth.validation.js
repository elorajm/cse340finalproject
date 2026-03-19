import { body } from "express-validator";

export const registerRules = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required."),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
];

export const loginRules = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required."),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
];