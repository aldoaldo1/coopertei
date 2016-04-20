module.exports = function(sequelize, DataTypes) {
  return sequelize.define('material', {
    name: DataTypes.STRING,
    stock: DataTypes.FLOAT,
    unit_id: DataTypes.INTEGER,
    materialcategory_id: DataTypes.INTEGER
  });
};
