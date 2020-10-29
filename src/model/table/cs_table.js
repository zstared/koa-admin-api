/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cs_table', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    table_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    table_code: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'cs_table',
    timestamps: false
  });
};
