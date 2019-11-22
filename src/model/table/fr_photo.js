/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fr_photo', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    file_code: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    photo_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    album_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    tag_ids: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    expression: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    photo_time: {
      type: DataTypes.DATE,
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
    tableName: 'fr_photo',
    timestamps: false
  });
};
