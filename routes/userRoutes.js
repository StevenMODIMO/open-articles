import express from "express";
import {
  renderProfile,
  renderUpdateArticle,
} from "../controllers/userControllers.js";

const router = express.Router();

// Page routes

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, renderProfile);

router.get("/articles/update/:id", renderUpdateArticle)

export default router;
