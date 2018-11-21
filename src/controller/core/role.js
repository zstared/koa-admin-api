import BaseController from '../../lib/base_controller';
import parameterValidate from '../../lib/parameter_validate';
import roleService from '../../service/core/role';
/**
 * 角色接口
 * @extends BaseController
 */
class RoleController extends BaseController {
	constructor() {
		super();
	}

	/**
     * 新增角色
     * @api {post} /core/role/create 1.新增角色
     * @apiName create
     * @apiGroup  role 
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiParam  {String} role_name 角色名称
     * @apiParam  {String} role_desc 角色描述
     * @apiParam  {Number} sort_no 排序
     * @apiParamExample  {Object} Request-Example:
     * {
     *     role_name : 'test',
     *     role_desc:'',
     *     sort_no : 1,
     * }
     */
	async create(ctx) {
		const params = ctx.request.body;
		const validRule = {
			role_name: {
				type: 'string',
				min: 3,
				max: 50
			},
			role_desc: {
				type: 'string',
				allowEmpty: true,
				min: 0,
				max: 100
			},
			sort_no: {
				type: 'int',
				convertType: 'int'
			},
		};
		parameterValidate.validate(validRule, params);
		let result = await roleService.create(params);
		if (result) {
			ctx.success();
		} else {
			ctx.error();
		}
	}

	/**
     * 修改角色
     * @api {post} /core/role/update 2.修改角色
     * @apiName update
     * @apiGroup  role 
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiParam  {Number} role_id 角色ID
     * @apiParam  {String} role_name 角色名称
     * @apiParam  {String} role_desc 角色描述
     * @apiParam  {Number} sort_no 排序
     * @apiParamExample  {Object} Request-Example:
     * {
     *     role_id:2,
     *     role_name : 'test',
     *     role_desc:'',
     *     sort_no : 1,
     * }
     */
	async update(ctx) {
		const params = ctx.request.body;
		const validRule = {
			role_id: {
				type: 'int',
				convertType: 'int'
			},
			role_name: {
				type: 'string',
				min: 3,
				max: 50
			},
			role_desc: {
				type: 'string',
				allowEmpty: true,
				min: 0,
				max: 100
			},
			sort_no: {
				type: 'int',
				convertType: 'int'
			},
		};
		parameterValidate.validate(validRule, params);
		let result = await roleService.update(params);
		if (result) {
			ctx.success();
		} else {
			ctx.error();
		}
	}

	/**
     * 删除角色
     * @api {delete} /core/role/delete 3.删除角色
     * @apiName delete
     * @apiGroup  role 
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiParam  {Number} role_id 角色ID
     * @apiParamExample  {Object} Request-Example:
     * {
     *     role_id:2,
     * }
     */
	async delete(ctx) {
		const params = ctx.request.body;
		const validRule = {
			role_id: {
				type: 'int',
				convertType: 'int'
			}
		};
		parameterValidate.validate(validRule, params);
		let result = await roleService.delete(params);
		if (result) {
			ctx.success();
		} else {
			ctx.error();
		}
	}

	/**
     * 角色详情
     * @api {get} /core/role/details/:role_id 4.角色详情
     * @apiName details
     * @apiGroup  role 
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     */
	async details(ctx) {
		const params = ctx.params;
		const validRule = {
			role_id: {
				type: 'int',
				convertType: 'int'
			}
		};
		parameterValidate.validate(validRule, params);
		let result = await roleService.details(params);
		if (result) {
			ctx.success(result);
		} else {
			ctx.error();
		}
	}

	/**
     * 获取角色列表
     * @api {get} /core/role/list 5.获取角色列表
     * @apiName list
     * @apiGroup  role 
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiParam  {String} role_name 用户名
     * @apiSuccess  (Response) {String} data.role_name 角色名称
     * @apiSuccess  (Response) {String} data.role_desc 角色描述
     * @apiSuccess  (Response) {Date} data.create_time 创建时间
     * @apiSuccessExample  {json} data :
     * {
     *     role_name : 'test',
     *     role_desc : '角色描述',
     *     create_time : '2018-11-14T01:23:57.000Z',
     * }
     */
	async list(ctx) {
		const params = ctx.request.body;
		const validRule = {
			role_name: {
				allowEmpty: true,
				type: 'string',
				max: 50
			}
		};
		parameterValidate.validate(validRule, params);
		let result = await roleService.getList(params);
		if (result) {
			ctx.success(result);
		} else {
			ctx.error();
		}
	}
}

export default new RoleController();