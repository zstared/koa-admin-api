const config = {

    origin: 'https://www.zhengxinhong.top:8084',

    /**监听端口 */
    port: 8084,

    /**数据库连接配置 */
    mysql_host: '127.0.0.1',
    mysql_port: 3306,
    mysql_db: 'xinhong_admin',
    mysql_userid: 'root',
    mysql_password: 'Abc@123456',

    /**redis连接配置 */
    redis_host: '127.0.0.1',
    redis_port: 6379,
    redis_password: 'dev@123456',
    redis_session_db: 1,
};

export default config;