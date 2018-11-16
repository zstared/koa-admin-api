'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _base_controller = require('../lib/base_controller');

var _base_controller2 = _interopRequireDefault(_base_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UserController extends _base_controller2.default {
	constructor(props) {
		super(props);
	}

	/**@method 登录 */
	async login(ctx, next) {
		console.log(ctx);
		await next();
	}

}

exports.default = new UserController();