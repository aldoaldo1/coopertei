module.exports = function(sequelize, DataTypes) {
  return sequelize.define('authorization', {
    req_info_sent_date: DataTypes.STRING
  });
};
