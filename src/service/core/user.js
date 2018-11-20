import ApiError from '../../lib/api_error';
import {
	ErrorCode
} from '../../lib/enum';
import m_user from '../../model/core/user';
import {
	md5,
	randomString
} from '../../lib/utils';
import config from '../../config';
import RedisClient from '../../lib/redis';
import {
	isNull
} from '../../lib/utils';
import {
	Op
} from 'sequelize';
const redis = new RedisClient();
class UserService {
	constructor() {}
	/**
	 * 登录
	 * @param {Object} params 
	 */
	async login(params) {
		try {
			const {
				user_name,
				password
			} = params;
			let user = await m_user.getUserByName(user_name);
			if (!user) {
				throw new ApiError(ErrorCode.ParamError, '用户名或密码有误');
			}
			user = await m_user.getUserByName(user_name, md5(password + user.encrypt));
			if (!user) {
				throw new ApiError(ErrorCode.ParamError, '用户名或密码有误');
			}
			if (user.state === 1) {
				throw new ApiError(ErrorCode.VerifyFail, '用户已禁用');
			}
			if (user.state === 2) {
				throw new ApiError(ErrorCode.VerifyFail, '用户已注销');
			}
			let token = md5(user.user_name + Date.now().toString());

			let sign_token = await redis.get(config.session_token_prefix + user.user_name);
			if (config.only_sign) {
				//唯一登录
				if (sign_token) {
					await redis.del(config.session_user_prefix + sign_token);
				}
			} else {
				if (sign_token) {
					token = sign_token;
				}
			}
			await redis.set(config.session_token_prefix + user.user_name, token, config.session_ttl); //设置token 缓存
			let result = {
				user_name: user.user_name,
				state: user.state,
				sex: user.sex,
				mobile: user.mobile
			};
			redis.set(config.session_user_prefix + token, JSON.stringify(result), config.session_ttl); //设置用户缓存
			return {
				token: token
			};

		} catch (e) {
			throw e;
		}
	}

	/**
	 * 退出登录
	 * @param {Object} params
	 */
	async logout(params) {
		const {
			user_name
		} = params;
		const token = await redis.get(config.session_token_prefix + user_name);
		if (token) {
			await redis.del(config.session_user_prefix + token);
			await redis.del(config.session_token_prefix + user_name);
			return true;
		}else{
			return false;
		}
	}

	/**
	 * 修改密码
	 * @param {Object} params 
	 */
	async updatePassword(params) {
		const {
			user_name,
			old_password,
			new_password
		} = params;
		let user = await m_user.getUserByName(user_name);
		if (!user) {
			throw new ApiError(ErrorCode.VerifyFail, '用户名或旧密码有误');
		}
		user = await m_user.getUserByName(user_name, md5(old_password + user.encrypt));
		if (!user) {
			throw new ApiError(ErrorCode.VerifyFail, '用户名或旧密码有误');
		}

		const encrypt = randomString(16); //密码加盐
		let result = await m_user.updatePassword(user.user_id, md5(new_password + encrypt), encrypt);
		return result[0];

	}


	/**
	 * 新增用户
	 * @param {Object} params 
	 */
	async create(params) {
		const {
			user_name,
			sex,
			mail,
			mobile,
			password,
		} = params;
		let user = await m_user.getUserByName(user_name);
		if (user) {
			throw new ApiError(ErrorCode.VerifyFail, '用户名已存在');
		}
		user ={
			user_name,
			sex,
			mail,
			mobile,
			password
		};
		user.encrypt = randomString(16);
		user.password = md5((user.password ? user.password : config.core.default_password) + user.encrypt);
		let result = await m_user.create(user);
		return result;
	}

	/**
	 * 修改用户
	 * @param {*} params 
	 */
	async update(params) {
		const {
			user_id,
			sex,
			mail,
			mobile,
			password,
		} = params;
		let user = {
			user_id: user_id,
		};
		const user_exist = await m_user.getUserById(user_id);
		if (!user_exist) {
			throw new ApiError(ErrorCode.ParamError, '用户ID不存在');
		}
		if (sex != null) {
			user.sex = sex;
		}
		if (mail) {
			user.mail = mail;
		}
		if (mobile) {
			user.mobile;
		}
		if (password) {
			user.encrypt = randomString(16);
			user.password = md5((user.password ? user.password : config.core.default_password) + user.encrypt);
		}

		let result = await m_user.update(user);
		return result[0];
	}

	/**
	 * 更新用户状态
	 * @param {*} params 
	 */
	async updateState(params) {
		const {
			user_id,
			state,
		} = params;
		let user = {
			user_id,
			state
		};
		let result = await m_user.update(user);
		return result[0];
	}

	/**
	 * 删除用户
	 * @param {*} params 
	 */
	async delete(params) {
		const {
			user_id
		} = params;
		let result = await m_user.delete(user_id);
		return result;
	}

	/**
	 * 根据ID获取用户详情信息
	 * @param {*} params 
	 */
	async details(params) {
		const {
			user_id
		} = params;
		return await m_user.getUserById(user_id, ['user_id', 'user_name', 'sex', 'mail', 'mobile', 'state']);
	}

	/**
	 * 获取用户列表
	 * @param {*} params 
	 */
	async getList(params) {
		const {
			user_name,
			mobile,
			state,
			orderBy
		} = params;
		let where = {};
		if (!isNull(user_name)) {
			where.user_name = {
				[Op.like]: user_name + '%'
			};
		}
		if (!isNull(mobile)) {
			where.mobile = {
				[Op.like]: mobile + '%'
			};
		}
		if (!isNull(state)) {
			where.state = state;
		}
		let order=[['is_system','desc'],['create_time']];//排序
		if(orderBy){
			order.unshift(orderBy.split('|'));
		}
		let attr = ['user_id', 'user_name', 'sex', 'mail', 'mobile', 'state','create_time'];
		return await m_user.getList(attr, where, order);
	}
}
export default new UserService();