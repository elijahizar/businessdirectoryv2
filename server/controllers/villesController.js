const { Villes } = require("../models");

const getAllVilles = async (req, res) => {
  const villes = await Villes.findAll({ order: [["villePostalCode", "ASC"]] });
  res.json(villes);
};

module.exports = { getAllVilles };
