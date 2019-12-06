/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cs_param', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    param_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    param_value: {
      type: DataTypes.JSON,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '1'
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'cs_param',
    timestamps: false
  });
};
