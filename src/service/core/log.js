import m_log from '../../model/core/log';
import {
	isNull
} from '../../lib/utils';
class LogService {
	constructor() {}

	/**
     * 创建日志
     * @param {*} params 
     */
	async create(params) {
		return await  m_log.create(params);
	}

	/**
     * 根据ID获取日志详情信息
     * @param {*} params 
     */
	async details(params) {
		const {
			id
		} = params;
		return await m_log.getDetailsById(id);
	}

	/**
     * 获取日志分页列表
     * @param {*} _params 
     */
	async getPageList(_params) {
		let {
			page_index,
			page_size,
			system,
			module,
			action,
			option_user,
			sorter,
		} = _params;

		let attrs = ' id,system,module,action,url,status,params,msg,option_user,option_ip ';
		let table = ' cs_log ';
		let where = ' where 1=1 ';
		if (!isNull(system)) {
			where += ' and system=:system ';
		}
		if (!isNull(module)) {
			where += ' and module=:module ';
		}
		if (!isNull(action)) {
			action = action + '%';
			where += ' and action like  :action ';
		}
		if (!isNull(option_user)) {
			option_user = option_user + '%';
			where += ' and option_user like  :option_user ';
		}
		let order = ' order by  option_time desc ';
		if (!isNull(sorter)) {
			order = `order by ${sorter.split('|').join(' ')} `;
		}
		let params = {
			page_index,
			page_size,
			action,
			module,
			option_user,
		};
		return await m_log.getPageList(params, attrs, table, where, order);
	}
}

export default new LogService();