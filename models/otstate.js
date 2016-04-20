module.exports = function(sequelize, DataTypes) {
  return sequelize.define('otstate', {
    name: DataTypes.STRING
  });
};
