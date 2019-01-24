import ApiError from '../../lib/api_error';
import {
	RCode
} from '../../lib/enum';
import m_user from '../../model/core/user';
import m_file from '../../model/core/file';
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
				throw new ApiError(RCode.core.C2000001, '用户名或密码有误');
			}
			user = await m_user.getUserByName(user_name, md5(password + user.encrypt));
			if (!user) {
				throw new ApiError(RCode.core.C2000001, '用户名或密码有误');
			}
			if (user.state === 1) {
				throw new ApiError(RCode.core.C2000003, '用户已禁用');
			}
			if (user.state === 2) {
				throw new ApiError(RCode.core.C2000004, '用户已注销');
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
				user_id: user.user_id,
				user_name: user.user_name,
				state: user.state,
				sex: user.sex,
				mobile: user.mobile
			};
			redis.set(config.session_user_prefix + token, JSON.stringify(result), config.session_ttl); //设置用户缓存
			return {
				token: token,
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
		} else {
			return false;
		}
	}

	/**获取用户菜单*/
	async getMenus() {
		return {
			menuData: [{
				resource_id: 1,
				icon: 'setting',
				name: '系统管理',
				path: '/system',
				locale: 'system',
				children: [{
					resource_id: 2,
					name: '用户管理',
					locale: 'system.user',
					path: '/system/user',
					permission: ['']
				},
				{
					resource_id: 3,
					name: '角色管理',
					locale: 'system.role',
					path: '/system/role'
				},
				{
					resource_id: 4,
					name: '菜单管理',
					locale: 'system.menu',
					path: '/system/menu'
				},
				{
					resource_id: 5,
					name: '资源管理',
					locale: 'system.resource',
					path: '/system/resource'
				},
				]
			}]
		};
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
			throw new ApiError(RCode.core.C2000005, '用户名或旧密码有误');
		}
		user = await m_user.getUserByName(user_name, md5(old_password + user.encrypt));
		if (!user) {
			throw new ApiError(RCode.core.C2000005, '用户名或旧密码有误');
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
			name_en,
			name_cn,
			password,
			role,
		} = params;
		let user = await m_user.getUserByName(user_name);
		if (user) {
			throw new ApiError(RCode.core.C2000000, '用户名已存在');
		}
		user = {
			user_name,
			sex,
			mail,
			mobile,
			name_en,
			name_cn,
			password,
			role,
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
			name_en,
			name_cn,
			password,
			role,
			avatar
		} = params;
		let user = {
			user_id,
			name_cn,
			name_en,
			avatar
		};
		const user_exist = await m_user.getDetailsById(user_id);
		if (!user_exist) {
			throw new ApiError(RCode.common.C1, '用户不存在');
		}
		if (sex != null) {
			user.sex = sex;
		}
		if (mail) {
			user.mail = mail;
		}
		if (mobile) {
			user.mobile = mobile;
		}
		if (role) {
			user.role = role;
		}
		if (password) {
			user.encrypt = randomString(16);
			user.password = md5((user.password ? user.password : config.core.default_password) + user.encrypt);
		}

		let result = await m_user.update(user, role ? true : false); //用户自己不能修改角色

		//更新文件关联
		if (result) {
			if (user_exist.avatar != user.avatar) {
				if (user_exist.avatar) {
					m_file.updateFileByCode(user_exist.avatar, null, null);
				}
				m_file.updateFileByCode(user.avatar, user.user_id, 'cs_user');
			}
		}

		return result;
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
		let result = await m_user.update(user, false);
		return result;
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
		let user_info = await m_user.getDetailsById(user_id, ['user_id', 'user_name', 'name_cn', 'name_en', 'avatar', 'sex', 'mail', 'mobile', 'state']);
		if (user_info.avatar) {
			let avatar_file = await m_file.getFileByCode(user_info.avatar);
			user_info.dataValues.avatar_file = avatar_file;
		}

		return user_info;
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
			order_by
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
		let order = [
			['is_system', 'desc'],
			['create_time']
		]; //排序
		if (order_by) {
			order.unshift(order_by.split('|'));
		}
		let attr = ['user_id', 'user_name', 'name_cn', 'name_en', 'avatar', 'sex', 'mail', 'mobile', 'state', 'create_time'];
		return await m_user.getList(attr, where, order);
	}

	/**
	 * 获取用户分页列表
	 * @param {*} _params 
	 */
	async getPageList(_params) {
		let {
			page_index,
			page_size,
			user_name,
			mobile,
			state,
			order_by,
		} = _params;

		let attrs = ' user_id,user_name,name_cn,name_en,avatar,sex,mail,mobile,state,create_time ';
		let table = ' cs_user ';
		let where = ' where 1=1 ';
		if (!isNull(user_name)) {
			user_name = user_name + '%';
			where += ' and (user_name like  :user_name or name_cn like :user_name or name_en like :user_name) ';
		}
		if (!isNull(mobile)) {
			mobile = mobile + '%';
			where += ' and mobile like  :mobile ';
		}
		if (!isNull(state)) {
			where += ' and state=:state ';
		}
		let order = ' order by  is_system desc,create_time ';
		if (!isNull(order_by)) {
			order = `order by ${order_by.split('|').join(' ')} `;
		}

		let params = {
			page_index,
			page_size,
			user_name,
			mobile,
			state
		};
		return await m_user.getPageList(params, attrs, table, where, order);
	}

	/**
	 * 关联角色
	 * @param {*} params 
	 */
	async relateRole(params) {
		const {
			user_id,
			role
		} = params;
		return await m_user.relateRole(user_id, role);
	}

	/**
	 * 关联资源（菜单、权限、接口)
	 * @param {*} resource_user
	 */
	async relateResource(resource_user) {
		const {
			user_id,
			resource_list
		} = resource_user;
		let list = [];
		for (let resource_id of resource_list) {
			list.push({
				user_id: user_id,
				resource_id: resource_id
			});
		}
		return await m_user.relateResource(user_id, list);
	}
}
export default new UserService();