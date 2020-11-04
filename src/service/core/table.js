import m_table from "../../model/core/table";
import { Op } from "sequelize";
import { isNull } from "../../lib/utils";
class TableService {
  constructor() {}

  /**
   * 获取表格与字段
   * @param {number} id
   */
  async getTableAndColumn(table_code) {
    const table = await m_table.getTableByCode(table_code);
    const columns = await m_table.getTableColumns(table.dataValues.id);
    table.dataValues.columns = columns;

    return table;
  }

  /**
   * 获取表格字段
   * @param {number} id
   */
  async getTableColumn(table_id) {
    const columns = await m_table.getTableColumns(table_id);
    return columns;
  }

  /**
   * 排序
   * @param {*} drag_id
   * @param {*} hover_id
   */
  async sortColum(params) {
    const { drag_id, hover_id, drag_no, hover_no } = params;
    await m_table.update({ id: drag_id, sort: hover_no });
    await m_table.update({ id: hover_id, sort: drag_no });
    return true;
  }

  /**
   * 获取所有表格
   */
  async getList(params) {
    const { table_name, sorter } = params;
    let where = {};
    if (!isNull(table_name)) {
      where.table_name = {
        [Op.like]: table_name + "%",
      };
    }
    let order = [["id"]];
    //排序
    if (sorter) {
      order.unshift(sorter.split("|"));
    }
    let attr = ["id", "table_code", "table_name"];
    const tables = await m_table.getList(attr, where, order);
    return tables;
  }

  /**
   * 添加字段
   */
  async createTableColumn(column) {
    const result = await m_table.create(column);
    return result;
  }

  /**
   * 修改字段
   */
  async updateTableColumn(column) {
    const result = await m_table.update(column);
    return result;
  }

  /**
   * 删除字段
   */
  async deleteTableColumn(id) {
    const result = await m_table.delete(id);
    return result;
  }
}
export default new TableService();
