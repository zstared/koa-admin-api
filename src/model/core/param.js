import sequelize from '../db_init';
const t_param = require('../table/cs_param')(sequelize, sequelize.Sequelize);
class ParamModel {
    constructor() {}

    /**
     * 根据key获取value
     * @param {*} key 
     */
    async getValueByKey(key) {
        let where = {
            param_key: key,
            status: 1
        };
        return await t_param.findOne({
            where: where
        });
    }

    /**
     * 修改参数
     * @param {object} param
     */
    async updateByKey(param) {
        return await t_param.update(param, {
            where: {
                param_key: param.param_key,
                is_constant: 0
            }
        });
    }

}

export default new ParamModel();