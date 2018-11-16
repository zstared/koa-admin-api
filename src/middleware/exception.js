import {
	ErrorDesc
} from '../lib/enum';
import log4js from '../lib/log';
const logger = log4js.logger('app');
//异常捕获
export default async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		console.log(err);
		ctx.body = {
			code: err.code || 1000,
			message: err.msg || 'System Exception',
			desc: err.desc || ErrorDesc[err.code] || err.message || 'System Exception'
		};
		logger.error('【error】', 'message:', err.msg || '', 'desc:', err.desc || ErrorDesc[err.code] || err.message || 'System Exception');
		logger.error('【stack】\n ', err.stack || '');
	}
};