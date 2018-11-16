'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

/**
 * @module 请求返回结果封装 
 */
exports.default = async (ctx, next) => {

	/**
     * @method 请求成功的返回结果
     * @param {Object} data 
     * @param {String} msg 
     */
	ctx.success = function (data = {}, msg = 'Request Success') {
		ctx.body = {
			code: 200,
			data: data,
			message: msg
		};
	};

	/**
     * @method 请求失败的返回结果
     * @param {*} code 
     * @param {*} msg 
     */
	ctx.error = function (code = 500, msg = 'System Exception') {
		ctx.body = {
			code: code,
			message: msg
		};
	};
};