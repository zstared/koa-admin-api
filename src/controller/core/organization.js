import BaseController from '../../lib/base_controller';
import parameterValidate from '../../lib/parameter_validate';
import organizationService from '../../service/core/organization';
/**
 * 组织接口
 * @extends BaseController
 */
class OrganizationController extends BaseController {
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
	 * @apiParam  {Number} leader 部门负责人 empId
	 * @apiParam  {Number} reporter 部门负责人的汇报对象（默认上级层级负责人）empId
     * @apiParam  {Number} parent_id 父级组织ID
     * @apiParam  {Number} sort_no 排序
     * @apiParamExample  {Object} Request-Example:
     * {
     *     name : '人力资源部门',
     *     name_short : '人资部门',
     *     type:'3',
	 *     leader:12,
	 * 	   reporter:12,
     *     parent_id:10,
     *     sort_no:1
     * }
     */
	async create(ctx) {
		const params = ctx.request.body;
		console.log(params);
		const validRule = {
			name: {
				type: 'string',
				min: 2,
				max: 50
			},
			name_short: {
				type: 'string',
				min: 2,
				max: 20,
				required:false,
			},
			type: {
				type: 'enum',
				values: [2, 3],
				convertType: 'int',
			},
			leader: {
				type: 'int',
				convertType: 'int',
				required:false,
			},
			reporter: {
				type: 'int',
				convertType: 'int',
				required:false,
			},
			parent_id: {
				type: 'int',
				convertType: 'int',
				required:false,
			},
			sort_no: {
				type: 'int',
				convertType: 'int',
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
     * @apiParam  {String} name 组织名称
     * @apiParam  {String} name_short 组织名称
     * @apiParam  {Number} type 组织类型 1-公司/集团; 2-子公司; 3-部门
	 * @apiParam  {Number} leader 部门负责人 empId
	 * @apiParam  {Number} reporter 部门负责人的汇报对象（默认上级层级负责人）empId
     * @apiParam  {Number} parent_id 父级组织ID
     * @apiParam  {Number} sort_no 排序
     * @apiParamExample  {Object} Request-Example:
     * {
     *     name : '人力资源部门',
     *     name_short : '人资部门',
     *     type:'3',
	 *     leader:12,
	 * 	   reporter:12,
     *     parent_id:10,
     *     sort_no:1
     * }
     */
	async update(ctx) {
		const params = ctx.request.body;
		const validRule = {
			name: {
				type: 'string',
				min: 2,
				max: 50
			},
			name_short: {
				type: 'string',
				min: 2,
				max: 20,
				required:false,
			},
			type: {
				type: 'enum',
				values: [1, 2, 3],
				convertType: 'int',
			},
			leader: {
				type: 'int',
				convertType: 'int',
				required:false,
			},
			reporter: {
				type: 'int',
				convertType: 'int',
				required:false,
			},
			parent_id: {
				type: 'int',
				convertType: 'int',
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
	 * @apiSuccess  {Number} id 组织id
     * @apiSuccess  {String} name 组织名称
     * @apiSuccess  {String} name_short 组织名称
     * @apiSuccess  {Number} type 组织类型 1-公司/集团; 2-子公司; 3-部门
	 * @apiSuccess  {Number} leader 部门负责人 empId
	 * @apiSuccess  {Number} reporter 部门负责人的汇报对象（默认上级层级负责人）empId
     * @apiSuccess  {Number} parent_id 父级组织ID
     * @apiSuccess  {Number} sort_no 排序
     * @apiSuccess  {Arrary} children 子级组织列表
     * @apiSuccessExample  {json} data :
     * {
     *     id:20,
     *     name : '人力资源部门',
     *     name_short : '人资部门',
     *     type:'3',
	 *     leader:12,
	 * 	   reporter:12,
     *     parent_id:10,
     *     sort_no:1
     *     children:[]
     * }
     */
	async treeList(ctx) {
		let result = await organizationService.getTreeList(ctx.user_info.company_id);
		if (result) {
			ctx.success(result);
		} else {
			ctx.error();
		}
	}

	/**
	 * 判断组织名称是否存在
	 * @api {get} /core/organization/existOrganization 6.判断组织名称是否存在
	 * @apiName existOrganization
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
	async existOrganization(ctx) {
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
			let result = await organizationService.existOrganization(params.name,params.parent_id,params.id);
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
     * 获取组织树形下拉列表
     * @api {get} /core/organization/treeDropList 8.获取组织树形下拉列表
     * @apiName treeDropList
     * @apiGroup  organization
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiSuccess  {String} key 组织id
     * @apiSuccess  {String} title 组织名称
     * @apiSuccess  {Number} type 组织类型 1-模块; 2-菜单; 3-接口
     * @apiSuccess  {Arrary} children 子级组织列表
     * @apiSuccessExample  {json} data :
     * {
     *     id:20,
     *     name : '人力资源部门',
     *     name_short : '人资部门',
     *     type:'3',
	 *     leader:12,
	 * 	   reporter:12,
     *     parent_id:10,
     *     sort_no:1
     *     children:[]
     * }
     */
	async treeDropList(ctx) {
		let result = await organizationService.getTreeDropList(ctx.user_info.company_id);
		if (result) {
			ctx.success(result);
		} else {
			ctx.error();
		}
	}

}

export default new OrganizationController();