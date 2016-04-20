module.exports = function(sequelize, DataTypes) {
  return sequelize.define('client', {
    name: DataTypes.STRING,
    tag: DataTypes.STRING,
    cuit: DataTypes.STRING,
    iva_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    addressnumber: DataTypes.INTEGER,
    floor: DataTypes.INTEGER,
    apartment: DataTypes.STRING,
    email: DataTypes.STRING
  });
};
