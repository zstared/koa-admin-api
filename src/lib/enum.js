/**
 * 错误编码对应描述
 * @enum {string}
 */
export const ErrorDesc={
	0:'Request Success!',
	1000:'System Exception',
	1001:'Missing access token',
	1002:'Access token expired or wrong',
	1003:'Request interface address error',

	2000:'Parameter error',
	2001:'Verification failure',
};


/**
 * 错误编码
 * @readonly
 * @enum {number}
 */
export const ErrorCode = {
	/**
     * 0-操作成功
     * 
     * */
	Success: 0,

	/**
     * 1000-服务端错误
     *
     */
	SystemError: 1000,

	/**
     * 1001-缺少访问令牌
     * 
     * */
	TokenLoss: 1001,

	/**
     * 1002-访问令牌已过期或错误
     * 
     *  */
	TokenError: 1001,

	/**
     *1003-请求接口地址有误
     *  
     */
	NotFound: 1002,

	/**
     * 2000-参数有误
     *
     */
	ParamError: 2000,

	/**
     * 2001-验证失败 
     * 
     */
	VerifyFail: 2001,

};
