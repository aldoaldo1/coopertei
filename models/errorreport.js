module.exports = function(sequelize, DataTypes) {
  return sequelize.define('errorreport', {
    description: DataTypes.TEXT,
    suggestion: DataTypes.TEXT,
    user: DataTypes.STRING
  });
};
