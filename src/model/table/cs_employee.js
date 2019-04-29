/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cs_employee', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    company_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    name_py: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    name_en: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    sex: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    mobile_prefix: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    mobile: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    person_email: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    id_photo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    id_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    id_address: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    current_address: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    passport_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nation: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    native_place: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    political_status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    qq: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    wechat: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    educational: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    graduate: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    start_work_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    emergency_contact: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    emergency_contact_mobile: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(4),
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
    tableName: 'cs_employee',
    timestamps: false
  });
};
