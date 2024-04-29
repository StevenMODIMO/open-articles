import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import articleRoutes from "./routes/articleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import db from "./db/db.js";
import passportConfig from "./config/passport-setup.js";
import path from "path";
import { fileURLToPath } from "url";
import { ObjectId } from "mongodb";
import cookieParser from "cookie-parser"

// Initialize environment variables
dotenv.config();

// Initialize app
const app = express();

// Middlewares
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");
app.use(cookieParser())

// Initialize session
app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 },
  })
);

// Initialize passport to use cookies
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

let dq;

app.use("/auth", authRoutes);
app.use("/profile", userRoutes);
app.use("/articles", articleRoutes);

// Routes
app.get("/covers/:filename", (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const coverPath = path.join(__dirname, "covers", req.params.filename);
  res.sendFile(coverPath);
});

app.get("/", async (req, res) => {
  res.render("home", { title: "Awesome Articles", user: req.user });
});

// 404 Route
app.use((req, res, next) => {
  res
    .status(404)
    .render("404", { title: "404: Page Not Found", user: req.user });
});

db.connectToDb(() => {
  console.log("Database connected successfully");
  app.listen(process.env.PORT, () =>
    console.log(`http://localhost:${process.env.PORT}`)
  );
  dq = db.getDb();
});
