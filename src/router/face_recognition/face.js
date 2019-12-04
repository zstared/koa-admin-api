'use strict';
import Router from 'koa-router';
import faceController from '../../controller/face_recognition/face';

const face = new Router({
	prefix: '/face_recognition/face'
});

face.post('/create', faceController.create);
face.post('/update', faceController.update);
face.post('/delete', faceController.delete);
face.get('/doropList', faceController.dropList);
face.get('/pageList', faceController.pageList);

module.exports = face;