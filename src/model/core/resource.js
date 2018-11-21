import sequelize from '../db_init';
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
		return t_resource.findById(resource_id, option);
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
		return t_resource.count({
			'where': where
		});
	}

	/**
     * 新增资源
     * @param {object} resource
     */
	async create(resource) {
		return t_resource.create(resource);
	}

	/**
     * 修改资源
     * @param {object} resource
     */
	async update(resource) {
		return t_resource.update(resource, {
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
		return t_resource.destroy({
			where: {
				resource_id: resource_id
			}
		});
	}

	/**
     * 获取资源树状列表
     */
	async getTreeList(attrs) {
		// let where = {
		// 	parent_id: 0
		// };
		// let order=[['sort_no','create_time']];
		// let root_list = await t_resource.findAll({
		// 	attributes: attrs,
		// 	where: where,
		// 	order:order
		// });
		// console.log(root_list);
		// for (let item of root_list) {
		// 	item.dataValues.children = await this._getChildList(item.resource_id, attrs,order);
		// }
		let root_list = await sequelize.query('select * from cs_resource where parent_id=0 ');
		console.log(root_list);
		for (let item of root_list) {
			let child_list = await sequelize.query(' SELECT * FROM cs_resource WHERE FIND_IN_SET(resource_id, fn_getResourceChild(:resource_id)) ', {
				replacements: {
					resource_id: item.resource_id
				},
				type: sequelize.QueryTypes.SELECT
			});
			item.children = this.filterChild(item, child_list);
		}
		return root_list;
	}

	filterChild(father, child_list) {
		if (child_list && child_list.length > 0) {
			let child_list_first = child_list.filter((item) => {
				return item.parent_id == father.id;
			});
			for (let child of child_list_first) {
				this.filterChild(child, child_list);
			}
			father.children = child_list_first;
		} else {
			father.children = [];
			return father;
		}
	}

	/**
     * 获取子节点列表
     * @param {number} parent_id 
     * @param {[]} attrs
     */
	async _getChildList(parent_id, attrs, order) {
		let child_list = await t_resource.findAll({
			where: {
				parent_id: parent_id
			},
			attributes: attrs,
			order: order
		});
		for (let item of child_list) {
			item.dataValues.children = await this._getChildList(item.resource_id, attrs, order);
		}
		return child_list;
	}
}
export default new ResourceModel();