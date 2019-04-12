/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cs_user_role', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      references: {
        model: 'cs_user',
        key: 'id'
      }
    },
    role_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      references: {
        model: 'cs_role',
        key: 'id'
      }
    }
  }, {
    tableName: 'cs_user_role',
    timestamps: false
  });
};
