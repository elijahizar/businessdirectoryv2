const { Categories } = require("../models");

const getAllCategories = async (req, res) => {
  const categories = await Categories.findAll({
    order: [["category_name", "ASC"]],
  });
  res.json(categories);
};

module.exports = { getAllCategories };
