/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cs_resource_user', {
		user_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true,
			references: {
				model: 'cs_user',
				key: 'user_id',
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
		tableName: 'cs_resource_user',
		timestamps: false
	});
};
