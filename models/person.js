module.exports = function(sequelize, DataTypes) {
  return sequelize.define('person', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING
  });
};
