import sequelize from '../db_init';
import db_common from '../db_common';
const Op = sequelize.Sequelize.Op;
const t_face = require('../table/fr_face')(sequelize, sequelize.Sequelize);
class FaceModel {
    constructor() {}

    /**
     * 根据用户id获取人脸
     * @param {string} id 
     * @param {array}  attr
     */
    async getDetailsById(id, attr = null) {
        let option = {};
        if (attr) {
            option.attributes = attr;
        }
        return await t_face.findByPk(id, option);
    }

    /**
     * 人脸名称是否存在
     * @param {*} face_name 
     * @param {*} id 不包含的id
     */
    async isExist(face_name, id) {
        let where = {
            face_name: face_name,
        };
        if (id) {
            where.id = {
                [Op.ne]: id
            };
        }
        return await t_face.count({
            'where': where
        });
    }

    /**
     * 新增人脸
     * @param {object} face
     */
    async create(face) {
        return await t_face.create(face);
    }

    /**
     * 修改人脸
     * @param {object} face
     */
    async update(face) {
        return await t_face.update(face, {
            where: {
                id: face.id
            }
        });
    }

    /**
     * 删除人脸
     * @param {*} id 
     */
    async delete(id) {
        return await t_face.destroy({
            where: {
                id: id
            },
        });

    }

    /**
     * 获取人脸列表
     * @param {array} attrs  查询字段
     * @param {object} where  查询条件
     * @param {array} order   排序
     */
    async getList(attrs, where, order) {
        let option={};
        if(where){
           option.where=where;
        }
        if (order) {
            option.order = order;
        }
        if (attrs) {
            option.attributes = attrs;
        }
        return await t_face.findAll(option);
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
    async query(sql,params=null){
        return await db_common.query(sql,params);
    }

}
export default new FaceModel();