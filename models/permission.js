// A Permission is a rule, a way to specify access to resources,
// assignable to Users or Roles

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('permission', {
    name: DataTypes.STRING
  });
};
