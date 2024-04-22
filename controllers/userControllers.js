import db from "../db/db.js";
import { ObjectId } from "mongodb";

let dq;

db.connectToDb((error) => {
  if (!error) {
    dq = db.getDb();
  }
});

// Page controllers

const renderSignup = async (req, res) => {
  return res.render("signup", { title: "Get Started" });
};

const renderLogin = async (req, res) => {
  return res.render("login", { title: "Login to continue" });
};

const renderProfile = async (req, res) => {
  return res.render("profile", { title: "Welcome,", user: req.user });
};

export {
  // page functions
  renderLogin,
  renderSignup,
  renderProfile,
};
