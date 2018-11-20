import sequelize from '../db_init';
const Op=sequelize.Op;
const t_role = require('../table/cs_role')(sequelize, sequelize.Sequelize);
class RoleModel {
	constructor() {}

	/**
     * 根据用户id获取角色
     * @param {string} role_id 
     * @param {array}  attr
     */
	async getRoleById(role_id, attr = null, ) {
		let option = {};
		if (attr) {
			option.attributes = attr;
		}
		return t_role.findById(role_id, option);
	}
    
	/**
     * 角色名称是否存在
     * @param {*} role_name 
     * @param {*} role_id 不包含的role_id
     */
	async isExist(role_name,role_id){
		let where={
			role_name:role_name,
		};
		if(role_id){
			where.role_id={
				[Op.ne]:role_id
			};
		}
		return t_role.count({'where':where});
	}

	/**
     * 新增角色
     * @param {object} role
     */
	async create(role) {
		return t_role.create(role);
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
		return t_role.destroy({
			where: {
				role_id: role_id,
				is_system:0
			}
		});
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
}
export default new RoleModel();