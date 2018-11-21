'use strict';
import Router from 'koa-router';
import resourceController from '../../controller/core/resource';

const resource = new Router({
	prefix: '/core/resource'
});

resource.post('/create', resourceController.create);
resource.post('/update', resourceController.update);
resource.delete('/delete', resourceController.delete);
resource.get('/details/:resource_id', resourceController.details);
resource.get('/treeList', resourceController.treeList);
module.exports = resource;