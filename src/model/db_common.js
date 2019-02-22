import sequelize from './db_init';
/**
 * @class 数据库操作通用方法
 */
class DbCommon {
	constructor() {}

	/**
	 * sql 原生查询
	 * @param {string} sql语句
	 * @param {Object} replacements 参数对象 
	 */
	async query(sql, replacements = null) {
		let option = {
			type: sequelize.QueryTypes.SELECT
		};
		if (replacements) {
			option.replacements = replacements;
		}
		let list = await sequelize.query(sql, option);
		return list;
	}

	/**
	 * @method 执行分页存储过程 获取分页数据与总记录数
	 * @param {*} params 参数对象 包含pageInex,pageSize
	 * @param {*} attrs  查询字段 
	 * @param {*} table  查询表
	 * @param {*} where  查询条件
	 * @param {*} group  分组
	 * @param {*} order  排序
	 * @returns {object}
	 */
	async excutePagingProc(params, attrs, table, where, group = '',order = '') {
		const {
			page_index,
			page_size
		} = params;
		let sql = `call sp_paging(:page_index,:page_size,"${attrs}","${table} ${where}","${order}","${group}");`;
		let option = {
			type: sequelize.QueryTypes.SELECT
		};
		if (params instanceof Object) {
			option.replacements = params;
		}
		let data = await sequelize.query(sql, option);
		let list = [];
		for (let key in data[0]) {
			list.push(data[0][key]);
		}
		let count = data[1][0].count;
		return {
			rows: list,
			count: count,
			page_index: count > (page_index * page_size)?page_index:1,
			page_size: page_size,
			is_paging: true,
			is_more: count > (page_index * page_size)
		};
	}

	/**
	 * 执行事务
	 * @returns sequelize.Transaction
	 */
	async transaction(){
		return await sequelize.transaction();
	}
}

export default new DbCommon();