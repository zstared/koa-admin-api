'use strict';var _koa=require('koa'),_koa2=_interopRequireDefault(_koa),_path=require('path'),_path2=_interopRequireDefault(_path),_koaBody=require('koa-body'),_koaBody2=_interopRequireDefault(_koaBody),_koa2Cors=require('koa2-cors'),_koa2Cors2=_interopRequireDefault(_koa2Cors),_koaStatic=require('koa-static'),_koaStatic2=_interopRequireDefault(_koaStatic),_config=require('./config'),_config2=_interopRequireDefault(_config),_authentication=require('./middleware/authentication'),_authentication2=_interopRequireDefault(_authentication),_exception=require('./middleware/exception'),_exception2=_interopRequireDefault(_exception),_operation_log=require('./middleware/operation_log'),_operation_log2=_interopRequireDefault(_operation_log),_enum=require('./lib/enum.js');function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}const router=require('./router/index.js'),app=new _koa2.default;app.use((0,_koa2Cors2.default)()),app.use((0,_koaStatic2.default)(_path2.default.join(__dirname,'../public/static'))),app.use((0,_koaBody2.default)({multipart:!0,formidable:{multiples:!0,maxFileSize:_config2.default.uploadFileLimit}})),app.use(_exception2.default),app.use(_authentication2.default),app.use(_operation_log2.default),app.use(router.routes()),app.use(async a=>{a.error(_enum.RCode.common.C1000003,`请求地址[${a.URL}]有误!`)});const server=app.listen(_config2.default.port,()=>{console.log(`WebAPI服务已启动!监听端口${_config2.default.port}...`)});module.exports=server;