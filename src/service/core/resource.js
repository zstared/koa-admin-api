import ApiError from '../../lib/api_error';
import {
	RCode
} from '../../lib/enum';
import m_resource from '../../model/core/resource';
import {
	isNull
} from '../../lib/utils';
import {
	Op
} from 'sequelize';
class ResourceService {
	constructor() {}

	/**
	 * 创建资源
	 * @param {*} params 
	 */
	async create(params) {
		const {
			resource_name,
			resource_code,
			resource_type,
			parent_id,
			path,
		} = params;
		let is_exist = await m_resource.isExist(resource_name, parent_id);
		if (is_exist) {
			throw new ApiError(RCode.core.C2002000, '资源名称已存在');
		}
		let is_exist_code = await m_resource.isExistCode(resource_code, parent_id);
		if (is_exist_code) {
			throw new ApiError(RCode.core.C2002006, '资源编码已存在');
		}
		if (resource_type == 2 && path == '') {
			throw new ApiError(RCode.core.C2002003, '菜单的路径不能为空');
		}

		if (parent_id != 0) {
			let parent_resource = await m_resource.getDetailsById(parent_id);
			if (!parent_resource) {
				throw new ApiError(RCode.core.C2002001, '上级资源不存在');
			}
			if (parent_resource.resource_type == 1 && (resource_type == 3 || resource_type == 4)) {
				throw new ApiError(RCode.core.C2002002, '资源类型有误,模块类型的下级资源只能模块与菜单');
			}
			if (parent_resource.resource_type == 2 && (resource_type == 2 || resource_type == 1)) {
				throw new ApiError(RCode.core.C2002002, '资源类型有误,菜单类型的下级资源只能权限');
			}
			if (parent_resource.resource_type == 3 && resource_type != 4) {
				throw new ApiError(RCode.core.C2002002, '资源类型有误,权限类型的下级只能是接口');
			}
			if (resource_type == 4 && isNull(path)) {
				throw new ApiError(RCode.core.C2002003, 'Path不能为空');
			}
		} else {
			if (resource_type != 1 && resource_type != 2) {
				throw new ApiError(RCode.core.C2002004, '顶级资源类型只能是模块或菜单');
			}
		}
		return m_resource.create(params);
	}

	/**
	 * 修改资源
	 * @param {*} params 
	 */
	async update(params) {
		const {
			id,
			resource_name,
			resource_code,
			resource_type,
			parent_id,
			icon,
			path,
			sort_no
		} = params;
		let is_exist = await m_resource.isExist(resource_name, parent_id, id);
		if (is_exist) {
			throw new ApiError(RCode.core.C2002000, '资源名称已存在');
		}
		let is_exist_code = await m_resource.isExistCode(resource_code, parent_id, id);
		if (is_exist_code) {
			throw new ApiError(RCode.core.C2002006, '资源编码已存在');
		}
		let resource = {
			id,
			resource_name,
			resource_code,
			resource_type,
			parent_id,
			path,
			icon,
			sort_no
		};
		const role_exist = await m_resource.getDetailsById(id);
		if (!role_exist) {
			throw new ApiError(RCode.common.C1, '资源不存在');
		}
		let result = await m_resource.update(resource);
		return result;
	}

	/**
	 * 删除资源
	 * @param {*} params 
	 */
	async delete(params) {
		const {
			id
		} = params;
		let result = await m_resource.delete(id);
		return result;
	}

	/**
	 * 根据ID获取资源详情信息
	 * @param {*} params 
	 */
	async details(params) {
		const {
			id
		} = params;
		return await m_resource.getDetailsById(id, ['id', 'resource_name', 'resource_code', 'resource_type', 'icon', 'path', 'sort_no', 'parent_id', 'is_visiable']);
	}

	/**
	 * 获取资源列表
	 */
	async getTreeList() {
		let attrs = ['id', 'resource_name', ['id', 'key'],
			['resource_name', 'title'], 'resource_code', 'resource_type', 'parent_id', 'icon', 'path', 'sort_no', 'is_visiable', 'create_time'
		];
		return await m_resource.getTreeList(attrs);
	}

	/**
	 * 获取权限资源
	 */
	async getTreePermissionList() {
		let attrs = [
			['id', 'value'],
			['id', 'key'],
			['resource_name', 'title'], 'id', 'resource_code', 'resource_type', 'parent_id'
		];
		return await m_resource.getTreeList(attrs, {
			resource_type: {
				[Op.ne]: 4,
			},
			resource_code: {
				[Op.or]: {
					[Op.ne]: 'resource',
					[Op.eq]: null
				},
			}
		});
		// return await m_resource.getTreeList(attrs);
	}

	/**
	 * 获取资源下拉列表
	 */
	async getTreeDropList() {
		let attrs = [
			['id', 'value'],
			['id', 'key'],
			['resource_name', 'title'], 'id', 'resource_code', 'resource_type'
		];
		return await m_resource.getTreeList(attrs, {
			resource_type: {
				[Op.ne]: 4
			}
		});
	}

	/**
	 * 判断资源名称是否存在 
	 * @param {string} resource_name 
	 * @param {number} parent_id
	 * @param {number} id
	 */
	async existResource(resource_name, parent_id, id) {
		let user = await m_resource.isExist(resource_name, parent_id, id);
		if (user) {
			return {
				exist: true
			};
		}
		return {
			exist: false
		};
	}

	/**
	 * 判断资源编码是否存在 
	 * @param {string} resource_code
	 * @param {number} parent_id
	 * @param {number} id
	 */
	async existResourceCode(resource_code, parent_id, id) {
		let user = await m_resource.isExistCode(resource_code, parent_id, id);
		if (user) {
			return {
				exist: true
			};
		}
		return {
			exist: false
		};
	}

}

export default new ResourceService();