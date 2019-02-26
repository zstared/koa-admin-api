import ApiError from '../../lib/api_error';
import {
	RCode
} from '../../lib/enum';
import m_role from '../../model/core/role';
import {
	isNull
} from '../../lib/utils';
import {
	Op
} from 'sequelize';
class RoleService {
	constructor() {}

	/**
	 * 创建角色
	 * @param {*} params 
	 */
	async create(params) {
		const {
			role_name,
			role_desc,
			sort_no
		} = params;
		let is_exist = await m_role.isExist(role_name);
		if (is_exist) {
			throw new ApiError(RCode.core.C2001000, '角色名称已存在');
		}
		let role = {
			role_name,
			role_desc,
			sort_no
		};
		return m_role.create(role);
	}

	/**
	 * 修改角色
	 * @param {*} params 
	 */
	async update(params) {
		const {
			role_id,
			role_name,
			role_desc,
			sort_no
		} = params;
		let is_exist = await m_role.isExist(role_name, role_id);
		if (is_exist) {
			throw new ApiError(RCode.core.C2010000, '角色名称已存在');
		}
		let role = {
			role_id: role_id,
			role_name: role_name,
			role_desc: role_desc,
			sort_no: sort_no
		};
		const role_exist = await m_role.getDetailsById(role_id);
		if (!role_exist) {
			throw new ApiError(RCode.common.C1, '角色不存在,操作失败');
		}
		let result = await m_role.update(role);
		return result[0];
	}

	/**
	 * 删除角色
	 * @param {*} params 
	 */
	async delete(params) {
		const {
			role_id
		} = params;
		let result = await m_role.delete(role_id);
		return result;
	}

	/**
	 * 根据ID获取角色详情信息
	 * @param {*} params 
	 */
	async details(params) {
		const {
			role_id
		} = params;
		return await m_role.getDetailsById(role_id, ['role_id', 'role_name', 'role_desc']);
	}

	/**
	 * 获取角色列表
	 * @param {*} params 
	 */
	async getList(params) {
		const {
			role_name,
			sorter
		} = params;
		let where = {
			role_id: {
				[Op.ne]: 1
			}
		};
		if (!isNull(role_name)) {
			where.role_name = {
				[Op.like]: role_name + '%'
			};
		}
		let order = [
			['is_system', 'desc'],
			['create_time']
		]; //排序
		if (sorter) {
			order.unshift(sorter.split('|'));
		}
		let attr = ['role_id', 'role_name', 'role_desc', 'sort_no', 'is_system', 'create_time'];
		return await m_role.getList(attr, where, order);
	}

	/**
	 * 获取角色分页列表
	 * @param {*} _params 
	 */
	async getPageList(_params) {
		let {
			page_index,
			page_size,
			role_name,
			sorter,
		} = _params;

		let attrs = ' role_id,role_name,role_desc,sort_no,is_system,create_time ';
		let table = ' cs_role ';
		let where = ' where 1=1 ';
		if (!isNull(role_name)) {
			role_name = role_name + '%';
			where += ' and role_name like  :role_name ';
		}
		let order = ' order by is_system desc,create_time ';
		if (!isNull(sorter)) {
			order = `order by ${sorter.split('|').join(' ')} `;
		}
		let params = {
			page_index,
			page_size,
			role_name
		};
		return await m_role.getPageList(params, attrs, table, where, order);
	}

	/**
	 * 关联资源（菜单、权限、接口)
	 * @param {*} resource_role
	 */
	async relateResource(resource_role) {
		const {
			role_id,
			resource_list
		} = resource_role;
		let list = [];
		for (let resource_id of resource_list) {
			list.push({
				role_id: role_id,
				resource_id: resource_id
			});
		}
		return await m_role.relateResource(role_id, list);
	}
}

export default new RoleService();