module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reporttask', {
    observation: DataTypes.TEXT
  });
};
