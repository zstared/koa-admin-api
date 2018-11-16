'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _return_result = require('./middleware/return_result');

var _return_result2 = _interopRequireDefault(_return_result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//引入路由
const router = require('./router/index.js');
console.log(router);

//引入中间件


const app = new _koa2.default();

//挂载中间件
app.use(_return_result2.default);
app.use(_koaBodyparser2.default);

//挂载路由
app.use(router.routes());

app.listen(8081, () => {
	console.log('WebAPI服务已启动...');
});