import sequelize from '../db_init';
import db_common from '../db_common';
const Op = sequelize.Sequelize.Op;
const t_organization = require('../table/cs_organization')(sequelize, sequelize.Sequelize);
const t_organization_user = require('../table/cs_organization_user')(sequelize, sequelize.Sequelize);
const t_organization_role = require('../table/cs_organization_role')(sequelize, sequelize.Sequelize);
class ResourceModel {
	constructor() {}

	/**
	 * 根据组织id获取组织
	 * @param {string} id 
	 * @param {array}  attr
	 */
	async getDetailsById(id, attr = null, ) {
		let option = {};
		if (attr) {
			option.attributes = attr;
		}
		return await t_organization.findByPk(id, option);
	}

	/**
	 * 组织名称是否存在 在同层级内
	 * @param {*} name 
	 * @param {*} parent_id 
	 * @param {*} id 不包含的自己
	 */
	async isExist(name, parent_id, id = null) {
		let where = {
			name: name,
			parent_id: parent_id
		};
		if (id) {
			where.id = {
				[Op.ne]: id
			};
		}
		return await t_organization.count({
			'where': where
		});
	}

	/**
	 * 新增组织
	 * @param {object} organization
	 */
	async create(organization) {
		return await t_organization.create(organization);
	}

	/**
	 * 修改组织
	 * @param {object} organization
	 */
	async update(organization) {
		return await t_organization.update(organization, {
			where: {
				id: organization.id
			}
		});
	}

	/**
	 * 删除组织
	 * @param {*} id 
	 */
	async delete(id) {
		let child_list = await db_common.query(' SELECT id FROM cs_organization WHERE FIND_IN_SET(id, fn_getOrganizationChild(:id)) ', {
			id: id
		});
		let organization_ids = child_list.map((item) => (item.id));
		let t = await db_common.transaction();
		try {
			await t_organization_user.destroy({
				where: {
					organization_id: {
						[Op.in]: organization_ids
					}
				},
				transaction: t
			});
			await t_organization_role.destroy({
				where: {
					organization_id: {
						[Op.in]: organization_ids
					}
				},
				transaction: t
			});
			await t_organization.destroy({
				where: {
					id: {
						[Op.in]: organization_ids
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
	 * 获取组织树状列表
	 */
	async getTreeList(attrs, _where = {}) {
		let where = Object.assign({
			parent_id: 0
		}, _where);
		let order = [
			['sort_no'],
			['create_time']
		];
		let root_list = await t_organization.findAll({
			attributes: attrs,
			where: where,
			order: order
		});
		for (let item of root_list) {
			item.dataValues.locale = item.organization_code;
			item.dataValues.children = await this._getChildList(item.id, attrs, _where, order, item.organization_code);
		}
		return root_list;

	}

	/**
	 * 获取子节点列表
	 * @param {number} parent_id 
	 * @param {[]} attrs
	 */
	async _getChildList(parent_id, attrs, where, order, parent_code) {
		let child_list = await t_organization.findAll({
			where: Object.assign({
				parent_id: parent_id
			}, where),
			attributes: attrs,
			order: order
		});
		for (let item of child_list) {
			item.dataValues.locale = parent_code + '.' + item.organization_code;
			item.dataValues.children = await this._getChildList(item.id, attrs, where, order, item.dataValues.locale);
		}
		return child_list;
	}


}
export default new ResourceModel();