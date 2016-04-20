module.exports = function(sequelize, DataTypes) {
  return sequelize.define('module', {
    name: DataTypes.STRING
  });
};
