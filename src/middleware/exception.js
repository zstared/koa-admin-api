import {
	ErrorDesc
} from '../lib/enum';
import log4js from '../lib/log';
import { getClientIp } from '../lib/utils';
import m_log from '../service/core/log';
const logger = log4js.logger('app');
//异常捕获
export default async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		console.log(err);
		let body={
			code: err.code || 1000,
			message: err.msg || 'System Exception',
			desc: err.desc || ErrorDesc[err.code] || err.message || 'System Exception'
		};
		ctx.body = body;
		logger.error('【error】', 'message:', err.msg || '', 'desc:', err.desc || ErrorDesc[err.code] || err.message || 'System Exception');
		logger.error('【stack】\n ', err.stack || '');
		log(ctx,body);
	}
};

async function log (ctx,body){
	const url = ctx.url.split('/');
	let params = ctx.request.body || ctx.params;
	console.log(body);
	let log = {
		system: url[0],
		module: url[1],
		action: url[2],
		path: ctx.url,
		params: params,
		state:0,
		error_code:body.code,
		message:body.message,
		description:body.desc,
		option_user: ctx.user_info ? JSON.parse(ctx.user_info).user_name : '',
		option_ip:getClientIp(ctx)
	};
	console.log(log);
	m_log.create(log);
}