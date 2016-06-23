module.exports = function(sequelize, DataTypes) {
  return sequelize.define('otdelay', {
    ovservation: DataTypes.STRING
  });
};