'use strict';
import Router from 'koa-router';
import recognizeController from '../../controller/face_recognition/recognize';

const recognize = new Router({
  prefix: '/face_recognition/recognize'
});

recognize.post('/recognize', recognizeController.recognize);

module.exports = recognize;
