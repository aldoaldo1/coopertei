module.exports = function(sequelize, DataTypes) {
  return sequelize.define('materialorder', {
    date: DataTypes.STRING,
    provider: DataTypes.STRING
  });
};
