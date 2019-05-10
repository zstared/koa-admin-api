'use strict';
import Router from 'koa-router';
import organizationController from '../../controller/core/organization';

const organization = new Router({
	prefix: '/core/organization'
});

organization.post('/create', organizationController.create);
organization.post('/update', organizationController.update);
organization.post('/delete', organizationController.delete);
organization.get('/details/:id', organizationController.details);
organization.get('/treeList', organizationController.treeList);
organization.get('/treeDropList', organizationController.treeDropList);
organization.post('/existOrganization', organizationController.existOrganization);
module.exports = organization;