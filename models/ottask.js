module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ottask', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    priority: DataTypes.INTEGER,    
    due_date: DataTypes.STRING,
    position: DataTypes.INTEGER,
    completed: DataTypes.BOOLEAN,
    sent: DataTypes.BOOLEAN,    
    completed_date: DataTypes.STRING,
    materials_tools: DataTypes.STRING,
    reworked: DataTypes.BOOLEAN,
    derived_to: DataTypes.INTEGER, // area_id, not ORM associated
    observation: DataTypes.STRING
  });
};
