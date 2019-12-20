import BaseController from '../../lib/base_controller';
import parameterValidate from '../../lib/parameter_validate';
import faceService from '../../service/face_recognition/face';
/**
 * 人脸接口
 * @extends BaseController
 */
class RoleController extends BaseController {
    constructor() {
        super();
    }

    /**
     * 新增人脸
     * @api {post} /face_recognition/face/create 1.新增人脸
     * @apiName create
     * @apiGroup  face
     * @apiVersion  0.1.0
     *
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiParam  {String} face_name 人脸名称
     * @apiParam  {String} type_id 人脸类型
     * @apiParam  {String} file_code 人脸文件code
     * @apiParamExample  {Object} Request-Example:
     * {
     *     face_name : 'test',
     *     file_code:'',
     * }
     */
    async create(ctx) {
        const params = ctx.request.body;
        const validRule = {
            face_name: {
                type: 'string',
                min: 2,
                max: 50
            },
            type_id: {
                type: 'int',
                convertType: 'int'
            },
            file_code: {
                type: 'array',
                itemType: 'string',
                rule: {
                    min: 36,
                    max: 36
                }
            }
        };
        parameterValidate.validate(validRule, params);
        params.create_user = ctx.user_info.user_id;
        let result = await faceService.create(params);
        if (result) {
            ctx.success();
        } else {
            ctx.error();
        }
    }

    /**
     * 修改人脸
     * @api {post} /face_recognition/face/update 2.修改人脸
     * @apiName update
     * @apiGroup  face
     * @apiVersion  0.1.0
     *
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiParam  {Number} id 人脸ID
     * @apiParam  {String} type_id 人脸类型
     * @apiParam  {String} face_name 人脸名称
     * @apiParam  {String} file_code 文件编码
     * @apiParamExample  {Object} Request-Example:
     * {
     *     id:2,
     *     face_name : 'test',
     *     file_code:'',
     * }
     */
    async update(ctx) {
        const params = ctx.request.body;
        const validRule = {
            id: {
                type: 'int',
                convertType: 'int'
            },
            face_name: {
                type: 'string',
                min: 2,
                max: 50
            },
            type_id: {
                type: 'int',
                convertType: 'int'
            },
            file_code: {
                type: 'array',
                itemType: 'string',
                rule: {
                    min: 36,
                    max: 36
                }
            }
        };
        parameterValidate.validate(validRule, params);
        params.update_user = ctx.user_info.user_id;
        let result = await faceService.update(params);
        if (result) {
            ctx.success();
        } else {
            ctx.error();
        }
    }

    /**
     * 删除人脸
     * @api {post} /face_recognition/face/delete 3.删除人脸
     * @apiName delete
     * @apiGroup  face
     * @apiVersion  0.1.0
     *
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiParam  {Number} id 人脸ID
     * @apiParamExample  {Object} Request-Example:
     * {
     *     id:2,
     * }
     */
    async delete(ctx) {
        const params = ctx.request.body;
        const validRule = {
            id: {
                type: 'int',
                convertType: 'int'
            }
        };
        parameterValidate.validate(validRule, params);
        let result = await faceService.delete(params);
        if (result) {
            ctx.success();
        } else {
            ctx.error();
        }
    }

    /**
     * 获取人脸下拉列表
     * @api {get} /face_recognition/face/dropList 5.获取人脸下拉列表
     * @apiName list
     * @apiGroup  face
     * @apiVersion  0.1.0
     *
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccessList
     * @apiSuccess  (Response) {String} data.face_name 人脸名称
     * @apiSuccess  (Response) {String} data.id 人脸ID
     * @apiSuccessExample  {json} data :
     * {
     *     id : 1,
     *     face_name : 'test',
     * }
     */
    async dropList(ctx) {
        let result = await faceService.getDropList();
        if (result) {
            ctx.success(result);
        } else {
            ctx.error();
        }
    }

    /**
     * 获取人脸分页列表
     * @api {get} /face_recognition/face/pageList 6.获取人脸分页列表
     * @apiName pageList
     * @apiGroup  face
     * @apiVersion  0.1.0
     *
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccessPageList
     * @apiParam  {String} face_name 名称
     * @apiParam  {String} type_id 类型
     * @apiParam  {String} page_index 页码
     * @apiParam  {String} page_size 页记录数
     * @apiParam  {String} sorter 排序字段 '字段名|排序规则'
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
            sorter: {
                required: false,
                allowEmpty: true,
                type: 'order'
			},
			type_id: {
                required: false,
                allowEmpty: true,
                type: 'string',
                max: 50
            },
            face_name: {
                required: false,
                allowEmpty: true,
                type: 'string',
                max: 50
            }
        };
        parameterValidate.validate(validRule, params);
        let result = await faceService.getPageList(params);
        if (result) {
            ctx.success(result);
        } else {
            ctx.error();
        }
    }

    /**
     * 获取人脸类型列表
     * @api {get} /face_recognition/face/typeList 7.获取人脸类型列表
     * @apiName typeList
     * @apiGroup  face
     * @apiVersion  0.1.0
     *
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccessList
     * @apiSuccess  (Response) {String} data.type_name 类型名称
     * @apiSuccess  (Response) {String} data.id 类型ID
     * @apiSuccessExample  {json} data :
     * {
     *     id : 1,
     *     type_name : 'test',
     * }
     */
    async typeList(ctx) {
        let result = await faceService.getFaceTypeList();
        if (result) {
            ctx.success(result);
        } else {
            ctx.error();
        }
    }
}

export default new RoleController();