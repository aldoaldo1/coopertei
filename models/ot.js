// An O/T is related to a Client

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ot', {
    number: DataTypes.INTEGER,
    client_number: DataTypes.INTEGER,
    delivery: DataTypes.DATE,
    workshop_suggestion: DataTypes.TEXT,
    client_suggestion: DataTypes.TEXT,
    reworked_number: DataTypes.INTEGER,
    notify_client: DataTypes.BOOLEAN,
    showtimeline: DataTypes.BOOLEAN,
    conclusion_motive: DataTypes.INTEGER,
    conclusion_observation: DataTypes.TEXT
  });
};
