module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ottaskresource', {
    employee_id: DataTypes.INTEGER,
    employee_hours: DataTypes.INTEGER,
    employee_minutes: DataTypes.INTEGER,
    materials_tools: DataTypes.STRING
  });
};
