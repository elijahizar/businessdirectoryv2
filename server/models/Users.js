module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Username is already used.",
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roles: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "3021",
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
  });

  return Users;
};
