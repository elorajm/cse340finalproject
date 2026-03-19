import { body } from "express-validator";

export const reviewRules = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5."),
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment is required.")
    .isLength({ min: 10 })
    .withMessage("Comment must be at least 10 characters.")
];