import express from "express";
import {
  renderArticles,
  renderSingleArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleControllers.js";

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "covers/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const router = express.Router();

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", renderArticles);

router.get("/:id", renderSingleArticle);

router.post("/new", authCheck, upload.single("cover"), createArticle);

router.patch("/:id", authCheck, updateArticle);

router.delete("/:id", authCheck, deleteArticle);

export default router;
