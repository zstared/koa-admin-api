'use strict';
import Router from 'koa-router';
import userController from '../../controller/core/user';

const user = new Router({
	prefix: '/core/user'
});

user.post('/updatePassword',userController.updatePassword);
user.post('/create',userController.create);
user.post('/update',userController.update);
user.post('/updateState',userController.updateState);
user.post('/delete',userController.delete);
user.get('/details/:id',userController.details);
user.get('/list',userController.list);
user.get('/pageList', userController.pageList);
user.post('/relateRole', userController.relateRole);
user.post('/relateResource', userController.relateResource);
user.get('/current', userController.current);
user.post('/updateCurrent', userController.updateCurrent);
user.post('/existAccount', userController.existAccount);
user.post('/existMobile', userController.existMobile);
user.get('/permission', userController.permission);
module.exports=user;