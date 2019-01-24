import sequelize from '../db_init';
import db_common from '../db_common';
const Op = sequelize.Op;
const t_role = require('../table/cs_role')(sequelize, sequelize.Sequelize);
const t_resource_role = require('../table/cs_resource_role')(sequelize, sequelize.Sequelize);
class RoleModel {
	constructor() {}

	/**
	 * 根据用户id获取角色
	 * @param {string} role_id 
	 * @param {array}  attr
	 */
	async getDetailsById(role_id, attr = null) {
		let option = {};
		if (attr) {
			option.attributes = attr;
		}
		return await  t_role.findById(role_id, option);
	}

	/**
	 * 角色名称是否存在
	 * @param {*} role_name 
	 * @param {*} role_id 不包含的role_id
	 */
	async isExist(role_name, role_id) {
		let where = {
			role_name: role_name,
		};
		if (role_id) {
			where.role_id = {
				[Op.ne]: role_id
			};
		}
		return await  t_role.count({
			'where': where
		});
	}

	/**
	 * 新增角色
	 * @param {object} role
	 */
	async create(role) {
		return await t_role.create(role);
	}

	/**
	 * 修改角色
	 * @param {object} role
	 */
	async update(role) {
		return t_role.update(role, {
			where: {
				role_id: role.role_id
			}
		});
	}

	/**
	 * 删除角色
	 * @param {*} role_id 
	 */
	async delete(role_id) {
		const t = await db_common.transaction();
		try {
			await t_resource_role.destroy({
				where: {
					role_id: role_id
				},
				transaction: t
			});

			await t_role.destroy({
				where: {
					role_id: role_id,
					is_system: 0
				},
				transaction: t
			});
			await t.commit();
			return true;

		} catch (e) {
			await t.rollback();
			throw e;
		}
	}

	/**
	 * 获取角色列表
	 * @param {array} attrs  查询字段
	 * @param {object} where  查询条件
	 * @param {array} order   排序
	 */
	async getList(attrs, where, order) {
		let option = {
			where: where
		};
		if (order) {
			option.order = order;
		}
		if (attrs) {
			option.attributes = attrs;
		}
		return await t_role.findAll(option);
	}

	/**
	 * @method 获取分页数据与总记录数
	 * @param {*} params 参数对象 包含pageInex,pageSize
	 * @param {*} attrs  查询字段 
	 * @param {*} table  查询表
	 * @param {*} where  查询条件
	 * @param {*} group  分组
	 * @param {*} order  排序
	 * @returns {object}
	 */
	async getPageList(params, attrs, table, where, order = '', group = '') {
		return db_common.excutePagingProc(params, attrs, table, where, group, order);
	}

	/**
	 * 关联资源（菜单、权限、接口)
	 * @param {*} role_id 
	 * @param {*} list 
	 */
	async relateResource(role_id, list) {
		let t = await db_common.transaction();
		try {
			await t_resource_role.destroy({
				where: {
					role_id: role_id
				}
			});
			await t_resource_role.bulkCreate(list);
			await t.commit();
			return true;
		} catch (e) {
			await t.rollback();
			throw e;
		}
	}
}
export default new RoleModel();