export const notFound = (req, res, next) => {
  res.status(404);
  res.render("404", { title: "404 Page Not Found" });
  next()
};
