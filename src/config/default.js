export const config = {


	test_token:'123456',

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
	
	
	/**上传文件限制  */
	uploadFileLimit:15*1024*1024,

	core:{
		default_password:'abc123456',
	},

	/**公开接口白名单  免token验证*/
	public_white_list:[
		'/core/oauth/login',
		'/core/oauth/register'
	],
	/**公共接口白名单 只需token验证*/
	common_white_list:[
		'/core/file/upload',
		'/core/file/download',
		'/core/oauth/logout',
		'/core/user/current',
		'/core/user/updatePassword',
		'/core/user/updateCurrent',

		'/core/table/columns',
		'/core/table/list',
		'/core/table/tableColumns',
		'/core/table/createColumn',
		'/core/table/updateColumn',
		'/core/table/deleteColumn',
		'/core/table/sortColum'
	]
};


export default config;