import sequelize from '../db_init';
const Op = sequelize.Op;
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
     * 根据code获取文件信息
     * @param {string} code 
     */
	async getFileByCode(code) {
		return await t_file.findOne({
			attributes: ['id',['code','uid'], 'code','type', 'name', 'size', 'directory','ext',[sequelize.fn('CONCAT',sequelize.col('origin'),sequelize.col('thumb_path')),'thumbUrl'],[sequelize.fn('CONCAT',sequelize.col('origin'),sequelize.col('path')),'src']],
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
			attributes: ['id', ['code','uid'],'code','type', 'name', 'size', 'directory','ext',[sequelize.fn('CONCAT',sequelize.col('origin'),sequelize.col('thumb_path')),'thumbUrl'],[sequelize.fn('CONCAT',sequelize.col('origin'),sequelize.col('path')),'src']],
			where: {
				code:{
					[Op.in]: codes
				}
			}
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
				code:{
					[Op.in]:codes
				}
			}
		});
	}


}
export default new FileModel();