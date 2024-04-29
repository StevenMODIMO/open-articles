import db from "../db/db.js";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import dotenv from "dotenv";

dotenv.config();

let dq;

db.connectToDb((error) => {
  if (!error) {
    dq = db.getDb();
  }
});

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

const renderSignup = async (req, res) => {
  return res.render("signup", { title: "Get Started", user: req.user });
};

const renderLogin = async (req, res) => {
  return res.render("login", { title: "Login to continue", user: req.user });
};

const signup_post = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Empty fields detected." });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ error: "Weak password" });
  }

  try {
    const user = await dq.collection("users").findOne({ email });
    if (user) {
      return res.status(400).json({ error: "Email already in use" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const newUser = await dq
        .collection("users")
        .insertOne({ email, password: hash });
      const token = createToken(newUser.insertedId);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: newUser.insertedId });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const login_post = async (req, res) => {
  const { email, password } = req.body;
  res.status(200).json({ email, password });
};

export { renderLogin, renderSignup, signup_post, login_post };
