import sequelize from '../db_init';
import db_common from '../db_common';
const Op = sequelize.Sequelize.Op;
const t_face_type = require('../table/fr_face_type')(sequelize, sequelize.Sequelize);
class FaceTypeModel {
    constructor() {}

    /**
     * 根据用户id获取人脸库类型
     * @param {string} id 
     * @param {array}  attr
     */
    async getDetailsById(id, attr = null) {
        let option = {};
        if (attr) {
            option.attributes = attr;
        }
        return await t_face_type.findByPk(id, option);
    }

    /**
     * 人脸库名称是否存在
     * @param {*} type_name 
     * @param {*} id 不包含的id
     */
    async isExist(type_name, id) {
        let where = {
            type_name: type_name,
        };
        if (id) {
            where.id = {
                [Op.ne]: id
            };
        }
        return await t_face_type.count({
            'where': where
        });
    }

    /**
     * 新增人脸库
     * @param {object} face_type
     */
    async create(face_type) {
        return await t_face_type.create(face_type);
    }

    /**
     * 修改人脸库
     * @param {object} face_type
     */
    async update(face_type) {
        return await t_face_type.update(face_type, {
            where: {
                id: face_type.id
            }
        });
    }

    /**
     * 删除人脸库
     * @param {*} id 
     */
    async delete(id) {
        return await t_face_type.destroy({
            where: {
                id: id
            },
        });

    }

    /**
     * 获取人脸库列表
     * @param {array} attrs  查询字段
     * @param {object} where  查询条件
     * @param {array} order   排序
     */
    async getList(attrs, where, order) {
        let option = {};
        if (where) {
            option.where = where;
        }
        if (order) {
            option.order = order;
        }
        if (attrs) {
            option.attributes = attrs;
        }
        return await t_face_type.findAll(option);
    }

    /**
     * @method 获取分页数据与总记录数
     * @param {*} params 参数对象 包含pageInex,pageSize
     * @param {*} attrs  查询字段 
     * @param {*} table  查询表
     * @param {*} where  查询条件
     * @param {*} group  分组
     * @param {*} order  排序
     * @returns {object}
     */
    async getPageList(params, attrs, table, where, order = '', group = '') {
        return await db_common.excutePagingProc(params, attrs, table, where, group, order);
    }

    /**
     * 执行sql语句
     * @param {*}} sql 
     * @param {*} params 
     */
    async query(sql, params = null) {
        return await db_common.query(sql, params);
    }

}
export default new FaceTypeModel();