'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _koaRouter2.default)(); // app/routes/index.js


_fs2.default.readdirSync(__dirname).filter(file => file.indexOf('.') !== 0 && file.split('.').slice(-1)[0] === 'js' && file !== 'index.js').forEach(file => {
	console.log(file);
	const route = require(_path2.default.join(__dirname, file));
	router.use(route.routes(), route.allowedMethods());
});

// 把根路由/放在最后，以免当其他路由后面带有/时匹配到根路由
router.get('/', (ctx, next) => {
	ctx.body = 'home page';
});

module.exports = router;