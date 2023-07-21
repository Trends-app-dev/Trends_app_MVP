const { DataTypes, INTEGER } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('user', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    userName:{
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    }
  });
};