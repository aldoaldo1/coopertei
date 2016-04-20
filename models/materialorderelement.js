module.exports = function(sequelize, DataTypes) {
  return sequelize.define('materialorderelement', {
    name: DataTypes.STRING,
    quantity: DataTypes.FLOAT,
    arrived: DataTypes.BOOLEAN
  });
};
