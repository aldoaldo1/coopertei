// An Intervention is the reason for the O/T to exist

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('intervention', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  });
};
