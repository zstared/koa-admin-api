import BaseController from '../../lib/base_controller';
import parameterValidate from '../../lib/parameter_validate';
import tanabataService from '../../service/xh/tanabata';
/**
 * 照片接口
 * @extends BaseController
 */
class PhotoController extends BaseController {
	constructor() {
		super();
	}

	/**
	 * 新增照片
	 * @api {post} /xh/tanabata/create 1.新增照片
	 * @apiName create
	 * @apiGroup  tanabata 
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {String} tanabata_code 照片code
	 * @apiParam  {String} title 标题
	 * @apiParam  {String} description 描述
	 * @apiParam  {Number} sort_no 排序
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     tanabata_code:'',
	 *     title : 'test',
	 *     description:'',
	 *     sort_no : 1,
	 * }
	 */
	async create(ctx) {
		const params = ctx.request.body;
		const validRule = {
			tanabata_code: {
				type: 'string',
				min: 32,
				max: 32
			},
			title: {
				type: 'string',
				min: 0,
				max: 200,
				required:false,
				allowEmpty: true,
			},
			description: {
				type: 'string',
				min: 0,
				max: 2000,
				required:false,
				allowEmpty: true,
			},
			type: {
				required: false,
				type: 'int',
				convertType: 'int',
			},
			tag: {
				required: false,
				type: 'int',
				convertType: 'int',
			},
			sort_no: {
				required: false,
				type: 'int',
				convertType: 'int'
			},
		};
		parameterValidate.validate(validRule, params);
		let result = await tanabataService.create(params);
		if (result) {
			ctx.success();
		} else {
			ctx.error();
		}
	}

	/**
	 * 修改照片
	 * @api {post} /xh/tanabata/update 2.修改照片
	 * @apiName update
	 * @apiGroup  tanabata 
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} id 照片ID
	 * @apiParam  {String} tanabata_code 照片code
	 * @apiParam  {String} title 标题
	 * @apiParam  {String} description 描述
	 * @apiParam  {Number} sort_no 排序
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     id:2,
	 *     tanabata_code:'',
	 *     title : 'test',
	 *     description:'',
	 *     sort_no : 1,
	 * }
	 */
	async update(ctx) {
		const params = ctx.request.body;
		const validRule = {
			id: {
				type: 'int',
				convertType: 'int'
			},
			tanabata_code: {
				type: 'string',
				min: 32,
				max: 32
			},
			title: {
				type: 'string',
				min: 0,
				max: 200,
				required:false,
				allowEmpty: true,
			},
			description: {
				type: 'string',
				min: 0,
				max: 2000,
				required:false,
				allowEmpty: true,
			},
			type: {
				required: false,
				type: 'int',
				convertType: 'int',
			},
			tag: {
				required: false,
				type: 'int',
				convertType: 'int',
			},
			sort_no: {
				required: false,
				type: 'int',
				convertType: 'int'
			},
		};
		parameterValidate.validate(validRule, params);
		let result = await tanabataService.update(params);
		if (result) {
			ctx.success();
		} else {
			ctx.error();
		}
	}

	/**
	 * 删除照片
	 * @api {post} /xh/tanabata/delete 3.删除照片
	 * @apiName delete
	 * @apiGroup  tanabata 
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} id 照片ID
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
		let result = await tanabataService.delete(params);
		if (result) {
			ctx.success();
		} else {
			ctx.error();
		}
	}

	/**
	 * 获取照片分页列表
	 * @api {get} /xh/tanabata/pageList 6.获取照片分页列表
	 * @apiName pageList
	 * @apiGroup  tanabata 
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccessPageList
	 * @apiParam  {String} title 标题
	 * @apiParam  {String} page_index 页码
	 * @apiParam  {String} page_size 页记录数
	 * @apiParam  {String} sorter 排序字段 '字段名|排序规则'
	 * @apiParam  (Response) {Number} data.rows.id 照片ID
	 * @apiSuccess  (Response) {String} data.rows.title 照片名称
	 * @apiSuccess  (Response) {String} data.rows.url 照片名称
	 * @apiSuccess  (Response) {String} data.rows.sort_no 排序 
	 * @apiSuccess  (Response) {String} data.rows.thumb_url 照片名称
	 * @apiSuccess  (Response) {String} data.rows.description 照片描述
	 * @apiSuccess  (Response) {Date} data.rows.create_time 创建时间
	 * @apiSuccessExample  {json} data.rows :
	 * {
     *     id : 1,
	 *     title : 'test',
	 *     description : '照片描述',
	 *     url:'',
	 *     thumb_url:'',
	 *     sort_no:1,
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
				type: 'order',
			},
			title: {
				required: false,
				allowEmpty: true,
				type: 'string',
				max: 200
			},
			type: {
				required: false,
				type: 'int',
				convertType: 'int',
			},
			tag: {
				required: false,
				type: 'int',
				convertType: 'int',
			},
		};
		parameterValidate.validate(validRule, params);
		let result = await tanabataService.getPageList(params);
		if (result) {
			ctx.success(result);
		} else {
			ctx.error();
		}
	}
	
}

export default new PhotoController();