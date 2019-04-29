/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cs_job', {
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
    org_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    emp_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    pos_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    role_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    job_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    entry_time: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    become_time: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    act_become_time: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    dimission_time: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    internship_start_time: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    internship_end_time: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    transfer_time: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    retire_time: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(255),
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
    tableName: 'cs_job',
    timestamps: false
  });
};
