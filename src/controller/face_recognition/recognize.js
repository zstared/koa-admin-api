import BaseController from '../../lib/base_controller';
import parameterValidate from '../../lib/parameter_validate';
import recognizeService from '../../service/face_recognition/recognize';
/**
 * 人脸接口
 * @extends BaseController
 */
class RoleController extends BaseController {
  constructor() {
    super();
  }

  /**
   * 识别人脸
   * @api {post} /face_recognition/recognize/recognize 1.识别人脸
   * @apiName recognize
   * @apiGroup  recognize
   * @apiVersion  0.1.0
   *
   * @apiUse  Header
   * @apiUse  ResultError
   * @apiUse  ResultSuccess
   * @apiParam  {String} file_code 人脸文件code
   * @apiParamExample  {Object} Request-Example:
   * {
   *     file_code : '',
   * }
   */
  async recognize(ctx) {
    const params = ctx.request.body;
    const validRule = {
      file_code: { type: 'string', min: 36, max: 36 }
    };
    parameterValidate.validate(validRule, params);
    let result = await recognizeService.recognize(params);
    if (result) {
      ctx.success();
    } else {
      ctx.error();
    }
  }
}

export default new RoleController();
