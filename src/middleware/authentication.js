import {
	ErrorCode
} from '../lib/enum';
import ApiError from '../lib/api_error';
import config from '../config';
import RedisClient from '../lib/redis';
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
	if (whiteList.findIndex((item) => {
		return item === url;
	}) < 0) {
		//开发环境测试时设置token=123456 跳过验证
		if(!(process.env.NODE_ENV == 'development' && token == '123456')){
			if (!token) {
				throw new ApiError(ErrorCode.TokenLoss, '缺少访问令牌【token】');
			}
			let user = await redis.get(config.session_user_prefix + token);
			if (!user) {
				throw new ApiError(ErrorCode.TokenError, '访问令牌【token】已过期或不存在,请重新登录!');
			}
			ctx.userInfo=user;//缓存token用户信息
		}
	}

	/**
	 * @method 请求成功的返回结果
	 * @param {Object} data 
	 * @param {String} msg 
	 */
	ctx.success = function (data = {}, msg = '请求成功!') {
		ctx.body = {
			code: 0,
			data: data,
			message: msg
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
			message: msg,
			desc:'',
		};
	};
	await next();
};