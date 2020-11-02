import m_table from '../../model/core/table';
import {
	Op
} from 'sequelize';
class TableService {
  constructor() {}

  /**
   * 获取表格字段
   * @param {number} id
   */
  async getTableColumn(table_code) {
    const table = await m_table.getTableByCode(table_code);
    const columns = await m_table.getTableColumns(table.dataValues.id);
    table.dataValues.columns = columns;

    return table;
  }

  /**
   * 获取所有表格
   */
  async getList(params){
    const {
			ustable_nameer_name,
			sorter
		} = params;
    let where={}
     if(!isNull(table_name)){
      where.table_name = {
				[Op.like]: table_name + '%'
			};
     }
     let order = [
			['create_time', 'desc']
		];
     //排序
		if (sorter) {
			order.unshift(sorter.split('|'));
    }
    let attr=['id','table_code','table_name']
     const tables=await m_table.getList(attr,where,order);
     return tables;
  }

  /**
   * 添加字段
   */
  async createTableColumn(column){
     const result=await m_table.create(column)
     return result;
  }

  /**
   * 修改字段
   */
  async updateTableColumn(column){
    const result=await m_table.update(column)
    return result;
  }

  /**
   * 删除字段
   */
  async deleteTableColumn(id){
    const result=await m_table.delete(id)
    return result;
  }
}
export default new TableService();
