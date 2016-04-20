module.exports = function(sequelize, DataTypes) {
  return sequelize.define('news', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    related_model: DataTypes.STRING,
    related_model_id: DataTypes.INTEGER
  });
};
