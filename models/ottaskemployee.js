module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ottaskemployee', {
    time: DataTypes.STRING
  });
};
