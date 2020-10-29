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
}

export default new TableController()