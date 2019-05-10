import ApiError from '../../lib/api_error';
import {
	RCode
} from '../../lib/enum';
import m_organization from '../../model/core/organization';
import pinyin from 'pinyin';

class OrganizationService {
	constructor() {}

	/**
	 * 创建组织
	 * @param {*} params 
	 */
	async create(params) {
		const {
			name,
			name_short,
			company_id,
			parent_id,
		} = params;
		let is_exist = await m_organization.isExist(company_id,name, parent_id);
		if (is_exist) {
			throw new ApiError(RCode.core.C2004000, '组织名称已存在');
		}
		let parent_organization = await m_organization.getDetailsById(parent_id);
		if (!parent_organization) {
			throw new ApiError(RCode.core.C2004001, '上级组织不存在');
		}
		params.name_py=pinyin(name,{style:pinyin.STYLE_NORMAL}).map(item=>item[0]).join('');
		if(name_short){
			params.name_short_py=pinyin(name_short,{style:pinyin.STYLE_NORMAL}).map(item=>item[0]).join('');
		}
		return await m_organization.create(params,parent_organization.path);
	}

	/**
	 * 修改组织
	 * @param {*} params 
	 */
	async update(params) {
		const {
			id,
			name,
			name_short,
			company_id,
			parent_id,
			type,
			sort_no,
		} = params;
		let is_exist = await m_organization.isExist(company_id,name, parent_id, id);
		if (is_exist) {
			throw new ApiError(RCode.core.C2004000, '组织名称已存在');
		}
		let organization = {
			id,
			name,
			name_short,
			type,
			parent_id,
			sort_no
		};
		const role_exist = await m_organization.getDetailsById(id);
		if (!role_exist) {
			throw new ApiError(RCode.common.C1, '组织不存在');
		}
		if(role_exist.name!=name){
            params.name_py=pinyin(name,{style:pinyin.STYLE_NORMAL}).map(item=>item[0]).join('');
		}
		if(role_exist.name_short_py!=name_short&&name_short){
			params.name_short_py=pinyin(name_short,{style:pinyin.STYLE_NORMAL}).map(item=>item[0]).join('');
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
		let org=await m_organization.getDetailsById(id);
		console.log(org.type);
		if(org.type==1){return false;}//不能直接删除公司
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
		return await m_organization.getDetailsById(id, ['id', 'name', 'type', 'path', 'sort_no', 'parent_id']);
	}

	/**
	 * 获取组织列表
	 */
	async getTreeList(company_id) {
		let attrs = ['id', 'name', ['id', 'key'],
			['name', 'title'], 'name_short', 'type', 'parent_id',  'path', 'sort_no',  'create_time'
		];
		return await m_organization.getTreeList(attrs,{
			company_id:company_id
		});
	}

	
	/**
	 * 获取组织下拉列表
	 */
	async getTreeDropList(company_id) {
		let attrs = [
			['id', 'value'],
			['id', 'key'],
			['name', 'title'], 'id', 'type'
		];
		return await m_organization.getTreeList(attrs,{company_id:company_id});
	}

	/**
	 * 判断组织名称是否存在 
	 * @param {string} name 
	 * @param {number} parent_id
	 * @param {number} id
	 */
	async existOrganization(company_id,name, parent_id,id) {
		let user = await m_organization.isExist(company_id,name, parent_id, id);
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