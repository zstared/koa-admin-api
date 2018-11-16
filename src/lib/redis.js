import redis from 'redis';
import config from '../config';
import * as bluebird from 'bluebird';
class RedisClient {
	constructor(_options) {
		this.client = redis.createClient(Object.assign({
			host: config.redis_host,
			port: config.redis_port,
			auth_pass: config.redis_password,
			db: config.redis_session_db
		}, _options));
		bluebird.promisifyAll(this.client);
	}

	/**
     * 获取值
     * @param {String} key 键
     */
	async get(key) {
		let value = await this.client.getAsync(key);
		return value;
	}

	/**
     * 设置键值
     * @param {String} key -键
     * @param {String} value -值
     * @param {String} ex -过期时长 单位S 默认一天 
     */
	async set(key, value, ex = 60 * 60 * 24) {
		return await this.client.setAsync(key, value, 'EX', ex);
	}
    
	/**
     * 删除
     * @param {String} key 键
     */
	async del(key){
		return await this.client.delAsync(key);
	}
}

export default RedisClient;