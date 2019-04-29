import BaseController from '../../lib/base_controller';
import parameterValidate from '../../lib/parameter_validate';
import organizationService from '../../service/core/organization';
/**
 * 组织接口
 * @extends BaseController
 */
class ResourceController extends BaseController {
	constructor() {
		super();
	}

	/**
     * 新增组织
     * @api {post} /core/organization/create 1.新增组织
     * @apiName create
     * @apiGroup  organization
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiParam  {String} name 组织名称
     * @apiParam  {String} name_short 组织名称
     * @apiParam  {Number} type 组织类型 1-公司/集团; 2-子公司; 3-部门
	 * @apiParam  {String} 
     * @apiParam  {String} path 组织路径(如001,001.002,001.002.001)  用于检索
     * @apiParam  {int} parent_id 父级组织ID
     * @apiParam  {Number} sort_no 排序
     * @apiParamExample  {Object} Request-Example:
     * {
     *     name : '人力资源部门',
     *     type:'3',
	 *     icon:'cog',
     *     path : /core/organization/create,
     *     parent_id:10,
     *     sort_no:1
     * }
     */
	async create(ctx) {
		const params = ctx.request.body;
		const validRule = {
			name: {
				type: 'string',
				min: 2,
				max: 50
			},
			organization_code: {
				type: 'string',
				min: 2,
				max: 50,
				allowEmpty:true,
				required:false,
			},
			type: {
				type: 'enum',
				values: [1, 2, 3,4],
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
			}
		};
		parameterValidate.validate(validRule, params);
		let result = await organizationService.create(params);
		if (result) {
			ctx.success();
		} else {
			ctx.error();
		}
	}

	/**
     * 修改组织
     * @api {post} /core/organization/update 2.修改组织
     * @apiName update
     * @apiGroup  organization
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiParam  {String} id 组织id
     * @apiParam  {String} name 组织名称
	 * @apiParam  {String} organization_code 组织编码
     * @apiParam  {Number} type 组织类型 1-模块; 2-菜单; 3-接口
	 * @apiParam  {String} icon 组织图标
     * @apiParam  {String} path 组织路径（菜单路由、接口地址）
     * @apiParam  {int} parent_id 父级组织ID
     * @apiParam  {Number} sort_no 排序
     * @apiParamExample  {Object} Request-Example:
     * {
     *     id:20,
     *     name : '新增组织',
	 *     organization_code:'add',
     *     type:'3',
	 *     icon:'cog',
     *     path : /core/organization/create,
     *     parent_id:10,
     *     sort_no:1
     * }
     */
	async update(ctx) {
		const params = ctx.request.body;
		const validRule = {
			id: {
				type: 'int',
				convertType:'int'
			},
			name: {
				type: 'string',
				min: 2,
				max: 50
			},
			organization_code: {
				type: 'string',
				min: 2,
				max: 50,
				allowEmpty:true,
				required:false,
			},
			type: {
				type: 'enum',
				values: [1, 2, 3,4],
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
			}
		};
		parameterValidate.validate(validRule, params);
		let result = await organizationService.update(params);
		if (result) {
			ctx.success();
		} else {
			ctx.error();
		}
	}

	/**
     * 删除组织
     * @api {post} /core/organization/delete 3.删除组织
     * @apiName delete
     * @apiGroup  organization
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiParam  {Number} id 组织ID
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
		let result = await organizationService.delete(params);
		if (result) {
			ctx.success();
		} else {
			ctx.error();
		}
	}

	/**
     * 组织详情
     * @api {get} /core/organization/details/:id 4.组织详情
     * @apiName details
     * @apiGroup  organization
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
		let result = await organizationService.details(params);
		if (result) {
			ctx.success(result);
		} else {
			ctx.error();
		}
	}

	/**
     * 获取组织列表
     * @api {get} /core/organization/treeList 5.获取组织树形列表
     * @apiName list
     * @apiGroup  organization
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiSuccess  {String} id 组织id
     * @apiSuccess  {String} name 组织名称
	 * @apiSuccess  {String} organization_code 组织编码
	 * @apiSuccess  {String} locale 本地化配置(前端配置)
     * @apiSuccess  {Number} type 组织类型 1-模块; 2-菜单; 3-接口
     * @apiSuccess  {String} icon 组织图标
     * @apiSuccess  {String} path 组织路径（菜单路由、接口地址）
     * @apiSuccess  {int} parent_id 父级组织ID
     * @apiSuccess  {Number} sort_no 排序
     * @apiSuccess  {Arrary} children 子级组织列表
     * @apiSuccessExample  {json} data :
     * {
     *     id:20,
     *     name : '新增组织',
	 *     organization_code :'add',
	 *     locale:'organization.add',
     *     type:'3',
	 *     icon:'cog',
     *     path : /core/organization/create,
     *     parent_id:10,
     *     sort_no:1,
     *     children:[]
     * }
     */
	async treeList(ctx) {
		let result = await organizationService.getTreeList();
		if (result) {
			ctx.success(result);
		} else {
			ctx.error();
		}
	}

	/**
	 * 判断组织名称是否存在
	 * @api {get} /core/organization/existResource 6.判断组织名称是否存在
	 * @apiName existResource
	 * @apiGroup  organization
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} name 组织名称
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     name : 'test',
	 *     id : '1',
	 * }
	 */
	async existResource(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				name: {
					type: 'string',
					min: 1,
					max: 50
				},
				parent_id:{
					type: 'int',
					convertType: 'int',
				},
				id:{
					type: 'int',
					convertType: 'int',
					required: false
				}
			};
			parameterValidate.validate(validRule, params);
			let result = await organizationService.existResource(params.name,params.parent_id,params.id);
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
	 * 判断组织编码是否存在
	 * @api {get} /core/organization/existResourceCode 7.判断组织编码是否存在
	 * @apiName existResourceCode
	 * @apiGroup  organization
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} organization_code 组织编码
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     organization_code : 'test',
	 *     id : '1',
	 * }
	 */
	async existResourceCode(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				organization_code: {
					type: 'string',
					min: 1,
					max: 50
				},
				parent_id:{
					type: 'int',
					convertType: 'int',
				},
				id:{
					type: 'int',
					convertType: 'int',
					required: false
				}
			};
			parameterValidate.validate(validRule, params);
			let result = await organizationService.existResourceCode(params.organization_code,params.parent_id,params.id);
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
     * 获取组织树形下拉列表(只有模块与菜单)
     * @api {get} /core/organization/treeDropList 8.获取组织树形下拉列表(只有模块与菜单)
     * @apiName treeDropList
     * @apiGroup  organization
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiSuccess  {String} key 组织id
     * @apiSuccess  {String} title 组织名称
	 * @apiSuccess  {String} organization_code 组织编码
	 * @apiSuccess  {String} locale 本地化配置(前端配置)
     * @apiSuccess  {Number} type 组织类型 1-模块; 2-菜单; 3-接口
     * @apiSuccess  {Arrary} children 子级组织列表
     * @apiSuccessExample  {json} data :
     * {
     *     id:20,
     *     name : '新增组织',
	 *     organization_code :'add',
	 *     locale:'organization.add',
     *     type:'3',
     *     children:[]
     * }
     */
	async treeDropList(ctx) {
		let result = await organizationService.getTreeDropList();
		if (result) {
			ctx.success(result);
		} else {
			ctx.error();
		}
	}

	/**
     * 获取权限组织树形下拉列表
     * @api {get} /core/organization/treePermissionList 9.获取权限组织树形下拉列表
     * @apiName treePermissionList
     * @apiGroup  organization
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiSuccess  {String} key 组织id
     * @apiSuccess  {String} title 组织名称
	 * @apiSuccess  {String} organization_code 组织编码
	 * @apiSuccess  {String} locale 本地化配置(前端配置)
     * @apiSuccess  {Number} type 组织类型 1-模块; 2-菜单; 3-接口
     * @apiSuccess  {Arrary} children 子级组织列表
     * @apiSuccessExample  {json} data :
     * {
     *     key:20,
     *     title : '新增组织',
	 *     organization_code :'add',
	 *     locale:'organization.add',
     *     type:'3',
     *     children:[]
     * }
     */
	async treePermissionList(ctx) {
		let result = await organizationService.getTreePermissionList();
		if (result) {
			ctx.success(result);
		} else {
			ctx.error();
		}
	}
}

export default new ResourceController();