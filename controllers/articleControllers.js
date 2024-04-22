import db from "../db/db.js";
import { ObjectId } from "mongodb";

let dq;

db.connectToDb((error) => {
  if (!error) {
    dq = db.getDb();
  }
});

// Articles Controllers

const getArticles = async (req, res) => {
  const articles = await dq.collection("articles").find().toArray();
  return res.status(200).json(articles);
};

const getSingleArticle = async (req, res) => {
  const { id } = req.params;
  const article = await dq
    .collection("articles")
    .findOne({ _id: new ObjectId(id) });
  return res.status(200).json(article);
};

const createArticle = async (req, res) => {
  const { headline, content } = req.body;
  const new_article = await dq
    .collection("articles")
    .insertOne({ headline, content });
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

export {

  // articles functions
  getArticles,
  getSingleArticle,
  createArticle,
  updateArticle,
  deleteArticle,
};
