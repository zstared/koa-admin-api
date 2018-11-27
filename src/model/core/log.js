import sequelize from '../db_init';
import db_common from '../db_common';
const t_log = require('../table/cs_log')(sequelize, sequelize.Sequelize);
class LogModel {
	constructor() {}

	/**
     * 根据用户id获取日志
     * @param {string} log_id 
     * @param {array}  attr
     */
	async getDetailsById(log_id, attr = null) {
		let option = {};
		if (attr) {
			option.attributes = attr;
		}
		return t_log.findById(log_id, option);
	}

	/**
     * 新增日志
     * @param {object} role
     */
	async create(role) {
		return t_log.create(role);
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
export default new LogModel();