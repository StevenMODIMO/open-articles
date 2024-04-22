import express from "express";
import {
  // articles functions
  getArticles,
  getSingleArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleControllers.js";

const router = express.Router();


// Articles routes

router.get("/", getArticles);

router.get("/:id", getSingleArticle);

router.post("/new", createArticle);

router.patch("/:id", updateArticle);

router.delete("/:id", deleteArticle);

export default router;
