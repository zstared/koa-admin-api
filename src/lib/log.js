import log4js from 'log4js';

import config from '../config';

log4js.configure({
	appenders: {
		cheese: {
			type: 'dateFile',
			filename: config.logfile,
			//maxLogSize: 20480, //当超过maxLogSize大小时，会自动生成一个新文件
			//backups: 3,
			pattern: 'yyyy-MM-dd.log',
			alwaysIncludePattern: true,
		}
	},
	categories: { default: { appenders: ['cheese'], level: 'error' } }
});

exports.logger = function (name, level) {
	const logger = log4js.getLogger(name);
	logger.level=level||'info';
	return logger;
};