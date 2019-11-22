import sequelize from '../db_init';
import db_common from '../db_common';
const Op = sequelize.Sequelize.Op;
const t_resource = require('../table/cs_resource')(sequelize, sequelize.Sequelize);
const t_resource_user = require('../table/cs_resource_user')(sequelize, sequelize.Sequelize);
const t_resource_role = require('../table/cs_resource_role')(sequelize, sequelize.Sequelize);
class ResourceModel {
	constructor() {}

	/**
	 * 根据资源id获取资源
	 * @param {string} id 
	 * @param {array}  attr
	 */
	async getDetailsById(id, attr = null, ) {
		let option = {};
		if (attr) {
			option.attributes = attr;
		}
		return await t_resource.findByPk(id, option);
	}

	/**
	 * 资源名称是否存在 在同层级内
	 * @param {*} resource_name 
	 * @param {*} parent_id 
	 * @param {*} id 不包含的自己
	 */
	async isExist(resource_name, parent_id, id = null) {
		let where = {
			resource_name: resource_name,
			parent_id: parent_id
		};
		if (id) {
			where.id = {
				[Op.ne]: id
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
	 * @param {*} id 不包含的自己
	 */
	async isExistCode(resource_code, parent_id, id = null) {
		let where = {
			resource_code: resource_code,
			parent_id: parent_id
		};
		if (id) {
			where.id = {
				[Op.ne]: id
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
				id: resource.id
			}
		});
	}

	/**
	 * 删除资源
	 * @param {*} id 
	 */
	async delete(id) {
		let child_list = await db_common.query(' SELECT id FROM cs_resource WHERE FIND_IN_SET(id, fn_getResourceChild(:id)) ', {
			id: id
		});
		console.log(child_list);
		let resource_ids = child_list.map((item) => (item.id));
		let t = await db_common.transaction();
		try {
			await t_resource_user.destroy({
				where: {
					resource_id: {
						[Op.in]: resource_ids
					}
				},
				transaction: t
			});
			await t_resource_role.destroy({
				where: {
					resource_id: {
						[Op.in]: resource_ids
					}
				},
				transaction: t
			});
			await t_resource.destroy({
				where: {
					id: {
						[Op.in]: resource_ids
					}
				},
				transaction: t
			});
			t.commit();
			return true;
		} catch (e) {
			t.rollback();
			return false;
		}
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
			['create_time']
		];
		let root_list = await t_resource.findAll({
			attributes: attrs,
			where: where,
			order: order
		});
		for (let item of root_list) {
			item.dataValues.locale = item.resource_code;
			item.dataValues.children = await this._getChildList(item.id, attrs, _where, order, item.resource_code);
		}
		return root_list;

		// let root_list = await db.query('select * from cs_resource where parent_id=0 ');
		// for (let item of root_list) {
		// 	let child_list = await db.query(' SELECT * FROM cs_resource WHERE FIND_IN_SET(id, fn_getResourceChild(:id)) ', {
		// 		id: item.id
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
			item.dataValues.children = await this._getChildList(item.id, attrs, where, order, item.dataValues.locale);
		}
		return child_list;
	}

	/**
	 * 根据角色与用户获取菜单
	 * @param {Array} role_ids 用户角色ID
	 * @param {Number} user_id 用户ID
	 */
	async getMenuList(role_ids, user_id) {

		let resource_ids = [];
		//获取权限点
		let permission_list = await db_common.query(` select  id  from (select resource_id from cs_resource_role where role_id in (:role_id)  union
		select resource_id from cs_resource_user where user_id=:user_id) a join cs_resource b on a.resource_id=b.id 
		where b.resource_type=3 `, {
			user_id: user_id,
			role_id: role_ids.join(',')
		});
		if (permission_list && permission_list.length > 0) {
			resource_ids = permission_list.map(item => item.id);
		}
        //权限点的上级(菜单)
		let permission_parent_list = await db_common.query(` select  parent_id from (			
			select  id,parent_id  from (select resource_id from cs_resource_role where role_id in (:role_id)  union
					   select resource_id from cs_resource_user where user_id=:user_id) a join cs_resource b on a.resource_id=b.id 
					   where b.resource_type=3 ) d group by d.parent_id`, {
			user_id: user_id,
			role_id: role_ids.join(',')
		});
		if (permission_parent_list && permission_parent_list.length > 0) {
			for (let item of permission_parent_list) {
				//所有上级
				let parent = await db_common.query('select fn_getResourceParent(:id) ids', {
					id: item.parent_id
				});
				resource_ids = resource_ids.concat(parent[0].ids.split(','));
			}
		}
		resource_ids=Array.from(new Set(resource_ids)); //去重
		let list = await t_resource.findAll({
			attributes: ['id', ['resource_name', 'name'], 'parent_id', 'path', 'sort_no', 'icon', 'resource_code','resource_type'],
			where: {
				id: {
					[Op.in]: resource_ids
				}
			}
		});

		let menu_list = [];
		if (list && list.length > 0) {
			menu_list = list.filter(item => item.parent_id == 0).sort((a,b)=>a.sort_no-b.sort_no);
		}
		for (let item of menu_list) {
			item.dataValues.locale = item.resource_code;
			item.dataValues.children = await this._getMenuChild(item.id, list, item.resource_code);
		}
		return menu_list;

	}

	/**
	 * 获取子菜单
	 */
	async _getMenuChild(parent_id, menu_list, parent_code) {
		let child_list = [];
		child_list = menu_list.filter(item => item.parent_id == parent_id).sort((a,b)=>a.sort_no-b.sort_no);
		for (let item of child_list) {
			item.dataValues.locale = parent_code + '.' + item.resource_code;
			item.dataValues.children = await this._getMenuChild(item.id, menu_list, item.resource_code);
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
				if (item.parent_id == father.id) {
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