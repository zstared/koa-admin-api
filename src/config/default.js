export const config = {

	/**设置 signed cookie 的密钥 */
	app_keys: ['caihong', 'zxhlcl'],
	/**是否限制用户唯一登录 */
	only_sign: false,
	/**监听端口 */
	port: 8081,
	/**日志存储路径 */
	logfile: './logs/',

	/**用户token redis key前缀 */
	session_token_prefix: 'userId_',
	/**用户session redis key前缀 */
	session_user_prefix: 'sessionId_',
	/**用户session key*/
	session_key: 'sessionId',
	/**过期时间 */
	session_ttl: 60 * 60 * 24,

	core:{
		default_password:'abc123456',
	}
};


export default config;