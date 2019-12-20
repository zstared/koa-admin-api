/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fr_face_type', {
    id: {
      type: DataTypes.INTEGER(255).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    type_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cover_code: {
      type: DataTypes.CHAR(36),
      allowNull: true
    },
    is_system: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'fr_face_type',
    timestamps: false
  });
};
