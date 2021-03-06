import Parameter from 'parameter';
import ApiError from './api_error';
import { RCode } from '../lib/enum';

const parameter = new Parameter({
  convert: true
});

/*
 * mobile 手机号码验证规则
 */
//parameter.addRule('mobile',new RegExp(/^[1][345789]\d{9}&/,'i'));
parameter.addRule('mobile', (rule, value) => {
  if (!(rule.allowEmpty && value === '')) {
    //允许空且值为空的情况不验证
    const reg = /^[1][345789][0-9]{9}$/;
    if (!reg.test(value)) {
      return 'format is wrong';
    }
  }
});

/**
 * order 排序字段规则
 */
parameter.addRule('order', (rule, value) => {
  if (!(rule.allowEmpty && value === '')) {
    //允许空且值为空的情况不验证
    const reg = /^\w{2,50}\|(desc|asc)$/;
    if (!reg.test(value)) {
      return 'format is wrong';
    }
  }
});

class ParameterValidate {
  /**
   * 验证参数
   * @param {Object} rule 验证规则
   * @param {Object} data 待验证数据
   */
  validate(rule, data) {
    const result = parameter.validate(rule, data);
    if (result) {
      throw new ApiError(
        result[0].code == 'missing_field'
          ? RCode.common.C1000005
          : RCode.common.C1000006,
        result[0].field + ' ' + result[0].message
      );
    }
  }

  /**
   * 添加验证规则
   * @param {*} type
   * @param {*} check
   */
  addRule(type, check) {
    parameter.addRule(type, check);
  }

  convertToBoolean(val) {
    if (
      val == false ||
      val == 'false' ||
      val == 0 ||
      val == '' ||
      val == null ||
      val == undefined
    ) {
      return false;
    } else {
      return true;
    }
  }
}

export default new ParameterValidate();
