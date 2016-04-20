module.exports = function(sequelize, DataTypes) {
  return sequelize.define('inout', {
    authorized: DataTypes.STRING,
    out: DataTypes.STRING,
    comeback: DataTypes.STRING,
    permitted: DataTypes.BOOLEAN
  });
};
