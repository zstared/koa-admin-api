import sequelize from '../db_init';
import db_common from '../db_common';
const t_tanabata = require('../table/xh_tanabata')(sequelize, sequelize.Sequelize);
class PhotoModel {
  constructor() {}


  /**
   * 根据照片id获取照片
   * @param {string} id 
   * @param {string} password 
   * @param {array}  attr
   */
  async getDetailsById(id, attr = null) {
    let option = {};
    if (attr) {
      option.attributes = attr;
    }
    return await t_tanabata.findByPk(id, option);
  }

  /**
   * 新增照片
   * @param {object} tanabata 
   */
  async create(tanabata) {
    return await t_tanabata.create(tanabata);
  }
  /**
   * 修改照片
   * @param {*} tanabata 
   */
  async update(tanabata) {
    return await t_tanabata.update(tanabata, {
      where: {
        id: tanabata.id
      }
    });
  }

  /**
   * 删除照片
   * @param {*} id 
   */
  async delete(id) {
    return await t_tanabata.destroy({
      where: {
        id: id
      },
    });

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
    return db_common.excutePagingProc(params, attrs, table, where, group, order);
  }

}

export default new PhotoModel();
