import db from "../db/db.js";
import { ObjectId } from "mongodb";
import path from "path";

let dq;

db.connectToDb((error) => {
  if (!error) {
    dq = db.getDb();
  }
});

const renderSingleArticle = async (req, res) => {
  const { id } = req.params;
  const article = await dq
    .collection("articles")
    .findOne({ _id: new ObjectId(id) });
  res.render("article", { title: "Reading", user: req.user, article });
};

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

export { renderSingleArticle, createArticle, updateArticle, deleteArticle };
