import sequelize from '../db_init';
import db_common from '../db_common';
const t_user = require('../table/cs_user')(sequelize, sequelize.Sequelize);

class UserModel {
	constructor() {}


	/**
	 * 根据用户id获取用户
	 * @param {string} user_id 
	 * @param {string} password 
	 * @param {array}  attr
	 */
	async getDetailsById(user_id, attr = null) {
		let option = {};
		if (attr) {
			option.attributes = attr;
		}
		return t_user.findById(user_id, option);
	}

	/**
	 * 根据用户名与密码获取用户
	 * @param {string} user_name 
	 * @param {string} password 
	 */
	async getUserByName(user_name, password = '') {
		let where = {
			user_name: user_name
		};
		if (password) {
			where.password = password;
		}
		return await t_user.findOne({
			where: where
		});
	}

	/**修改用户密码 */
	async updatePassword(user_id, password, encrypt) {
		return await t_user.update({
			password: password,
			encrypt: encrypt
		}, {
			where: {
				user_id
			}
		});
	}

	/**
	 * 新增用户
	 * @param {object} user 
	 */
	async create(user) {
		return await t_user.create(user);
	}
	/**
	 * 修改用户
	 * @param {*} user 
	 */
	async update(user) {
		return await t_user.update(user, {
			where: {
				user_id: user.user_id
			}
		});
	}

	/**
	 * 删除用户(只能删除非内置账号)
	 * @param {*} user_id 
	 */
	async delete(user_id) {
		return await t_user.destroy({
			where: {
				user_id: user_id,
				is_system: 0
			}
		});
	}

	/**
	 * 获取用户列表
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
		return await t_user.findAll(option);
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

}

export default new UserModel();