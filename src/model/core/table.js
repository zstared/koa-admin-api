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
    return await t_table_column.findAll({
      where: where,
    });
  }
}

export default new TableModel();
