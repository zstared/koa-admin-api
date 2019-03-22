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
     * @apiParam  {Number} resource_type 资源类型 1-模块; 2-菜单; 3-接口
	 * @apiParam  {Number} permission_type 权限类型
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
				allowEmpty:true,
				required:false,
			},
			resource_type: {
				type: 'enum',
				values: [1, 2, 3],
				convertType: 'int',
			},
			icon: {
				type: 'string',
				allowEmpty: true,
				required:false,
			},
			path: {
				type: 'string',
				allowEmpty: true,
				required:false,
			},
			parent_id: {
				type: 'int',
				convertType: 'int',
				required:false,
			},
			is_visiable:{
				type:'enum',
				values:[0,1],
				convertType:'int',
				required:false,
			},
			sort_no: {
				type: 'int',
				convertType: 'int',
				allowEmpty: true,
				required:false,
			},
			permission_type:{
				type:'enum',
				values:[1,2,3,4,5,6,99],
				convertType:'int',
				required:false,
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
     * @apiParam  {Number} resource_type 资源类型 1-模块; 2-菜单; 3-接口
	 * @apiParam  {Number} permission_type 权限类型
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
				allowEmpty:true,
				required:false,
			},
			resource_type: {
				type: 'enum',
				values: [1, 2, 3],
				convertType: 'int',
			},
			icon: {
				type: 'string',
				allowEmpty: true,
				required:false,
			},
			path: {
				type: 'string',
				allowEmpty: true,
				required:false,
			},
			parent_id: {
				type: 'int',
				convertType: 'int',
				required:false,
			},
			is_visiable:{
				type:'enum',
				values:[0,1],
				convertType:'int',
				required:false,
			},
			sort_no: {
				type: 'int',
				convertType: 'int',
				required:false,
			},
			permission_type:{
				type:'enum',
				values:[1,2,3,4,5,6,99],
				convertType:'int',
				required:false,
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
     * @apiSuccess  {String} resource_name 资源名称
	 * @apiSuccess  {String} resource_code 资源编码
	 * @apiSuccess  {String} locale 本地化配置(前端配置)
     * @apiSuccess  {Number} resource_type 资源类型 1-模块; 2-菜单; 3-接口
     * @apiSuccess  {String} icon 资源图标
     * @apiSuccess  {String} path 资源路径（菜单路由、接口地址）
     * @apiSuccess  {int} parent_id 父级资源ID
     * @apiSuccess  {Number} sort_no 排序
     * @apiSuccess  {Arrary} children 子级资源列表
     * @apiSuccessExample  {json} data :
     * {
     *     resource_id:20,
     *     resource_name : '新增资源',
	 *     resource_code :'add',
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

	/**
	 * 判断资源名称是否存在
	 * @api {get} /core/resource/existResource 6.判断资源名称是否存在
	 * @apiName existResource
	 * @apiGroup  resource
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} resource_name 资源名称
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     resource_name : 'test',
	 *     resource_id : '1',
	 * }
	 */
	async existResource(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				resource_name: {
					type: 'string',
					min: 1,
					max: 50
				},
				parent_id:{
					type: 'int',
					convertType: 'int',
				},
				resource_id:{
					type: 'int',
					convertType: 'int',
					required: false
				}
			};
			parameterValidate.validate(validRule, params);
			let result = await resourceService.existResource(params.resource_name,params.parent_id,params.resource_id);
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
	 * 判断资源编码是否存在
	 * @api {get} /core/resource/existResourceCode 7.判断资源编码是否存在
	 * @apiName existResourceCode
	 * @apiGroup  resource
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} resource_code 资源编码
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     resource_code : 'test',
	 *     resource_id : '1',
	 * }
	 */
	async existResourceCode(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				resource_code: {
					type: 'string',
					min: 1,
					max: 50
				},
				parent_id:{
					type: 'int',
					convertType: 'int',
				},
				resource_id:{
					type: 'int',
					convertType: 'int',
					required: false
				}
			};
			parameterValidate.validate(validRule, params);
			let result = await resourceService.existResourceCode(params.resource_code,params.parent_id,params.resource_id);
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
     * 获取资源树形下拉列表(只有模块与菜单)
     * @api {get} /core/resource/treeDropList 8.获取资源树形下拉列表(只有模块与菜单)
     * @apiName treeDropList
     * @apiGroup  resource
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiSuccess  {String} key 资源id
     * @apiSuccess  {String} title 资源名称
	 * @apiSuccess  {String} resource_code 资源编码
	 * @apiSuccess  {String} locale 本地化配置(前端配置)
     * @apiSuccess  {Number} resource_type 资源类型 1-模块; 2-菜单; 3-接口
     * @apiSuccess  {Arrary} children 子级资源列表
     * @apiSuccessExample  {json} data :
     * {
     *     resource_id:20,
     *     resource_name : '新增资源',
	 *     resource_code :'add',
	 *     locale:'resource.add',
     *     resource_type:'3',
     *     children:[]
     * }
     */
	async treeDropList(ctx) {
		let result = await resourceService.getTreeDropList();
		if (result) {
			ctx.success(result);
		} else {
			ctx.error();
		}
	}

	/**
     * 获取权限资源树形下拉列表
     * @api {get} /core/resource/treePermissionList 9.获取权限资源树形下拉列表
     * @apiName treePermissionList
     * @apiGroup  resource
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiSuccess  {String} key 资源id
     * @apiSuccess  {String} title 资源名称
	 * @apiSuccess  {String} resource_code 资源编码
	 * @apiSuccess  {String} locale 本地化配置(前端配置)
     * @apiSuccess  {Number} resource_type 资源类型 1-模块; 2-菜单; 3-接口
     * @apiSuccess  {Arrary} children 子级资源列表
     * @apiSuccessExample  {json} data :
     * {
     *     key:20,
     *     title : '新增资源',
	 *     resource_code :'add',
	 *     locale:'resource.add',
     *     resource_type:'3',
     *     children:[]
     * }
     */
	async treePermissionList(ctx) {
		let result = await resourceService.getTreePermissionList();
		if (result) {
			ctx.success(result);
		} else {
			ctx.error();
		}
	}
}

export default new ResourceController();