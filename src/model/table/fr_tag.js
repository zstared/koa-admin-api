/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fr_tag', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tag_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: '#FFFFFF'
    },
    bg_color: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    create_user: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    update_user: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'fr_tag',
    timestamps: false
  });
};
