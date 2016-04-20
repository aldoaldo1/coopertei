module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reportphoto', {
    path: DataTypes.STRING,
    name: DataTypes.STRING
  });
};
