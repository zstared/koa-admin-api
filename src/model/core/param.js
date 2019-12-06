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
			key: key,
			status:1
        };
        return await t_param.findOne({
            where: where
        });
    }
}

export default new ParamModel();