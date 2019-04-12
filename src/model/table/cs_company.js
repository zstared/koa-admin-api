/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cs_company', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    emp_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    name_short: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    summary: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    logo_url: {
      type: DataTypes.STRING(4000),
      allowNull: true
    },
    app_start_img: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    register_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
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
    tableName: 'cs_company',
    timestamps: false
  });
};
