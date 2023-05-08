// Retrieve all Guidelines from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  res.send({ message: "Guidelines" });
};