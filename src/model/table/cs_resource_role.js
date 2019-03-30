/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cs_resource_role', {
		id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		role_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true,
			references: {
				model: 'cs_role',
				key: 'id'
			}
		},
		resource_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true,
			references: {
				model: 'cs_resource',
				key: 'id'
			}
		}
	}, {
		tableName: 'cs_resource_role',
		timestamps: false
	});
};
