module.exports = function(sequelize, DataTypes) {
  return sequelize.define('area', {
    name: DataTypes.STRING,
    tag: DataTypes.STRING
  });
};
