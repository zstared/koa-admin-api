import ApiError from '../../lib/api_error';
import {
    RCode
} from '../../lib/enum';
import m_user from '../../model/core/user';
import m_role from '../../model/core/role';
import {
    md5,
} from '../../lib/utils';
import config from '../../config';
import RedisClient from '../../lib/redis';

const redis = new RedisClient();
class OauthService {
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
            if (user.status === 1) {
                throw new ApiError(RCode.core.C2000003, '用户已禁用');
            }
            if (user.status === 2) {
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
            let permissions = await this.getUserPermission(user.id);
            let user_info = {
                id: user.id,
                user_name: user.user_name,
                status: user.status,
                sex: user.sex,
                mobile: user.mobile,
                permissions:permissions
            };

            redis.setSerializable(config.session_user_prefix + token, user_info, config.session_ttl); //设置用户缓存
            return {
                token: token
            };

        } catch (e) {
            throw e;
        }
    }

    /**
     * 退出登录
     * @param {string} user_name
     */
    async logout(user_name) {
        const token = await redis.get(config.session_token_prefix + user_name);
        if (token) {
            await redis.del(config.session_user_prefix + token);
            await redis.del(config.session_token_prefix + user_name);
            return true;
        } else {
            return false;
        }
    }

    /**
     * 获取用户权限
     * @param {number} user_id 
     */
    async getUserPermission(user_id) {
        let roles = await m_user.getRoleByUserId(user_id);
        roles = roles.map(role => role.id);
        let role_permissions = await m_role.getPermissionByRoleIds(roles, true);
        let user_permissions = await m_user.getPermissionByUserId(user_id, true);
        return Array.from(new Set(role_permissions.concat(user_permissions)));
        
    }
}
export default new OauthService();