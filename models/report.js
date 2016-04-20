module.exports = function(sequelize, DataTypes) {
  return sequelize.define('report', {
    ot_number: DataTypes.INTEGER
  });
};
