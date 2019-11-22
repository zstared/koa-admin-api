/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fr_album', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    album_name: {
      type: DataTypes.STRING(100),
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
    tableName: 'fr_album',
    timestamps: false
  });
};
