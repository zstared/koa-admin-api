/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('cs_log', {
		log_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		system: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		module: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		action: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		path: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		params: {
			type: DataTypes.JSON,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: '1'
		},
		error_code: {
			type: DataTypes.STRING(10),
			allowNull: true
		},
		message: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		description: {
			type: DataTypes.STRING(500),
			allowNull: true
		},
		option_user: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		option_ip: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		option_time: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {
		tableName: 'cs_log',
		timestamps: false
	});
};