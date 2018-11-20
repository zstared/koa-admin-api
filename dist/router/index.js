'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _koaRouter2.default)(); // app/routes/index.js


console.log('加载路由配置...');
_fs2.default.readdirSync(__dirname).filter(file => file !== 'index.js').forEach(dir => {
	_fs2.default.readdirSync(_path2.default.join(__dirname, dir)).forEach(file => {
		console.log(file);
		const route = require(_path2.default.join(__dirname, dir, file));
		router.use(route.routes(), route.allowedMethods());
	});
});

console.log('路由配置已加载!');
module.exports = router;