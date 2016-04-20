// A Employee is related to a Person,
// belongs to an Area

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('employee', {
    payroll_number: DataTypes.STRING,
    intern: DataTypes.INTEGER,
    schedule_ini_id: DataTypes.INTEGER,
    schedule_end_id: DataTypes.INTEGER
  });
};
