'use strict';
import Router from 'koa-router';
import oauthController from '../../controller/core/oauth';

const oauth = new Router({
	prefix: '/core/oauth'
});

oauth.post('/login', oauthController.login);
oauth.post('/logout',oauthController.logout);

module.exports=oauth;