import express from "express";
import {
  renderProfile,
  renderUpdateArticle,
  rendercreateArticle,
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

router.get("/articles/update/:id", authCheck, renderUpdateArticle);

router.get("/articles/new", authCheck, rendercreateArticle);

export default router;
