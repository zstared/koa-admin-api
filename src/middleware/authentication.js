import {
	RCode
} from '../lib/enum';
import ApiError from '../lib/api_error';
import config from '../config';
import RedisClient from '../lib/redis';
import {getLocale,isCn} from '../lib/locale';
const redis = new RedisClient();
const whiteList = [
	'/core/user/login',
	'/core/user/register'
];
/**
 * @module 请求返回结果封装 
 */
export default async (ctx, next) => {

	const url = ctx.url; //请求地址
	const token = ctx.header['token']; //请求头中的token
	const language=ctx.header['language'];//请求的语言
	if (whiteList.findIndex((item) => {
		return item === url;
	}) < 0) {
		//开发环境测试时设置token=config.test_token 跳过验证
		if(!(process.env.NODE_ENV == 'development' && token == config.test_token)){
			if (!token) {
				throw new ApiError(RCode.common.C1000001, isCn(language)?'缺少访问令牌【token】':getLocale(language)[RCode.common.C1000001]);
			}
			let user = await redis.get(config.session_user_prefix + token);
			if (!user) {
				throw new ApiError(RCode.common.C1000002, isCn(language)?'访问令牌【token】已过期或不存在,请重新登录!':getLocale(language)[RCode.common.C1000002]);
			}
			ctx.user_info=user;//缓存token用户信息
		}
	}

	/**
	 * @method 请求成功的返回结果
	 * @param {Object} data 
	 * @param {String} msg 
	 */
	ctx.success = function (data = {}) {
		ctx.body = {
			code: 0,
			data: data,
			message: getLocale(language)[RCode.common.C0]
		};
	};

	/**
	 * @method 请求失败的返回结果
	 * @param {*} code 
	 * @param {*} msg 
	 */
	ctx.error = function (code = 1000, msg = '请求失败!') {
		ctx.body = {
			code: code,
			message: isCn(language)?msg:getLocale(language)[code],
			desc:'',
			data:{}
		};
	};
	await next();
};