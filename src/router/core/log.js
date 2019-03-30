'use strict';
import Router from 'koa-router';
import logController from '../../controller/core/log';

const log = new Router({
	prefix: '/core/log'
});

log.get('/details/:id', logController.details);
log.get('/pageList', logController.pageList);
module.exports = log;