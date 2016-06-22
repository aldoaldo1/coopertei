module.exports = function(sequelize, DataTypes) {
  return sequelize.define('delay', {
    reason: DataTypes.STRING,
  });
};
