'use strict';
import Router from 'koa-router';
import tanabataController from '../../controller/xh/tanabata';

const tanabata = new Router({
	prefix: '/xh/tanabata'
});

tanabata.post('/create', tanabataController.create);
tanabata.post('/update', tanabataController.update);
tanabata.post('/delete', tanabataController.delete);
tanabata.get('/pageList', tanabataController.pageList);
module.exports = tanabata;