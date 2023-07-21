const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('message', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content:{
      type: DataTypes.TEXT,
    }
  });
};