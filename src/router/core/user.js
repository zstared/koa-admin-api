'use strict';
import Router from 'koa-router';
import userController from '../../controller/core/user';

const user = new Router({
	prefix: '/core/user'
});

user.post('/login', userController.login);
user.post('/logout',userController.logout);
user.post('/updatePassword',userController.updatePassword);
user.post('/create',userController.create);
user.post('/update',userController.update);
user.post('/updateState',userController.updateState);
user.delete('/delete',userController.delete);
user.get('/details/:user_id',userController.details);
user.get('/list',userController.list);
user.get('/pageList', userController.pageList);
user.post('/relateRole', userController.relateRole);
module.exports=user;