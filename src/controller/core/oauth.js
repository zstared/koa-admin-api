import BaseController from '../../lib/base_controller';
import parameterValidate from '../../lib/parameter_validate';
import oauthService from '../../service/core/oauth';

class OauthController extends BaseController {
	/**
     * @api {post} /core/oauth/login 1.登录
     * @apiName login
     * @apiGroup  oauth
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
			let user = await oauthService.login(params);
			ctx.success(user);
		} catch (e) {
			throw e;
		}
	}

	/**
     * 
     * @api {post} /core/oauth/logout 2.退出、注销
     * @apiName logout
     * @apiGroup  oauth
     * @apiVersion  0.1.0
     * 
     * @apiUse  Header
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * 
     */
	async logout(ctx) {
		try {

			let result = await oauthService.logout(ctx.user_info.user_name);
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

export default new OauthController();