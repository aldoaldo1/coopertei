module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clientnotification', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    related_model: DataTypes.STRING,
    related_model_id: DataTypes.INTEGER,
    ot_number: DataTypes.INTEGER
  });
};
