import dotenv from "dotenv";
import express from "express";
import articleRoutes from "./routes/articleRoutes.js";
import userRoutes from "./routes/authRoutes.js";
import db from "./db/db.js";
import passportConfig from "./config/passport-setup.js";
import session from "express-session";
import passport from "passport";

// Initialize environment variables
dotenv.config();

// Initialize app
const app = express();

// Server static assets
app.use(express.static("public"));

// Parse json object
app.use(express.json());

// Set template engine
app.set("view engine", "ejs");

// Initialize session
app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize passport to use cookies
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.get("/", (req, res) => {
  return res.render("home", { title: "Open Articles" });
});

app.use("/articles", articleRoutes);
app.use("/auth", userRoutes);

db.connectToDb(() => {
  console.log("Database connected successfully");
  app.listen(process.env.PORT, () =>
    console.log(`http://localhost:${process.env.PORT}`)
  );
});
