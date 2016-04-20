// A Role is assigned to a User

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('role', {
    name: DataTypes.STRING
  });
};
