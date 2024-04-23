import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import articleRoutes from "./routes/articleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import db from "./db/db.js";
import passportConfig from "./config/passport-setup.js";

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

db.connectToDb(() => {
  console.log("Database connected successfully");
  app.listen(process.env.PORT, () =>
    console.log(`http://localhost:${process.env.PORT}`)
  );
  dq = db.getDb();
});

app.get("/", async (req, res) => {
  const articles = await dq.collection("articles").find().toArray();
  return res.render("home", {
    title: "Open Articles",
    user: req.user,
    articles,
  });
});
