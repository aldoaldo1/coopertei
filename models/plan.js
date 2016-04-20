// Plans are assigned to O/Ts, they have many Tasks

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('plan', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  });
};
