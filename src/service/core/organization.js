import ApiError from '../../lib/api_error';
import {
	RCode
} from '../../lib/enum';
import m_organization from '../../model/core/organization';
import {
	isNull
} from '../../lib/utils';
import {
	Op
} from 'sequelize';
class OrganizationService {
	constructor() {}

	/**
	 * 创建组织
	 * @param {*} params 
	 */
	async create(params) {
		const {
			organization_name,
			organization_code,
			organization_type,
			parent_id,
			path,
		} = params;
		let is_exist = await m_organization.isExist(organization_name, parent_id);
		if (is_exist) {
			throw new ApiError(RCode.core.C2002000, '组织名称已存在');
		}
		let is_exist_code = await m_organization.isExistCode(organization_code, parent_id);
		if (is_exist_code) {
			throw new ApiError(RCode.core.C2002006, '组织编码已存在');
		}
		if (organization_type == 2 && path == '') {
			throw new ApiError(RCode.core.C2002003, '菜单的路径不能为空');
		}

		if (parent_id != 0) {
			let parent_organization = await m_organization.getDetailsById(parent_id);
			if (!parent_organization) {
				throw new ApiError(RCode.core.C2002001, '上级组织不存在');
			}
			if (parent_organization.organization_type == 1 && (organization_type == 3 || organization_type == 4)) {
				throw new ApiError(RCode.core.C2002002, '组织类型有误,模块类型的下级组织只能模块与菜单');
			}
			if (parent_organization.organization_type == 2 && (organization_type == 2 || organization_type == 1)) {
				throw new ApiError(RCode.core.C2002002, '组织类型有误,菜单类型的下级组织只能权限');
			}
			if (parent_organization.organization_type == 3 && organization_type != 4) {
				throw new ApiError(RCode.core.C2002002, '组织类型有误,权限类型的下级只能是接口');
			}
			if (organization_type == 4 && isNull(path)) {
				throw new ApiError(RCode.core.C2002003, 'Path不能为空');
			}
		} else {
			if (organization_type != 1 && organization_type != 2) {
				throw new ApiError(RCode.core.C2002004, '顶级组织类型只能是模块或菜单');
			}
		}
		return m_organization.create(params);
	}

	/**
	 * 修改组织
	 * @param {*} params 
	 */
	async update(params) {
		const {
			id,
			organization_name,
			organization_code,
			organization_type,
			parent_id,
			icon,
			path,
			sort_no
		} = params;
		let is_exist = await m_organization.isExist(organization_name, parent_id, id);
		if (is_exist) {
			throw new ApiError(RCode.core.C2002000, '组织名称已存在');
		}
		let is_exist_code = await m_organization.isExistCode(organization_code, parent_id, id);
		if (is_exist_code) {
			throw new ApiError(RCode.core.C2002006, '组织编码已存在');
		}
		let organization = {
			id,
			organization_name,
			organization_code,
			organization_type,
			parent_id,
			path,
			icon,
			sort_no
		};
		const role_exist = await m_organization.getDetailsById(id);
		if (!role_exist) {
			throw new ApiError(RCode.common.C1, '组织不存在');
		}
		let result = await m_organization.update(organization);
		return result;
	}

	/**
	 * 删除组织
	 * @param {*} params 
	 */
	async delete(params) {
		const {
			id
		} = params;
		let result = await m_organization.delete(id);
		return result;
	}

	/**
	 * 根据ID获取组织详情信息
	 * @param {*} params 
	 */
	async details(params) {
		const {
			id
		} = params;
		return await m_organization.getDetailsById(id, ['id', 'organization_name', 'organization_code', 'organization_type', 'icon', 'path', 'sort_no', 'parent_id', 'is_visiable']);
	}

	/**
	 * 获取组织列表
	 */
	async getTreeList() {
		let attrs = ['id', 'organization_name', ['id', 'key'],
			['organization_name', 'title'], 'organization_code', 'organization_type', 'parent_id', 'icon', 'path', 'sort_no', 'is_visiable', 'create_time'
		];
		return await m_organization.getTreeList(attrs);
	}

	/**
	 * 获取权限组织
	 */
	async getTreePermissionList() {
		let attrs = [
			['id', 'value'],
			['id', 'key'],
			['organization_name', 'title'], 'id', 'organization_code', 'organization_type', 'parent_id'
		];
		return await m_organization.getTreeList(attrs, {
			organization_type: {
				[Op.ne]: 4,
			},
			organization_code: {
				[Op.or]: {
					[Op.ne]: 'organization',
					[Op.eq]: null
				},
			}
		});
		// return await m_organization.getTreeList(attrs);
	}

	/**
	 * 获取组织下拉列表
	 */
	async getTreeDropList() {
		let attrs = [
			['id', 'value'],
			['id', 'key'],
			['organization_name', 'title'], 'id', 'organization_code', 'organization_type'
		];
		return await m_organization.getTreeList(attrs, {
			organization_type: {
				[Op.ne]: 4
			}
		});
	}

	/**
	 * 判断组织名称是否存在 
	 * @param {string} organization_name 
	 * @param {number} parent_id
	 * @param {number} id
	 */
	async existResource(organization_name, parent_id, id) {
		let user = await m_organization.isExist(organization_name, parent_id, id);
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
	 * 判断组织编码是否存在 
	 * @param {string} organization_code
	 * @param {number} parent_id
	 * @param {number} id
	 */
	async existResourceCode(organization_code, parent_id, id) {
		let user = await m_organization.isExistCode(organization_code, parent_id, id);
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

export default new OrganizationService();