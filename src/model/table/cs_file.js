/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cs_file', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    table_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    table_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    size: {
      type: 'DOUBLE',
      allowNull: false
    },
    ext: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    folder: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    directory: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    origin: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    path: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    thumb_path: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    is_static: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    is_thumb: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
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
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'cs_file',
    timestamps: false
  });
};
