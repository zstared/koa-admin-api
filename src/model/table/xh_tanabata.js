/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('xh_tanabata', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tag: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    photo_code: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    sort_no: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'xh_tanabata',
    timestamps: false
  });
};
