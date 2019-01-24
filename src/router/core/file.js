'use strict';
import Router from 'koa-router';
import fileController from '../../controller/core/file';

const file = new Router({
	prefix: '/core/file'
});

file.post('/upload', fileController.upload);
file.get('/download', fileController.download);
file.get('/downloadPackage', fileController.downloadPackage);
 
module.exports = file;