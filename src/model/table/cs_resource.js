/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cs_resource', {
		resource_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		resource_name: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		resource_code: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		resource_type: {
			type: DataTypes.INTEGER(3).UNSIGNED,
			allowNull: false
		},
		permission_type: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		permission_custom: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		icon: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		path: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		parent_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			defaultValue: '0'
		},
		sort_no: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true,
			defaultValue: '1'
		},
		is_visiable: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			defaultValue: '1'
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
		tableName: 'cs_resource',
		timestamps: false
	});
};
