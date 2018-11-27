'use strict';
import Router from 'koa-router';
import roleController from '../../controller/core/role';

const role = new Router({
	prefix: '/core/role'
});

role.post('/create', roleController.create);
role.post('/update', roleController.update);
role.delete('/delete', roleController.delete);
role.get('/details/:role_id', roleController.details);
role.get('/list', roleController.list);
role.get('/pageList', roleController.pageList);
role.post('/relateResource', roleController.relateResource);
module.exports = role;