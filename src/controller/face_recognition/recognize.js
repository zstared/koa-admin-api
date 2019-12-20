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
     * @api {post} /face_recognition/recognize/detect 1.识别人脸
     * @apiName matching
     * @apiGroup  recognize
     * @apiVersion  0.1.0
     *
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiParam  {String} file_code  待识别文件code
     * @apiParamExample  {Object} Request-Example:
     * {
     *     file_code : '',
     * }
     */
    async detect(ctx) {
        const params = ctx.request.body;
        const validRule = {
            file_code: { type: 'string', min: 36, max: 36 },
        };
        parameterValidate.validate(validRule, params);
        params.user_id = ctx.user_info.user_id;
        let result = await recognizeService.detect(params);
        if (result) {
            ctx.success(result);
        } else {
            ctx.error();
        }
    }

    /**
     * 比对人脸
     * @api {post} /face_recognition/recognize/matching 2.比对人脸
     * @apiName matching
     * @apiGroup  recognize
     * @apiVersion  0.1.0
     *
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiParam  {String} file_code  待识别文件code
     * @apiParam  {String} face_code   人脸文件code
     * @apiParamExample  {Object} Request-Example:
     * {
     *     file_code : '',
     *     file_code : '',
     * }
     */
    async matching(ctx) {
        const params = ctx.request.body;
        const validRule = {
            face_code: { type: 'string', min: 36, max: 36 },
            face_id: { type: 'int', convertType: 'int' },
        };
        parameterValidate.validate(validRule, params);
        params.user_id = ctx.user_info.user_id;
        let result = await recognizeService.matching(params);
        if (result) {
            ctx.success(result);
        } else {
            ctx.error();
        }
    }

    /**
     * 获取人脸拼图
     * @api {get} /face_recognition/recognize/sprite 3.人脸拼图
     * @apiName sprite
     * @apiGroup  recognize
     * @apiVersion  0.1.0
     *
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     */
    async sprite(ctx) {
        let result = await recognizeService.sprite();
        if (result) {
            ctx.success(result);
        } else {
            ctx.error();
        }
    }


    /**
     * 获取人脸分页列表
     * @api {get} /face_recognition/recognize/pageList 4.获取人脸分页列表
     * @apiName pageList
     * @apiGroup  face
     * @apiVersion  0.1.0
     *
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccessPageList
     * @apiParam  {String} page_index 页码
     * @apiParam  {String} page_size 页记录数
     * @apiParam  (Response) {Number} data.rows.id 人脸ID
     * @apiSuccess  (Response) {String} data.rows.face_name 人脸名称
     * @apiSuccess  (Response) {Date} data.rows.create_time 创建时间
     * @apiSuccessExample  {json} data.rows :
     * {
     *     id : 1,
     *     face_name : 'test',
     *     create_time : '2018-11-14T01:23:57.000Z',
     * }
     */
    async pageList(ctx) {
        const params = ctx.request.query;
        const validRule = {
            page_index: {
                type: 'int',
                convertType: 'int',
                min: 1
            },
            page_size: {
                type: 'int',
                convertType: 'int',
                min: 1
            },
        };
        parameterValidate.validate(validRule, params);
        let result = await recognizeService.getPageList(params);
        if (result) {
            ctx.success(result);
        } else {
            ctx.error();
        }
    }
}

export default new RoleController();