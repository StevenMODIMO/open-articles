import express from "express";
import {
  renderLogin,
  renderSignup,
  renderProfile,
} from "../controllers/userControllers.js";
import passport from "passport";

const router = express.Router();

// Page routes

router.get("/signup", renderSignup);

router.get("/login", renderLogin);

router.get("/profile", renderProfile);

// Users controllers
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect("/profile");
  }
);

router.get("/logout", (req, res) => {
  // handle with passport
  req.logout(function () {
    res.redirect("/");
  });
});

export default router;
