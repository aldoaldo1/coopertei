module.exports = function(sequelize, DataTypes) {
  return sequelize.define('unit', {
    name: DataTypes.STRING
  });
};
