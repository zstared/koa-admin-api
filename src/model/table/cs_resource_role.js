/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cs_resource_role', {
		role_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true,
			references: {
				model: 'cs_role',
				key: 'role_id',
				autoIncrement: true
			}
		},
		resource_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true,
			references: {
				model: 'cs_resource',
				key: 'resource_id'
			}
		}
	}, {
		tableName: 'cs_resource_role',
		timestamps: false
	});
};
