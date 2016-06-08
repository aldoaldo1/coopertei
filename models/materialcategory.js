module.exports = function(sequelize, DataTypes) {
  return sequelize.define('materialcategory', {
    name: DataTypes.STRING,
    longitude: DataTypes.INTEGER,
    material: DataTypes.INTEGER,
    internaldiameter: DataTypes.INTEGER,
    externaldiameter: DataTypes.INTEGER,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    thickness: DataTypes.INTEGER,
  });
};
