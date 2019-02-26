/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('cs_user', {
		user_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		user_name: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		password_strength: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			defaultValue: '1'
		},
		name_cn: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		name_en: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		avatar: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		encrypt: {
			type: DataTypes.CHAR(16),
			allowNull: false
		},
		sex: {
			type: DataTypes.INTEGER(3).UNSIGNED,
			allowNull: true,
			defaultValue: '1'
		},
		mobile: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		mail: {
			type: DataTypes.STRING(60),
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER(3).UNSIGNED,
			allowNull: true,
			defaultValue: '0'
		},
		is_system: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: '0'
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
		tableName: 'cs_user',
		timestamps: false
	});
};