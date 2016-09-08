module.exports = function(sequelize, DataTypes) {
  return sequelize.define('otobservation', {
    observation: DataTypes.STRING,
    ip: DataTypes.STRING,
    mac: DataTypes.STRING
  });
};
