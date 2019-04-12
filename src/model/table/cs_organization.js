/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cs_organization', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    company_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'cs_company',
        key: 'id'
      }
    },
    path: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    parent_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '3'
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    name_py: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    name_short: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    name_short_py: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    leader: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sort_no: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1'
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
    tableName: 'cs_organization',
    timestamps: false
  });
};
