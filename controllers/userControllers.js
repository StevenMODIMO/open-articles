import db from "../db/db.js";
import { ObjectId } from "mongodb";

let dq;

db.connectToDb((error) => {
  if (!error) {
    dq = db.getDb();
  }
});

const renderProfile = async (req, res) => {
  const username = req.user.username;
  const userArticles = await dq
    .collection("articles")
    .find({ "author.name": username })
    .toArray();
  res.render("profile", {
    title: `Welcome ${username}`,
    user: req.user,
    userArticles,
  });
};

const renderUpdateArticle = async (req, res) => {
  const { id } = req.params;
  const article = await dq
    .collection("articles")
    .findOne({ _id: new ObjectId(id) });
  res.render("update", { title: "Update Article", article, user: req.user });
};

const rendercreateArticle = (req, res) => {
  res.render("create", { user: req.user, title: "New Article"})
}

export { renderProfile, renderUpdateArticle, rendercreateArticle };
