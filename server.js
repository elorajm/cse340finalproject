import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import db from "./src/models/db.js";

import indexRoutes from "./src/routes/index.routes.js";
import { flashMiddleware } from "./src/middleware/flash.js";
import { notFound, errorHandler } from "./src/middleware/error-handler.js";

dotenv.config();

const app = express();

// Needed for __dirname in ESM:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PgStore = connectPgSimple(session);

app.use(
  session({
    store: new PgStore({
      pool: db,
      tableName: "session"
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2
    }
  })
);

app.use(flashMiddleware);

// Static files
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.currentPath = req.path;
  res.locals.query = req.query;
  next();
});

// Routes
app.use("/", indexRoutes);

// 404 and global error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});