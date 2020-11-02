import BaseController from '../../lib/base_controller';
import parameterValidate from '../../lib/parameter_validate';
import tableService from '../../service/core/table';

/**
 * 表格接口
 * @extends BaseController
 */
class TableController extends BaseController {
  constructor() {
    super();
  }

  /**
   * @method 获取表格字段
   * @param {*} ctx
   */
  async columns(ctx) {
    try {
      const params = ctx.request.query;
      const validRule = {
        table_code: {
          type: 'string',
        },
      };
      parameterValidate.validate(validRule, params);
      let result = await tableService.getTableColumn(params.table_code);
      if (result) {
        ctx.success(result);
      } else {
        ctx.error();
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * @method 获取所有表格
   * @param {*} ctx 
   */
  async list(ctx) {
    try {
      const params = ctx.request.query;
      const validRule = {
        table_name: {
          type: 'string',
          allowEmpty: true,
          required: false,
        },
      };
      parameterValidate.validate(validRule, params);
      let result = await tableService.getList(params);
      if (result) {
        ctx.success(result);
      } else {
        ctx.error();
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * 新增表格字段
   * @param {*} ctx 
   */
  async createColumn(ctx) {
		const params = ctx.request.body;
		const validRule = {
			table_id: {
        type: 'int',
				convertType: 'int'
			},
		  title: {
				type: 'string',
				min: 1,
				max: 50
			},
			data_index: {
				type: 'string',
				min: 1,
				max: 50
      },
      key: {
				type: 'string',
				min: 1,
				max: 50
      },
      width:{
        type: 'int',
				convertType: 'int'
      }
		};
		parameterValidate.validate(validRule, params);
		let result = await tableService.createTableColumn(params);
		if (result) {
			ctx.success();
		} else {
			ctx.error();
		}
  }
  
  /**
   * 修改表格字段
   * @param {*} ctx 
   */
  async updateColumn(ctx) {
		const params = ctx.request.body;
		const validRule = {
      id: {
        type: 'int',
				convertType: 'int'
			},
		  title: {
				type: 'string',
				min: 1,
				max: 50
			},
			data_index: {
				type: 'string',
				min: 1,
				max: 50
      },
      key: {
				type: 'string',
				min: 1,
				max: 50
      },
      width:{
        type: 'int',
				convertType: 'int'
      }
		};
		parameterValidate.validate(validRule, params);
		let result = await tableService.updateTableColumn(params);
		if (result) {
			ctx.success();
		} else {
			ctx.error();
		}
  }
  
    /**
   * 删除表格字段
   * @param {*} ctx 
   */
  async deleteColumn(ctx) {
		const params = ctx.request.body;
		const validRule = {
			id: {
				type: 'int',
				convertType: 'int'
			}
		};
		parameterValidate.validate(validRule, params);
		let result = await tableService.deleteTableColumn(params.id);
		if (result) {
			ctx.success();
		} else {
			ctx.error();
		}
	}
}

export default new TableController()