import db from "../db/db.js";
import { ObjectId } from "mongodb";
import path from "path";

let dq;

db.connectToDb((error) => {
  if (!error) {
    dq = db.getDb();
  }
});

const createArticle = async (req, res) => {
  const { headline, description, content } = req.body;
  const coverPath = path.normalize(req.file.path).replace(/\\/g, "/");
  const user = req.user;
  const author = {
    name: user.username,
    imageURL: user.imageURL,
  };
  const new_article = await dq
    .collection("articles")
    .insertOne({ headline, description, content, cover: coverPath, author });
  return res.status(200).json(new_article);
};

const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { headline, content, _id } = req.body;
  const updated = await dq
    .collection("articles")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { headline, content } }
    );
  return res.status(200).json(updated);
};

const deleteArticle = async (req, res) => {
  const { id } = req.params;
  const deleted = await dq
    .collection("articles")
    .findOneAndDelete({ _id: new ObjectId(id) });
  return res.status(200).json(deleted);
};

const renderArticle = async (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const article = await dq
      .collection("articles")
      .findOne({ _id: req.params.id });
    //res.render("article", { user: req.user, title: "Article", article });
    return res.status(200).json(article)
  } else {

    console.log("could not fetch")
  }
};

export { createArticle, updateArticle, deleteArticle, renderArticle };
