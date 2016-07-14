module.exports = function(sequelize, DataTypes) {
  return sequelize.define('otdelay', {
    observation: DataTypes.STRING
  });
};