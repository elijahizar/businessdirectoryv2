module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define("Categories", {
    idcategory: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Categories;
};
