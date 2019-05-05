
import log4js from '../lib/log';
import {
	getClientIp
} from '../lib/utils';
import m_log from '../service/core/log';
const logger = log4js.logger('app');
import {
	getLocale,
	isCn
} from '../lib/locale';
//异常捕获
export default async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		console.log(err);
		const language = ctx.header['language']; //请求的语言
		console.log(language);
		let body = {
			code: err.msg ? err.code : 1000000,
			message: err.msg ? isCn(language) ? err.msg : getLocale(language)[err.code] : getLocale(language)['1000000'],
			desc: err.desc || err.message || getLocale(language)['1000000'],
			data: {}
		};
		ctx.body = body;
		logger.error('【error】', 'message:', err.msg || '', 'desc:', err.desc || err.message || 'System Exception');
		logger.error('【stack】\n ', err.stack || '');
		if (ctx.method !== 'GET') {
			log(ctx, body);
		}
	}
};

const whiteList = [
	'/core/oauth/login',
	'/core/user/register',
	'/core/user/updatePassword'
];

async function log(ctx, body) {
	const url = ctx.url.split('/');
	let params = ctx.request.body || ctx.params;
	console.log(body);
	let log = {
		system: url[0],
		module: url[1],
		action: url[2],
		path: ctx.url,
		params: params,
		status: 0,
		error_code: body.code,
		message: body.message,
		description: body.desc,
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
	m_log.create(log);
}