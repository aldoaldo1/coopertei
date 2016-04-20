module.exports = function(sequelize, DataTypes) {
  return sequelize.define('equipment', {
    name: DataTypes.STRING
  });
};
