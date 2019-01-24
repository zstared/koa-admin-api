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
	 * @api {post} /core/user/login 1.登录
	 * @apiName login
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 *
	 * @apiParam  {String} user_name 用户名
	 * @apiParam  {String} password 密码
	 *
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiSuccess  (Response) {String} data.token token
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     user_name : 'test',
	 *     password : 'abc123'
	 * }
	 * @apiSuccessExample  {json} data :
	 * {
	 *     token : '0c461c4bb0d79ca8eef2bff810379fb3',
	 * }
	 *
	 *
	 */
	async login(ctx) {
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
					type: 'string',
					min: 4,
					max: 50
				},
			};
			//验证接口参数
			parameterValidate.validate(validRule, params);
			let user = await userService.login(params);
			ctx.success(user);
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 
	 * @api {post} /core/user/logout 2.退出、注销
	 * @apiName logout
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {String} user_name 用户名
	 * 
	 */
	async logout(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				user_name: {
					type: 'string',
					min: 3,
					max: 50
				},
			};
			parameterValidate.validate(validRule, params);
			let result = await userService.logout(params);
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
	 * @api {post} /core/user/updatePassword 3.修改密码
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
				ctx.success();
			} else {
				ctx.error();
			}
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 新增用户
	 * @api {post} /core/user/create 4.新增用户
	 * @apiName create
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {String} user_name 用户名
	 * @apiParam  {String} [password] 密码
	 * @apiParam  {Number} sex 性别 1-男；2-女；
	 * @apiParam  {String} mail 邮箱
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
					min: 1,
					max: 50
				},
				mail: {
					type: 'email',
					allowEmpty: true
				},
				mobile: {
					type: 'mobile',
				},
				role: {
					type: 'array',
					min: 1
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
	 * @api {post} /core/user/update 5.修改用户
	 * @apiName update
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} user_id 用户id
	 * @apiParam  {String} password 密码
	 * @apiParam  {Number} sex 性别 1-男；2-女；
	 * @apiParam  {String} mail 邮箱
	 * @apiParam  {String} mobile 手机号码
	 * @apiParam  {Number} role[] 角色ID[]
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     user_id : '1',
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
				user_id: {
					type: 'int',
					convertType: 'int'
				},
				password: {
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
	 * @api {post} /core/user/updateState 6.修改用户状态
	 * @apiName updateState
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} user_id 用户id
	 * @apiParam  {Number} state 状态 0-正常；1-禁用；
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     user_id : '1',
	 *     state : 1,
	 * }
	 */
	async updateState(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				user_id: {
					type: 'int',
					convertType: 'int'
				},
				state: {
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
	 * 删除用户
	 * @api {delete} /core/user/delete 7.删除用户
	 * @apiName delete
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} user_id 用户id
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     user_id : '1',
	 * }
	 */
	async delete(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				user_id: {
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
	 * @api {get} /core/user/details/:user_id 8.用户详情
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
				user_id: {
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
	 * @api {get} /core/user/list/ 9.获取用户列表
	 * @apiName list
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccessList
	 * @apiParam  {String} user_name 用户名
	 * @apiParam  {Number} mobile 手机号码
	 * @apiParam  {Number} state  状态0-正常；1-禁用
	 * @apiParam  {String} order_by 排序字段 '字段名|排序规则'
	 * @apiSuccess  (Response) {String} data.user_name 用户名
	 * @apiSuccess  (Response) {String} data.mobile 手机号码
	 * @apiSuccess  (Response) {Number} data.sex 性别1-男；2-女
	 * @apiSuccess  (Response) {Number} data.state 状态；0-正常；1-禁用；2-删除
	 * @apiSuccess  (Response) {String} data.mail 邮箱
	 * @apiSuccess  (Response) {Date} data.create_time 创建时间
	 * @apiSuccessExample  {json} data :
	 * {
	 *     user_name : 'test',
	 *     mobile : '13922882541',
	 *     sex : 1,
	 *     state : 0,
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
					type: 'string'
				},
				mobile: {
					allowEmpty: true,
					type: 'string'
				},
				state: {
					allowEmpty: true,
					type: 'string',
				},
				order_by: {
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
	 * @api {get} /core/user/pageList/ A10.获取用户分页列表
	 * @apiName pageList
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccessPageList
	 * @apiParam  {String} user_name 用户名
	 * @apiParam  {Number} mobile 手机号码
	 * @apiParam  {Number} state  状态0-正常；1-禁用
	 * @apiParam  {String} page_index 页码
	 * @apiParam  {String} page_size 页记录数
	 * @apiParam  {String} order_by 排序字段 '字段名|排序规则'
	 * @apiSuccess  (Response) {String} data.rows.user_name 用户名
	 * @apiSuccess  (Response) {String} data.rows.mobile 手机号码
	 * @apiSuccess  (Response) {Number} data.rows.sex 性别1-男；2-女
	 * @apiSuccess  (Response) {Number} data.rows.state 状态；0-正常；1-禁用；2-删除
	 * @apiSuccess  (Response) {String} data.rows.mail 邮箱
	 * @apiSuccess  (Response) {Date} data.rows.create_time 创建时间
	 * @apiSuccessExample  {json} data.rows :
	 * {
	 *     user_name : 'test',
	 *     mobile : '13922882541',
	 *     sex : 1,
	 *     state : 0,
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
					type: 'string'
				},
				mobile: {
					allowEmpty: true,
					type: 'string'
				},
				state: {
					allowEmpty: true,
					type: 'string',
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
				order_by: {
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
	 * @api {post} /core/user/relateRole A11.关联角色
	 * @apiName relateRole
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} user_id 用户ID
	 * @apiParam  {[Number[]]} role[] 角色ID[]
	 */
	async relateRole(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				user_id: {
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
	 * 关联资源
	 * @api {post} /core/user/relateResource A12.关联资源
	 * @apiName relateResource
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} user_id 用户ID
	 * @apiParam  {[Number[]]} resource_list[] 资源ID[]
	 */
	async relateResource(ctx) {
		try {
			const params = ctx.request.body;
			//接口参数验证规则
			const validRule = {
				user_id: {
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
	 * 获取用户菜单
	 * @api {get} /core/user/menus A13.获取用户菜单
	 * @apiName menus
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 */
	async menus(ctx) {
		try {
			let result = await userService.getMenus(ctx.user_info);
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
	 * 当前用户信息
	 * @api {get} /core/user/current A13.当前用户信息
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
				user_id: ctx.user_info.user_id
			};
			//接口参数验证规则
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
	 * 修改当前用户信息
	 * @api {get} /core/user/updateCurrent A14.修改当前用户信息
	 * @apiName updateCurrent
	 * @apiGroup  user
	 * @apiVersion  0.1.0
	 * 
	 * @apiUse  Header
	 * @apiUse  ResultError
	 * @apiUse  ResultSuccess
	 * @apiParam  {Number} user_id 用户id
	 * @apiParam  {String} password 密码
	 * @apiParam  {Number} sex 性别 1-男；2-女；
	 * @apiParam  {String} mail 邮箱
	 * @apiParam  {String} mobile 手机号码
	 * @apiParam  {Number} role[] 角色ID[]
	 * @apiParamExample  {Object} Request-Example:
	 * {
	 *     user_id : '1',
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
			params.user_id=ctx.user_info.user_id;
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
}

export default new UserController();