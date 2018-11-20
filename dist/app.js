'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _koa2Cors = require('koa2-cors');

var _koa2Cors2 = _interopRequireDefault(_koa2Cors);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _authentication = require('./middleware/authentication.js');

var _authentication2 = _interopRequireDefault(_authentication);

var _exception = require('./middleware/exception');

var _exception2 = _interopRequireDefault(_exception);

var _enum = require('./lib/enum.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//路由
const router = require('./router/index.js');
//配置


//中间件


const app = new _koa2.default();

//挂载中间件
app.use((0, _koa2Cors2.default)());
app.use((0, _koaBodyparser2.default)());
app.use(_exception2.default);
app.use(_authentication2.default);

//挂载路由
app.use(router.routes());
app.use(async ctx => {
	ctx.error(_enum.ErrorCode.NotFound, `请求地址[${ctx.URL}]有误!`);
});

const server = app.listen(_config2.default.port, () => {
	console.log(`WebAPI服务已启动!监听端口${_config2.default.port}...`);
});

module.exports = server;