'use strict';
import Router from 'koa-router';
import recognizeController from '../../controller/face_recognition/recognize';

const recognize = new Router({
    prefix: '/face_recognition/recognize'
});

recognize.post('/detect', recognizeController.detect);
recognize.post('/matching', recognizeController.matching);
recognize.get('/sprite', recognizeController.sprite);
recognize.get('/pageList', recognizeController.pageList);
module.exports = recognize;