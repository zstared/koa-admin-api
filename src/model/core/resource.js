import sequelize from '../db_init';
import db from '../db_common';
import db_common from '../db_common';
const Op = sequelize.Op;
const t_resource = require('../table/cs_resource')(sequelize, sequelize.Sequelize);
class ResourceModel {
	constructor() {}

	/**
	 * 根据资源id获取资源
	 * @param {string} resource_id 
	 * @param {array}  attr
	 */
	async getDetailsById(resource_id, attr = null, ) {
		let option = {};
		if (attr) {
			option.attributes = attr;
		}
		return await t_resource.findById(resource_id, option);
	}

	/**
	 * 资源名称是否存在 在同层级内
	 * @param {*} resource_name 
	 * @param {*} parent_id 
	 * @param {*} resource_id 不包含的自己
	 */
	async isExist(resource_name, parent_id, resource_id = null) {
		let where = {
			resource_name: resource_name,
			parent_id: parent_id
		};
		if (resource_id) {
			where.resource_id = {
				[Op.ne]: resource_id
			};
		}
		return await t_resource.count({
			'where': where
		});
	}

	/**
	 * 资源编码是否存在 在同层级内
	 * @param {*} resource_code
	 * @param {*} parent_id 
	 * @param {*} resource_id 不包含的自己
	 */
	async isExistCode(resource_code, parent_id, resource_id = null) {
		let where = {
			resource_code: resource_code,
			parent_id: parent_id
		};
		if (resource_id) {
			where.resource_id = {
				[Op.ne]: resource_id
			};
		}
		return await t_resource.count({
			'where': where
		});
	}

	/**
	 * 新增资源
	 * @param {object} resource
	 */
	async create(resource) {
		return await t_resource.create(resource);
	}

	/**
	 * 修改资源
	 * @param {object} resource
	 */
	async update(resource) {
		return await t_resource.update(resource, {
			where: {
				resource_id: resource.resource_id
			}
		});
	}

	/**
	 * 删除资源
	 * @param {*} resource_id 
	 */
	async delete(resource_id) {
		let child_list = await db.query(' SELECT resource_id FROM cs_resource WHERE FIND_IN_SET(resource_id, fn_getResourceChild(:resource_id)) ', {
			resource_id: resource_id
		});
		let resource_ids = child_list.map((item) => (item.resource_id));
		return await t_resource.destroy({
			where: {
				resource_id: {
					[Op.in]: resource_ids
				}
			}
		});
	}

	/**
	 * 获取资源树状列表
	 */
	async getTreeList(attrs, _where = {}) {
		let where = Object.assign({
			parent_id: 0
		}, _where);
		let order = [
			['sort_no'],
			['permission_type'],
			['create_time']
		];
		let root_list = await t_resource.findAll({
			attributes: attrs,
			where: where,
			order: order
		});
		for (let item of root_list) {
			item.dataValues.locale = item.resource_code;
			item.dataValues.children = await this._getChildList(item.resource_id, attrs, _where, order, item.resource_code);
		}
		return root_list;

		// let root_list = await db.query('select * from cs_resource where parent_id=0 ');
		// for (let item of root_list) {
		// 	let child_list = await db.query(' SELECT * FROM cs_resource WHERE FIND_IN_SET(resource_id, fn_getResourceChild(:resource_id)) ', {
		// 		resource_id: item.resource_id
		// 	});
		// 	item.children = this.filterChild(item, child_list);
		// }
		// return root_list;
	}

	/**
	 * 获取子节点列表
	 * @param {number} parent_id 
	 * @param {[]} attrs
	 */
	async _getChildList(parent_id, attrs, where, order, parent_code) {
		let child_list = await t_resource.findAll({
			where: Object.assign({
				parent_id: parent_id
			}, where),
			attributes: attrs,
			order: order
		});
		for (let item of child_list) {
			item.dataValues.locale = parent_code + '.' + item.resource_code;
			item.dataValues.children = await this._getChildList(item.resource_id, attrs, where, order, item.dataValues.locale);
		}
		return child_list;
	}

	/**
	 * 根据角色与用户获取菜单
	 * @param {Array} role_ids 用户角色ID
	 * @param {Number} user_id 用户ID
	 */
	async getMenuList(role_ids, user_id) {
		let list = await db_common.query(` select  b.resource_name name,b.resource_id,b.path,b.icon,b.resource_code,b.parent_id,b.sort_no  from (select resource_id from cs_resource_role where role_id in (:role_id)  union
			select resource_id from cs_resource_user where user_id=:user_id) a join cs_resource b on a.resource_id=b.resource_id 
			where resource_type!=3
			`, {
			user_id: user_id,
			role_id: role_ids.join(',')
		});

		let menu_list = [];
		if (list && list.length > 0) {
			menu_list = list.filter(item => item.parent_id == 0);
		}
		for (let item of menu_list) {
			item.locale = item.resource_code;
			item.children = await this._getMenuChild(item.resource_id, list, item.resource_code);
		}
		return menu_list;
	}

	/**
	 * 获取子菜单
	 */
	async _getMenuChild(parent_id, menu_list, parent_code) {
		let child_list = [];
		child_list = menu_list.filter(item => item.parent_id == parent_id);
		for (let item of child_list) {
			item.locale = parent_code + '.' + item.resource_code;
			item.children = await this._getMenuChild(item.resource_id, menu_list, item.resource_code);
		}
		return child_list;
	}

	/**
	 * 过滤树形结构
	 * @param {*} father 
	 * @param {*} child_list 
	 */
	filterChild(father, child_list) {
		if (child_list && child_list.length > 0) {
			let list_index = [];
			let child_list_first = child_list.filter((item, index) => {
				if (item.parent_id == father.resource_id) {
					list_index.push(index);
					return item;
				}
			});
			for (let index of list_index) { //剔除掉已匹配的子菜单
				child_list.splice(index);
			}
			for (let child of child_list_first) {
				this.filterChild(child, child_list, child.locale);
			}
			father.children = child_list_first;
			return father.children;
		} else {
			return [];
		}
	}



}
export default new ResourceModel();