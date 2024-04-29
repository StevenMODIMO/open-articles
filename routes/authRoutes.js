import express from "express";
import {
  renderLogin,
  renderSignup,
  signup_post,
  login_post
} from "../controllers/authControllers.js";
import passport from "passport";

const router = express.Router();

// Page routes

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/signup", renderSignup);

router.get("/login", renderLogin);

// Users controllers
router.get("/twitter", passport.authenticate("twitter"));

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/twitter/redirect",
  passport.authenticate("twitter"),
  (req, res) => {
    res.redirect("/profile");
  }
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile");
});

router.get("/logout", (req, res) => {
  req.logout(function () {
    res.redirect("/");
  });
});

router.post("/signup", signup_post)

router.post("/login", login_post)

export default router;
