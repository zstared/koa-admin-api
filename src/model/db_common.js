import sequelize from './db_init';
/**
 * @class 数据库操作通用方法
 */
class DbCommon {
	constructor() {}

	/**
	 * sql 原生查询
	 * @param {string} sql 
	 * @param {Object} replacements 
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
	 * @param {*} pageInex 页码
	 * @param {*} pageSize 行数
	 * @param {*} replacements 包含pageInex,pageSize
	 * @param {*} attrs  查询字段 
	 * @param {*} table  查询表
	 * @param {*} where  查询条件
	 * @param {*} group  分组
	 * @param {*} order  排序
	 * @returns {object}
	 */
	async excutePagingProc(replacements, attrs, table, where, order = '', group = '') {
		const {
			pageIndex,
			pageSize
		} = replacements;
		let sql = `call sp_paging(:pageIndex,:pageSize,"${attrs}","${table} ${where}","${order}","${group}");`;
		let option = {
			type: sequelize.db.QueryTypes.SELECT
		};
		if (replacements instanceof Object || replacements instanceof Array) {
			option.replacements = replacements;
		}
		let data = await sequelize.db.query(sql, option);
		let list = [];
		for (let key in data[0]) {
			list.push(data[0][key]);
		}
		let count=data[1][0].count;
		return {
			rows: list,
			count: count,
			pageIndex: pageIndex,
			pageSize: pageSize,
			isPaging:true,
			isMore: count > (pageIndex * pageSize)
		};
	}
}

export default new DbCommon();