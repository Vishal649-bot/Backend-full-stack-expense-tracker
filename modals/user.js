const Sequelize = require("sequelize");
const sequelize = require("../utils/db");

const User = sequelize.define("user signup", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING, // Ensure 'password' is correctly defined
    allowNull: false,
  },
});

module.exports = User;