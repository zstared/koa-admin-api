'use strict';
import Router from 'koa-router';
import resourceController from '../../controller/core/resource';

const resource = new Router({
	prefix: '/core/resource'
});

resource.post('/create', resourceController.create);
resource.post('/update', resourceController.update);
resource.post('/delete', resourceController.delete);
resource.get('/details/:id', resourceController.details);
resource.get('/treeList', resourceController.treeList);
resource.get('/treeDropList', resourceController.treeDropList);
resource.get('/treePermissionList', resourceController.treePermissionList);
resource.post('/existResource', resourceController.existResource);
resource.post('/existResourceCode', resourceController.existResourceCode);
module.exports = resource;