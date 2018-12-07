import ApiError from '../../lib/api_error';
import {
	RCode
} from '../../lib/enum';
import m_resource from '../../model/core/resource';
import {
	isNull
} from '../../lib/utils';
class ResourceService {
	constructor() {}

	/**
     * 创建资源
     * @param {*} params 
     */
	async create(params) {
		const {
			resource_name,
			resource_type,
			parent_id,
			path,
			sort_no
		} = params;
		let is_exist = await m_resource.isExist(resource_name, parent_id);
		if (is_exist) {
			throw new ApiError(RCode.core.C2002000, '资源名称已存在');
		}
		if (parent_id != 0) {
			let parent_resource = await m_resource.getDetailsById(parent_id);
			if (!parent_resource) {
				throw new ApiError(RCode.core.C2002001, '上级资源不存在');
			}
			if (parent_resource.resource_type == 1 && resource_type == 3) {
				throw new ApiError(RCode.core.C2002002, '资源类型有误,菜单类型的下级资源只能是菜单或权限');
			}
			if (parent_resource.resource_type == 2 && (resource_type == 1 || resource_type == 2)) {
				throw new ApiError(RCode.core.C2002002, '资源类型有误,权限类型的下级资源只能是接口');
			}
			if (parent_resource.resource_type == 3) {
				throw new ApiError(RCode.core.C2002002, '资源类型有误,接口类型的没有下级资源');
			}
			if (resource_type == 3 && isNull(path)) {
				throw new ApiError(RCode.core.C2002003, '接口类型Path不能为空');
			}
		} else {
			if (resource_type != 1) {
				throw new ApiError(RCode.core.C2002004, '顶级资源类型只能是菜单类型');
			}
		}
		let resource = {
			resource_name,
			resource_type,
			parent_id,
			path,
			sort_no
		};
		return m_resource.create(resource);
	}

	/**
     * 修改资源
     * @param {*} params 
     */
	async update(params) {
		const {
			resource_id,
			resource_name,
			resource_type,
			parent_id,
			path,
			sort_no
		} = params;
		let is_exist = await m_resource.isExist(resource_name, parent_id, resource_id);
		if (is_exist) {
			throw new ApiError(RCode.core.C2002000, '资源名称已存在');
		}
		let role = {
			resource_id,
			resource_name,
			resource_type,
			parent_id,
			path,
			sort_no
		};
		const role_exist = await m_resource.getDetailsById(resource_id);
		if (!role_exist) {
			throw new ApiError(RCode.common.C1, '资源不存在');
		}
		let result = await m_resource.update(role);
		return result[0];
	}

	/**
     * 删除资源
     * @param {*} params 
     */
	async delete(params) {
		const {
			resource_id
		} = params;
		let result = await m_resource.delete(resource_id);
		return result;
	}

	/**
     * 根据ID获取资源详情信息
     * @param {*} params 
     */
	async details(params) {
		const {
			resource_id
		} = params;
		return await m_resource.getDetailsById(resource_id, ['resource_id', 'resource_name', 'resource_type', 'path', 'sort_no', 'parent_id']);
	}

	/**
     * 获取资源列表
     */
	async getTreeList() {
		let attrs = ['resource_id', 'resource_name', 'resource_type', 'parent_id', 'path', 'sort_no'];
		return await m_resource.getTreeList(attrs);
	}

}

export default new ResourceService();