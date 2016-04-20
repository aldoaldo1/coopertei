module.exports = function(sequelize, DataTypes) {
  return sequelize.define('iva', {
    name: DataTypes.STRING
  });
};
