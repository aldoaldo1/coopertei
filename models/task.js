// Tasks are components of one or more Task Plans,
// they belong to a Category or Subcategory

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('task', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  });
};
