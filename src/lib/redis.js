import redis from 'redis';
import config from '../config';
import * as bluebird from 'bluebird';
class RedisClient {
	constructor(_options) {
		this.client = redis.createClient(Object.assign({
			host: config.redis_host,
			port: config.redis_port,
			auth_pass: config.redis_password,
			db: config.redis_session_db,
			// no_ready_check:true,
			// retry_strategy: function (options) {
			// 	if (options.error && options.error.code === 'ECONNREFUSED') {
			// 		//服务器拒绝连接
			// 		//return new Error('The server refused the connection');
			// 		console.log('服务器拒绝连接');
			// 	}
			// 	if (options.attempt > 10) {
			// 		//重连次数超过10
			// 		console.log('重连次数超过10');
			// 	}
			// 	//1s后重连
			// 	return Math.min(options.attempt * 100, 3000);
			// }
		}, _options));

		//错误监听
		this.client.on('error', function (err) {
			console.log(err);
		});

		//监控redis命令
		// this.client.monitor(function (err, res) {
		// 	if (!err) {
		// 		console.log('Entering monitoring mode.');
		// 	} else {
		// 		console.log(res);
		// 	}
		// });
		// this.client.on('monitor', function (time, args, raw_reply) {
		// 	console.log(time + ': ' + args, raw_reply);
		// });

		//Bluebird Promises 支持 async/await 
		bluebird.promisifyAll(this.client);
	}

	/**
	 * 获取
	 * @param {String} key 键
	 */
	async get(key) {
		try {
			let value = await this.client.getAsync(key);
			return value;
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 设置
	 * @param {String} key -键
	 * @param {String} value -值
	 * @param {String} ex -过期时长 单位S 默认一天 
	 */
	async set(key, value, ex = 60 * 60 * 24) {
		try {
			return await this.client.setAsync(key, value, 'EX', ex);
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 序列化设置 JSON.stringify
	 * @param {String} key -键
	 * @param {String} value -值
	 * @param {String} ex -过期时长 单位S 默认一天 
	 */
	async setSerializable(key, value, ex = 60 * 60 * 24) {
		try {
			const serializable = JSON.stringify(value);
			return await this.client.setAsync(key, serializable, 'EX', ex);
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 序列化获取 JSON.parse
	 * @param {String} key 键
	 */
	async getSerializable(key) {
		try {
			let value = await this.client.getAsync(key);
			return JSON.parse(value);
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 删除
	 * @param {String} key 键
	 */
	async del(key) {
		try {
			return await this.client.delAsync(key);
		} catch (e) {
			throw e;
		}
	}
}

export default RedisClient;