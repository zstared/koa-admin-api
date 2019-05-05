import BaseController from '../../lib/base_controller';
import parameterValidate from '../../lib/parameter_validate';
import logService from '../../service/core/role';
/**
 * 日志接口
 * @extends BaseController
 */
class LogController extends BaseController {
	constructor() {
		super();
	}

	/**
     * 日志详情
     * @api {get} /core/log/details/:id 2.日志详情
     * @apiName details
     * @apiGroup  log 
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     */
	async details(ctx) {
		const params = ctx.params;
		const validRule = {
			id: {
				type: 'int',
				convertType: 'int'
			}
		};
		parameterValidate.validate(validRule, params);
		let result = await logService.details(params);
		if (result) {
			ctx.success(result);
		} else {
			ctx.error();
		}
	}



	/**
     * 获取日志分页列表
     * @api {get} /core/log/pageList 3.获取日志分页列表
     * @apiName pageList
     * @apiGroup  log 
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccessPageList
     * @apiParam  {String} system 所属系统
     * @apiParam  {String} module 所属模块
     * @apiParam  {String} action 请求动作
     * @apiParam  {String} option_user 操作人
     * @apiParam  {String} page_index 页码
     * @apiParam  {String} page_size 页记录数
     * @apiParam  {String} sorter 排序字段 '字段名|排序规则'
     * @apiSuccess  (Response) {Number} data.rows.id 日志ID
     * @apiSuccess  (Response) {String} data.rows.system 所属系统
     * @apiSuccess  (Response) {String} data.rows.module 所属角色
     * @apiSuccess  (Response) {String} data.rows.action 请求动作
     * @apiSuccess  (Response) {String} data.rows.url 请求路径
     * @apiSuccess  (Response) {Object} data.rows.params 请求数据
     * @apiSuccess  (Response) {Number} data.rows.status 状态 0-失败；1-成功
     * @apiSuccess  (Response) {String} data.rows.message 返回信息
     * @apiSuccess  (Response) {String} data.rows.description 返回描述
     * @apiSuccess  (Response) {String} data.rows.option_user 操作人
     * @apiSuccess  (Response) {String} data.rows.option_ip 操作ip
     * @apiSuccess  (Response) {Date} data.rows.option_time 操作时间 
     * @apiSuccessExample  {json} data.rows :
     * {
     *     id : '1',
     *     system : 'core',
     *     module : 'user',
     *     action : 'login',
     *     url : '/core/oauth/login',
     *     params : '{user_name:'test'}',
     *     status : '1',
     *     message : '请求成功',
     *     description : '',
     *     option_user : 'test',
     *     option_ip : '127.0.0.1',
     *     option_time : '2018-11-14T01:23:57.000Z',
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
			system: {
				type: 'string',
				min: 2,
				max: 50
			},
			module: {
				type: 'string',
				min: 2,
				max: 50
			},
			action: {
				type: 'string',
				min: 3,
				max: 50
			},
			option_user: {
				type: 'string',
				min: 3,
				max: 50
			},
		};
		parameterValidate.validate(validRule, params);
		let result = await logService.getPageList(params);
		if (result) {
			ctx.success(result);
		} else {
			ctx.error();
		}
	}


}

export default new LogController();