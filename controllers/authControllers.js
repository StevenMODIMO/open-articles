import db from "../db/db.js";
import { ObjectId } from "mongodb";



// Page controllers

const renderSignup = async (req, res) => {
  return res.render("signup", { title: "Get Started", user: req.user });
};

const renderLogin = async (req, res) => {
  return res.render("login", { title: "Login to continue", user: req.user });
};



export {
  // page functions
  renderLogin,
  renderSignup,
};
