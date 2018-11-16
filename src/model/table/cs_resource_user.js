/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cs_resource_user', {
		user_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true
		},
		resource_id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true
		}
	}, {
		tableName: 'cs_resource_user',
		timestamps: false
	});
};
