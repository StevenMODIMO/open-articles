import express from "express";
import {
  renderCreatePage,
  renderSingleArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleControllers.js";

const router = express.Router();

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/:id", renderSingleArticle);

router.get("/new", authCheck, renderCreatePage);

router.post("/new", authCheck, createArticle);

router.patch("/:id", authCheck, updateArticle);

router.delete("/:id", authCheck, deleteArticle);

export default router;
