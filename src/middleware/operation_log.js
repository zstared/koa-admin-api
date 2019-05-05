import m_log from '../service/core/log';
import {
	getClientIp
} from '../lib/utils';


const whiteList = [
	'/core/oauth/login',
	'/core/user/register',
	'/core/user/updatePassword'
];

/**
 * 记录操作日志
 * @param {Koa.Context} ctx
 */
export default async (ctx, next) => {
	if (ctx.method === 'GET') {
		await next();
	} else {
		const url = ctx.url.split('/');
		let params = ctx.request.body != {} ? ctx.request.body : ctx.params;
		let log = {
			system: url[0],
			module: url[1],
			action: url[2],
			path: ctx.url,
			params: params,
			option_user: ctx.user_info ? ctx.user_info.user_name : '',
			option_ip: getClientIp(ctx)
		};

		// 敏感信息不保存
		if (whiteList.findIndex((item) => {
			return item === ctx.url;
		}) > -1) {
			log.params = null;
			log.option_user = params.user_name;
		}
		
		await next();
		if (ctx.body && ctx.body.code === 0) {
			log.status = 1;
		} else {
			log.status = 0;
			log.error_code = ctx.body ? ctx.body.code : 1000000;
		}
		log.message = ctx.body?ctx.body.message:'';
		log.description = ctx.body?ctx.body.desc:'';
		m_log.create(log);
	}


};