import sequelize from '../db_init';
const Op = sequelize.Sequelize.Op;
const t_file = require('../table/cs_file')(sequelize, sequelize.Sequelize);
class FileModel {
    constructor() {}

    /**
     * 新增文件
     * @param {object} file
     */
    async create(file) {
        return await t_file.create(file);
    }

    /**
     * 修改文件 
     * @param {object}} file 
     */
    async updateByCode(file) {
        return await t_file.update(file, {
            where: {
                code: file.code
            }
        });
    }

    /**
     * 根据code获取文件信息
     * @param {string} code 
     */
    async getFileByCode(code) {
        return await t_file.findOne({
            attributes: ['id', ['code', 'uid'], 'code', 'type', 'name', 'size', 'ext', [sequelize.fn('CONCAT', sequelize.col('origin'), sequelize.col('path_thumb')), 'thumbUrl'],
                [sequelize.fn('CONCAT', sequelize.col('origin'), sequelize.col('path')), 'src']
            ],
            where: {
                code: code
            }
        });
    }

    /**
     * 根据codes获取文件信息
     * @param {array} codes 
     */
    async getFileByCodes(codes) {
        return await t_file.findAll({
            attributes: ['id', ['code', 'uid'], 'code', 'type', 'name', 'size', 'directory', [sequelize.fn('CONCAT', sequelize.col('origin'), sequelize.col('path_thumb')), 'thumbUrl'],
                [sequelize.fn('CONCAT', sequelize.col('origin'), sequelize.col('path')), 'src']
            ],
            where: {
                code: {
                    [Op.in]: codes
                }
            },
            order: [
                ['id']
            ]
        });
    }

    /**
     * 根据codes获取人脸文件信息
     * @param {array} codes 
     */
    async getFaceFileByCodes(codes) {
        return await t_file.findAll({
            attributes: ['id', ['code', 'uid'], 'code', 'type', 'name', 'size', 'directory', [sequelize.fn('CONCAT', sequelize.col('origin'), sequelize.col('path_thumb')), 'thumbUrl'],
                [sequelize.fn('CONCAT', sequelize.col('origin'), sequelize.col('path')), 'src'],
                [sequelize.fn('CONCAT', sequelize.col('origin'), '/', sequelize.col('folder'), '/', sequelize.col('code'), '-face.', sequelize.col('ext')), 'faceSrc']
            ],
            where: {
                code: {
                    [Op.in]: codes
                }
            },
            order: [
                ['id']
            ]
        });
    }

    /**
     * 根据code修改文件关联信息
     * @param {string} code 文件唯一code 
     * @param {number} table_id  文件对应关联表ID
     * @param {string} table_name  文件对应关联表名称
     */
    async updateFileByCode(code, table_id, table_name) {

        return await t_file.update({
            code: code,
            table_id,
            table_name,
        }, {
            where: {
                code: code
            }
        });
    }

    /**
     * 根据code修改文件关联信息
     * @param {array} code 文件唯一code 
     * @param {number} table_id  文件对应关联表ID
     * @param {string} table_name  文件对应关联表名称
     */
    async updateFileByCodes(codes, table_id, table_name) {
        return await t_file.update({
            table_id,
            table_name,
        }, {
            where: {
                code: {
                    [Op.in]: codes
                }
            }
        });
    }

    /**
     * 根据code清除文件关联信息
     * @param {array} code 文件唯一code 
     */
    async clearFileByCode(code) {
        return await t_file.update({
            table_id: '',
            table_name: '',
        }, {
            where: {
                code: code
            }
        });
    }

    /**
     * 根据code清除文件关联信息
     * @param {array} codes 文件唯一code 
     */
    async clearFileByCodes(codes) {
        return await t_file.update({
            table_id: '',
            table_name: '',
        }, {
            where: {
                code: {
                    [Op.in]: codes
                }
            }
        });
    }


}
export default new FileModel();