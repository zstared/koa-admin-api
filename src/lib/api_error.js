/**
 * @class 
 * @classdesc APIError 错误类型
 */
export default class ApiError extends Error {
	/**
     * @constructs 
     * @param {RCode} code -RCode 错误编码 
     * @param {string} msg 错误信息
     * @param {string} desc 错误描述
     */
	constructor(code = 1000, msg = '', desc = '') {
		super();
		this.code = code;
		this.msg = msg;
		this.desc = desc;
	}
}