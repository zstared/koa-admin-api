import sequelize from "../db_init";
const t_table = require("../table/cs_table")(sequelize, sequelize.Sequelize);
const t_table_column = require("../table/cs_table_column")(
  sequelize,
  sequelize.Sequelize
);

class TableModel {
  constructor() {}

  /**
   * 根据 table_code 获取表格信息
   * @param {*} table_code
   */
  async getTableByCode(table_code) {
    let where = {
      table_code: table_code,
    };
    return await t_table.findOne({
      where: where,
    });
  }

  /**
   * 根据tableId获取字段
   * @param {*} tableId
   */
  async getTableColumns(table_id) {
    let where = {
      table_id: table_id,
    };
    let order = [["sort"]];
    return await t_table_column.findAll({
      where: where,
      order: order,
    });
  }

  /**
   * 获取表格列表
   * @param {array} attrs  查询字段
   * @param {object} where  查询条件
   * @param {array} order   排序
   */
  async getList(attrs, where, order) {
    let option = {
      where: where,
    };
    if (order) {
      option.order = order;
    }
    if (attrs) {
      option.attributes = attrs;
    }
    return await t_table.findAll(option);
  }

  /**
   * 创建列
   * @param {*} column
   */
  async create(column) {
    const newColumn = await t_table_column.create(column);
    newColumn.dataValues.sort = newColumn.dataValues.id;
    return this.update(newColumn.dataValues);
  }

  /**
   * 修改列
   * @param {object} column
   */
  async update(column) {
    return await t_table_column.update(column, {
      where: {
        id: column.id,
      },
    });
  }

  /**
   * 删除列
   * @param {*} id
   */
  async delete(id) {
    let result = await t_table_column.destroy({
      where: {
        id: id,
      },
    });
    return result;
  }
}

export default new TableModel();
