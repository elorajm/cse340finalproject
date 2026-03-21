import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { findUserByEmail, createUser } from "../models/auth.model.js";

export function showRegister(req, res) {
  res.render("auth/register", {
    title: "Register",
    errors: [],
    old: {}
  });
}

export async function registerUser(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("auth/register", {
        title: "Register",
        errors: errors.array(),
        old: req.body
      });
    }

    const { first_name, last_name, email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).render("auth/register", {
        title: "Register",
        errors: [{ msg: "Email already exists." }],
        old: req.body
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await createUser(first_name, last_name, email, passwordHash);

    req.session.user = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name
    };

    req.flash("success", `Welcome to Jake's, ${first_name}! Your account has been created.`);
    req.session.save(() => res.redirect("/"));
  } catch (error) {
    next(error);
  }
}

export function showLogin(req, res) {
  res.render("auth/login", {
    title: "Login",
    errors: [],
    old: {}
  });
}

export async function loginUser(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("auth/login", {
        title: "Login",
        errors: errors.array(),
        old: req.body
      });
    }

    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).render("auth/login", {
        title: "Login",
        errors: [{ msg: "Invalid email or password." }],
        old: req.body
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(400).render("auth/login", {
        title: "Login",
        errors: [{ msg: "Invalid email or password." }],
        old: req.body
      });
    }

    req.session.user = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name
    };

    req.flash("success", `Welcome back, ${user.first_name}!`);
    req.session.save(() => res.redirect("/"));
  } catch (error) {
    next(error);
  }
}

export function logoutUser(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.redirect("/?bye=1");
  });
}