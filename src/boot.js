import RedisClient from './lib/redis';
import db_common from './model/db_common';
const redis = new RedisClient({
	db: 2
});


/**
 * 程序启动前初始化
 */
class Boot {
	async init() {
		await this.initRolePermission();
		await this.initUserPermission();
	}

	/**
     * 初始角色权限 存入redis
     */
	async initRolePermission() {
		let list_role = await db_common.query(' SELECT id FROM cs_role ');
		for (let role of list_role) {
			let permissions = await db_common.query('SELECT b.path from cs_resource_role a join cs_resource b on a.resource_id=b.id  where role_id=:role_id and resource_type=3 ', {
				role_id: role.id
			});
			permissions = permissions.map(item => item.path);
			redis.setSerializable('permission_role_' + role.id, permissions);
		}
	}

	/**
     * 初始用户权限 存入redis
     */
	async initUserPermission() {
		let list_user = await db_common.query(' select user_id from cs_resource_user a join cs_user b on a.user_id=b.id where b.status!=2  group by user_id ');
		for (let user of list_user) {
			let permissions = await db_common.query('SELECT b.path from cs_resource_user a join cs_resource b on a.resource_id=b.id  where user_id=:user_id and resource_type=3 ', {
				user_id: user.user_id
			});
			permissions = permissions.map(item => item.path);
			redis.setSerializable('permission_user_' + user.user_id, permissions);
		}
	}
}
export default new Boot();