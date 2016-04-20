module.exports = function(sequelize, DataTypes) {
  return sequelize.define('materialcategory', {
    name: DataTypes.STRING
  });
};
