import BaseController from '../../lib/base_controller';
import parameterValidate from '../../lib/parameter_validate';
import userService from '../../service/core/user';
/**
 * @apiDefine ResultError
 *
 * @apiError  (Error) {Number} code  错误编号，如1000、1001、2001等
 * @apiError (Error) {String} message 提示
 *
 * @apiErrorExample   {json} Error-Response:
 *     {
 *       code: 1000,
 *       message:"System Exception"
 *     }
 */

/**
 * @apiDefine ResultSuccess
 *
 * @apiSuccess  (Response) {Number} code  0
 * @apiSuccess  (Response) {String} message 提示
 * @apiSuccess  (Response) {Object} data 数据对象{} 
 *
 * @apiSuccessExample   {json} Success-Response:
 *     {
 *       code: 0,
 *       message:"Success",
 *       data:{}
 *     }
 */

/**
 * @apiDefine ResultSuccessList
 *
 * @apiSuccess  (Response) {Number} code  0
 * @apiSuccess  (Response) {String} message 提示
 * @apiSuccess  (Response) {Object[]} data 数据列表[] 
 *
 * @apiSuccessExample   {json} Success-Response:
 *     {
 *       code: 0,
 *       message:"Success",
 *       data:[]
 *     }
 */

/**
 * @apiDefine ResultSuccessPageList
 *
 * @apiSuccess  (Response) {Number} code  0
 * @apiSuccess  (Response) {String} message 提示
 * @apiSuccess  (Response) {Object} data 数据对象{}
 * @apiSuccess  (Response) {Number} data.count  数据总记录数
 * @apiSuccess  (Response) {Number} data.page_index  页码
 * @apiSuccess  (Response) {Number} data.page_size  每页记录数
 * @apiSuccess  (Response) {Boolean} data.is_more    是否还能加载数据
 * @apiSuccess  (Response) {Boolean} data.is_paging  是否分页
 * @apiSuccess  (Response) {Object[]} data.rows 数据列表[]
 *
 * @apiSuccessExample   {json} Success-Response:
 *     {
 *       code: 0,
 *       message:"Success",
 *       data:{
 *          rows:[],
 *          count:90,
 *          page_index:1,
 *          page_size:20,
 *          is_more:true,
 *          is_paging:true      
 *       }
 *     }
 */

/**
 * @apiDefine Header
 * @apiHeader {String} token 用户唯一标识
 */

/**
 * 用户接口
 * @extends BaseController
 */
class UserController extends BaseController {
	constructor() {
		super();
	}


	/**
	 * 新增用户
	 * @api {post} /core/user/create 1.新增用户
	 * @apiName create
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {String} user_name 账号
	 * @apiParam  {String} password 密码
	 * @apiParam  {Number} sex 性别 1-男；2-女；
	 * @apiParam  {String} mail 邮箱
	 * @apiParam  {String} name_cn 姓名
	 * @apiParam  {String} name_en 英文名
	 * @apiParam  {String} mobile 手机号码
	 * @apiParam  {Number} role[] 角色ID[]
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     user_name : 'bruce',
	 *     password:'',
	 *     sex : 1,
	 *     mail : 'bruce@163.com',
	 *     mobile :'13922889900',
	 *     role:['1','3']
	 * }
	 */
	async create(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				user_name: {
					type: 'string',
					min: 3,
					max: 50
				},
				password: {
					required: false,
					type: 'string',
					allowEmpty: true,
					min: 4,
					max: 50
				},
				sex: {
					type: 'enum',
					values: [1, 2],
					convertType: 'int'
				},
				name_cn: {
					type: 'string',
					allowEmpty: true,
					min: 1,
					max: 50
				},
				name_en: {
					type: 'string',
					allowEmpty: true,
					required: false,
					min: 1,
					max: 50
				},
				mail: {
					type: 'email',
					required: false,
					allowEmpty: true
				},
				mobile: {
					type: 'mobile',
				},
				role: {
					type: 'array',
					itemType: 'number'
				}
			};
			parameterValidate.validate(validRule, params);
			let result = await userService.create(params);
			if (result) {
				ctx.success();
			} else {
				ctx.error();
			}
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 修改用户
	 * @api {post} /core/user/update 2.修改用户
	 * @apiName update
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} id 用户id
	 * @apiParam  {String} password 密码
	 * @apiParam  {Number} sex 性别 1-男；2-女；
	 * @apiParam  {String} mail 邮箱
	 * @apiParam  {String} name_cn 姓名
	 * @apiParam  {String} name_en 英文名
	 * @apiParam  {String} mobile 手机号码
	 * @apiParam  {Number} role[] 角色ID[]
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     id : '1',
	 *     password : '',
	 *     sex : 1,
	 *     mail : 'bruce@163.com',
	 *     mobile :'13922889900',
	 * }
	 */
	async update(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				id: {
					type: 'int',
					convertType: 'int'
				},
				password: {
					required: false,
					type: 'string',
					allowEmpty: true,
					min: 4,
					max: 50
				},
				name_cn: {
					type: 'string',
					allowEmpty: true,
					min: 1,
					max: 50
				},
				name_en: {
					type: 'string',
					allowEmpty: true,
					required: false,
					min: 1,
					max: 50
				},
				sex: {
					type: 'enum',
					values: [1, 2],
					convertType: 'int',
				},
				mail: {
					type: 'email',
					allowEmpty: true,
					required: false,
				},
				mobile: {
					type: 'mobile',
					allowEmpty: true
				},
				role: {
					type: 'array',
					min: 1
				}
			};
			parameterValidate.validate(validRule, params);
			let result = await userService.update(params);
			if (result) {
				ctx.success();
			} else {
				ctx.error();
			}
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 修改用户状态
	 * @api {post} /core/user/updateState 3.修改用户状态
	 * @apiName updateState
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} id 用户id
	 * @apiParam  {Number} status 状态 0-正常；1-禁用；
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     id : '1',
	 *     status : 1,
	 * }
	 */
	async updateState(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				id: {
					type: 'int',
					convertType: 'int'
				},
				status: {
					type: 'enum',
					values: [0, 1],
					convertType: 'int',
				},
			};
			parameterValidate.validate(validRule, params);
			let result = await userService.updateState(params);
			if (result) {
				ctx.success();
			} else {
				ctx.error();
			}
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 
	 * @api {post} /core/user/updatePassword 4.修改密码
	 * @apiName updatePassword
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {String} user_name 用户名
	 * @apiParam  {String} old_password 旧密码
	 * @apiParam  {String} new_password 新密码
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     user_name : 'test',
	 *     old_password : 'abc123',
	 *     new_password : '123abc'
	 * }
	 */
	async updatePassword(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				user_name: {
					type: 'string',
					min: 3,
					max: 50
				},
				old_password: {
					type: 'string',
					min: 4,
					max: 50
				},
				new_password: {
					type: 'string',
					min: 4,
					max: 50
				},
			};
			parameterValidate.validate(validRule, params);
			let result = await userService.updatePassword(params);
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
	 * 删除用户
	 * @api {post} /core/user/delete 5.删除用户
	 * @apiName delete
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} id 用户id
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     id : '1',
	 * }
	 */
	async delete(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				id: {
					type: 'int',
					convertType: 'int'
				}
			};
			parameterValidate.validate(validRule, params);
			let result = await userService.delete(params);
			if (result) {
				ctx.success();
			} else {
				ctx.error();
			}
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 用户详情
	 * @api {get} /core/user/details/:id 6.用户详情
	 * @apiName details
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 */
	async details(ctx) {
		try {
			const params = ctx.params;
			//接口参数验证规则
			const validRule = {
				id: {
					type: 'int',
					convertType: 'int'
				}
			};
			parameterValidate.validate(validRule, params);
			let result = await userService.details(params);
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
	 * 获取用户列表
	 * @api {get} /core/user/list/ 7.获取用户列表
	 * @apiName list
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccessList
	 * @apiParam  {String} user_name 用户名
	 * @apiParam  {Number} mobile 手机号码
	 * @apiParam  {Number} status  状态0-正常；1-禁用
	 * @apiParam  {String} sorter 排序字段 '字段名|排序规则'
	 * @apiSuccess  (Response) {String} data.user_name 用户名
	 * @apiSuccess  (Response) {String} data.mobile 手机号码
	 * @apiSuccess  (Response) {Number} data.sex 性别1-男；2-女
	 * @apiSuccess  (Response) {Number} data.status 状态；0-正常；1-禁用；2-删除
	 * @apiSuccess  (Response) {String} data.mail 邮箱
	 * @apiSuccess  (Response) {Date} data.create_time 创建时间
	 * @apiSuccess  (Response) {Number} data.is_system 是否为内置账号
	 * @apiSuccessExample  {json} data :
	 * {
	 *     user_name : 'test',
	 *     mobile : '13922882541',
	 *     sex : 1,
	 *     status : 0,
	 *     mail : 'test@163.com',
	 *     create_time : '2018-11-14T01:23:57.000Z',
	 * }
	 */
	async list(ctx) {
		try {
			const params = ctx.request.query;
			const validRule = {
				user_name: {
					allowEmpty: true,
					type: 'string',
					required: false,
				},
				mobile: {
					allowEmpty: true,
					type: 'string',
					required: false,
				},
				status: {
					allowEmpty: true,
					type: 'string',
					required: false,
				},
				sorter: {
					required: false,
					allowEmpty: true,
					type: 'order',
				}
			};
			parameterValidate.validate(validRule, params);
			let result = await userService.getList(params);
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
	 * 获取用户分页列表
	 * @api {get} /core/user/pageList/ 8.获取用户分页列表
	 * @apiName pageList
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccessPageList
	 * @apiParam  {String} user_name 用户名
	 * @apiParam  {Number} mobile 手机号码
	 * @apiParam  {Number} status  状态0-正常；1-禁用
	 * @apiParam  {String} page_index 页码
	 * @apiParam  {String} page_size 页记录数
	 * @apiParam  {String} sorter 排序字段 '字段名|排序规则'
	 * @apiSuccess  (Response) {String} data.rows.user_name 用户名
	 * @apiSuccess  (Response) {String} data.rows.mobile 手机号码
	 * @apiSuccess  (Response) {Number} data.rows.sex 性别1-男；2-女
	 * @apiSuccess  (Response) {Number} data.rows.status 状态；0-正常；1-禁用；2-删除
	 * @apiSuccess  (Response) {String} data.rows.mail 邮箱
	 * @apiSuccess  (Response) {Date} data.rows.create_time 创建时间
	 * @apiSuccess  (Response) {Number} data.is_system 是否为内置账号
	 * @apiSuccessExample  {json} data.rows :
	 * {
	 *     user_name : 'test',
	 *     mobile : '13922882541',
	 *     sex : 1,
	 *     status : 0,
	 *     mail : 'test@163.com',
	 *     create_time : '2018-11-14T01:23:57.000Z',
	 * }
	 */
	async pageList(ctx) {
		try {
			const params = ctx.request.query;
			const validRule = {
				user_name: {
					allowEmpty: true,
					type: 'string',
					required: false,
				},
				mobile: {
					allowEmpty: true,
					type: 'string',
					required: false,
				},
				status: {
					allowEmpty: true,
					type: 'string',
					required: false,
				},
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
				}
			};
			parameterValidate.validate(validRule, params);
			let result = await userService.getPageList(params);
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
	 * 关联角色
	 * @api {post} /core/user/relateRole 9.关联角色
	 * @apiName relateRole
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} id 用户ID
	 * @apiParam  {Number[]} role[] 角色ID[]
	 */
	async relateRole(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				id: {
					type: 'int',
					convertType: 'int'
				},
				role: {
					type: 'array',
				}
			};
			parameterValidate.validate(validRule, params);
			let result = await userService.relateRole(params);
			if (result) {
				ctx.success();
			} else {
				ctx.error();
			}
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 关联资源(赋权限)
	 * @api {post} /core/user/relateResource A10.关联资源(赋权限)
	 * @apiName relateResource
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} id 用户ID
	 * @apiParam  {Number[]} resource_list[] 资源ID[]
	 */
	async relateResource(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				id: {
					type: 'int',
					convertType: 'int'
				},
				resource_list: {
					type: 'array',
				}
			};
			parameterValidate.validate(validRule, params);
			let result = await userService.relateResource(params);
			if (result) {
				ctx.success();
			} else {
				ctx.error();
			}
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 当前用户信息
	 * @api {get} /core/user/current A11.当前用户信息
	 * @apiName current
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 */
	async current(ctx) {
		try {
			const params = {
				id: ctx.user_info.id
			};
			//接口参数验证规则
			let user_info = {};
			user_info.base = await userService.details(params);
			if (user_info.base) {
				user_info.menus = await userService.getMenus(params.id); //用户菜单
				ctx.success(user_info);
			} else {
				ctx.error();
			}
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	/**
	 * 修改当前用户信息
	 * @api {get} /core/user/updateCurrent A12.修改当前用户信息
	 * @apiName updateCurrent
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} id 用户id
	 * @apiParam  {String} password 密码
	 * @apiParam  {Number} sex 性别 1-男；2-女；
	 * @apiParam  {String} mail 邮箱
	 * @apiParam  {String} mobile 手机号码
	 * @apiParam  {Number} role[] 角色ID[]
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     id : '1',
	 *     password : '',
	 *     sex : 1,
	 *     mail : 'bruce@163.com',
	 *     mobile :'13922889900',
	 * }
	 */
	async updateCurrent(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				name_cn: {
					type: 'string',
					allowEmpty: true,
					min: 1,
					max: 50
				},
				name_en: {
					type: 'string',
					allowEmpty: true,
					min: 1,
					max: 50
				},
				sex: {
					type: 'enum',
					values: [1, 2],
					convertType: 'int',
				},
				mail: {
					type: 'email',
					allowEmpty: true
				},
				mobile: {
					type: 'mobile',
					allowEmpty: true
				}
			};
			params.id = ctx.user_info.id;
			parameterValidate.validate(validRule, params);
			let result = await userService.update(params);
			if (result) {
				ctx.success();
			} else {
				ctx.error();
			}
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 判断账号是否存在
	 * @api {get} /core/user/existAccount A13.判断账号是否存在
	 * @apiName existAccount
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} user_name 账号
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     user_name : 'test',
	 * }
	 */
	async existAccount(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				user_name: {
					type: 'string',
					min: 1,
					max: 50
				},
			};
			parameterValidate.validate(validRule, params);
			let result = await userService.existAccount(params.user_name);
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
	 * 判断手机号是否存在
	 * @api {get} /core/user/existMobile A14.判断手机号是否存在
	 * @apiName existMobile
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} mobile 手机号码
	 * @apiParam  {Number} id? 用户ID
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     mobile : '13922882541',
	 *     id: '2'
	 * }
	 */
	async existMobile(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				mobile: {
					type: 'mobile',
				},
				id: {
					type: 'int',
					convertType: 'int',
					required: false
				},

			};
			parameterValidate.validate(validRule, params);
			let result = await userService.existMobile(params.mobile, params.id);
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
	 * 获取用户权限
	 * @api {get} /core/user/permisson A15.获取用户权限
	 * @apiName permisson
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} id 用户ID
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     id: '2'
	 * }
	 */
	async permission(ctx) {
		try {
			const params = ctx.request.query;
			//接口参数验证规则
			const validRule = {
				id: {
					type: 'int',
					convertType: 'int'
				},
			};
			parameterValidate.validate(validRule, params);
			//接口参数验证规则
			let result = await userService.getPermission(params.id);
			if (result) {
				ctx.success(result);
			} else {
				ctx.error();
			}
		} catch (e) {
			throw e;
		}
	}
}

export default new UserController();