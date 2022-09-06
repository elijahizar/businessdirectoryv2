module.exports = (sequelize, DataTypes) => {
  const Villes = sequelize.define(
    "Villes",
    {
      villeName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      villePostalCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      villeDepartement: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  return Villes;
};
