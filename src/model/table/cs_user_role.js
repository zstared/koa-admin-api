/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cs_user_role', {
		user_id: {
			type: DataTypes.INTEGER(11).UNSIGNED,
			allowNull: true,
			references: {
				model: 'cs_user',
				key: 'user_id'
			}
		},
		role_id: {
			type: DataTypes.INTEGER(11).UNSIGNED,
			allowNull: true,
			references: {
				model: 'cs_role',
				key: 'role_id'
			}
		}
	}, {
		tableName: 'cs_user_role',
		timestamps: false
	});
};
