import BaseController from '../../lib/base_controller';
import parameterValidate from '../../lib/parameter_validate';
import resourceService from '../../service/core/resource';
/**
 * 资源接口
 * @extends BaseController
 */
class ResourceController extends BaseController {
	constructor() {
		super();
	}

	/**
     * 新增资源
     * @api {post} /core/resource/create 1.新增资源
     * @apiName create
     * @apiGroup  resource
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiParam  {String} resource_name 资源名称
	 * @apiParam  {String} resource_code 资源编码
     * @apiParam  {Number} resource_type 资源类型1-菜单；2-权限；3-接口
	 * @apiParam  {String} icon 资源图标
     * @apiParam  {String} path 资源路径（菜单路由、接口地址）
     * @apiParam  {int} parent_id 父级资源ID
     * @apiParam  {Number} sort_no 排序
     * @apiParamExample  {Object} Request-Example:
     * {
     *     resource_name : '新增资源',
     *     resource_code:'add',
     *     resource_type:'3',
	 *     icon:'cog',
     *     path : /core/resource/create,
     *     parent_id:10,
     *     sort_no:1
     * }
     */
	async create(ctx) {
		const params = ctx.request.body;
		const validRule = {
			resource_name: {
				type: 'string',
				min: 2,
				max: 50
			},
			resource_code: {
				type: 'string',
				min: 2,
				max: 50,
				allowEmpty:true
			},
			resource_type: {
				type: 'enum',
				values: [1, 2, 3],
				convertType: 'int',
			},
			icon: {
				type: 'string',
				allowEmpty: true,
			},
			path: {
				type: 'string',
				allowEmpty: true,
			},
			parent_id: {
				type: 'int',
				convertType: 'int',
			},
			is_visiable:{
				type:'enum',
				values:[0,1],
				convertType:'int'
			},
			sort_no: {
				type: 'int',
				convertType: 'int',
				allowEmpty: true,
			}
		};
		parameterValidate.validate(validRule, params);
		let result = await resourceService.create(params);
		if (result) {
			ctx.success();
		} else {
			ctx.error();
		}
	}

	/**
     * 修改资源
     * @api {post} /core/resource/update 2.修改资源
     * @apiName update
     * @apiGroup  resource
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiParam  {String} resource_id 资源id
     * @apiParam  {String} resource_name 资源名称
	 * @apiParam  {String} resource_code 资源编码
     * @apiParam  {Number} resource_type 资源类型1-菜单；2-权限；3-接口
	 * @apiParam  {String} icon 资源图标
     * @apiParam  {String} path 资源路径（菜单路由、接口地址）
     * @apiParam  {int} parent_id 父级资源ID
     * @apiParam  {Number} sort_no 排序
     * @apiParamExample  {Object} Request-Example:
     * {
     *     resource_id:20,
     *     resource_name : '新增资源',
	 *     resource_code:'add',
     *     resource_type:'3',
	 *     icon:'cog',
     *     path : /core/resource/create,
     *     parent_id:10,
     *     sort_no:1
     * }
     */
	async update(ctx) {
		const params = ctx.request.body;
		const validRule = {
			resource_id: {
				type: 'int',
				convertType:'int'
			},
			resource_name: {
				type: 'string',
				min: 2,
				max: 50
			},
			resource_code: {
				type: 'string',
				min: 2,
				max: 50,
				allowEmpty:true
			},
			resource_type: {
				type: 'enum',
				values: [1, 2, 3],
				convertType: 'int',
			},
			icon: {
				type: 'string',
				allowEmpty: true,
			},
			path: {
				type: 'string',
				allowEmpty: true,
			},
			parent_id: {
				type: 'int',
				convertType: 'int',
			},
			is_visiable:{
				type:'enum',
				values:[0,1],
				convertType:'int'
			},
			sort_no: {
				type: 'int',
				convertType: 'int',
				allowEmpty: true,
			}
		};
		parameterValidate.validate(validRule, params);
		let result = await resourceService.update(params);
		if (result) {
			ctx.success();
		} else {
			ctx.error();
		}
	}

	/**
     * 删除资源
     * @api {post} /core/resource/delete 3.删除资源
     * @apiName delete
     * @apiGroup  resource
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiParam  {Number} resource_id 资源ID
     * @apiParamExample  {Object} Request-Example:
     * {
     *     resource_id:2,
     * }
     */
	async delete(ctx) {
		const params = ctx.request.body;
		const validRule = {
			resource_id: {
				type: 'int',
				convertType: 'int'
			}
		};
		parameterValidate.validate(validRule, params);
		let result = await resourceService.delete(params);
		if (result) {
			ctx.success();
		} else {
			ctx.error();
		}
	}

	/**
     * 资源详情
     * @api {get} /core/resource/details/:resource_id 4.资源详情
     * @apiName details
     * @apiGroup  resource
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     */
	async details(ctx) {
		const params = ctx.params;
		const validRule = {
			resource_id: {
				type: 'int',
				convertType: 'int'
			}
		};
		parameterValidate.validate(validRule, params);
		let result = await resourceService.details(params);
		if (result) {
			ctx.success(result);
		} else {
			ctx.error();
		}
	}

	/**
     * 获取资源列表
     * @api {get} /core/resource/treeList 5.获取资源树形列表
     * @apiName list
     * @apiGroup  resource
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiSuccess  {String} resource_id 资源id
     * @apiSuccess  {String} name 资源名称
	 * @apiSuccess  {String} locale 本地化配置(前端配置)
     * @apiSuccess  {Number} resource_type 资源类型1-菜单；2-权限；3-接口
     * @apiSuccess  {String} icon 资源图标
     * @apiSuccess  {String} path 资源路径（菜单路由、接口地址）
     * @apiSuccess  {int} parent_id 父级资源ID
     * @apiSuccess  {Number} sort_no 排序
     * @apiSuccess  {Arrary} children 子级资源列表
     * @apiSuccessExample  {json} data :
     * {
     *     resource_id:20,
     *     name : '新增资源',
	 *     locale:'resource.add',
     *     resource_type:'3',
	 *     icon:'cog',
     *     path : /core/resource/create,
     *     parent_id:10,
     *     sort_no:1,
     *     children:[]
     * }
     */
	async treeList(ctx) {
		let result = await resourceService.getTreeList();
		if (result) {
			ctx.success(result);
		} else {
			ctx.error();
		}
	}
}

export default new ResourceController();