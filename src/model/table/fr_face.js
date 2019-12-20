/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fr_face', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    face_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    file_code: {
      type: DataTypes.JSON,
      allowNull: false
    },
    type_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    descriptor: {
      type: DataTypes.JSON,
      allowNull: false
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
    tableName: 'fr_face',
    timestamps: false
  });
};
