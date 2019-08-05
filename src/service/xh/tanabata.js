import ApiError from '../../lib/api_error';
import {
	RCode
} from '../../lib/enum';
import m_tanabata from '../../model/xh/tanabata';
import m_file from '../../model/core/file';

import {
	isNull
} from '../../lib/utils';


class PhotoService {
	constructor() {}


	/**
	 * 新增照片
	 * @param {Object} params 
	 */
	async create(params) {
		const tanabata = await m_file.getFileByCode(params.tanabata_code);
		if (!tanabata) {
			throw new ApiError(RCode.common.C1, '照片不存在');
		}
		let result = await m_tanabata.create(params);
		await m_file.updateFileByCode(result.tanabata_code, result.id, 'xh_tanabata');
		return result;
	}

	/**
	 * 修改照片
	 * @param {*} params 
	 */
	async update(params) {
		const {
			id,
			tanabata_code
		} = params;

		const tanabata_exist = await m_tanabata.getDetailsById(id);
		if (!tanabata_exist) {
			throw new ApiError(RCode.common.C1, '照片不存在');
		}

		let result=await m_tanabata.update(params);
		//更新文件关联
		if (result) {
			if (tanabata_exist.avatar != params.avatar) {
				if (tanabata_exist.avatar) {
					m_file.updateFileByCode(tanabata_exist.tanabata_code, null, null);
				}
				m_file.updateFileByCode(tanabata_code, id, 'xh_tanabata');
			}
		}

		return result;
	}

	/**
	 * 删除照片
	 * @param {*} params 
	 */
	async delete(params) {
		const {
			id
		} = params;
		const tanabata_exist = await m_tanabata.getDetailsById(id);
		let result = await m_tanabata.delete(id);
		await m_file.updateFileByCode(tanabata_exist.tanabata_code, null, null);
		return result;
	}

	/**
	 * 获取照片分页列表
	 * @param {*} _params 
	 */
	async getPageList(_params) {
		let {
			page_index,
			page_size,
			title,
			type,
			tag,
			sorter,
		} = _params;

		let attrs = ' a.*,CONCAT(b.origin,b.path) url,CONCAT(b.origin,b.thumb_path) thumb_url  ';
		let table = ' xh_tanabata a join cs_file b on a.tanabata_code=b.code ';
		let where = ' where 1=1 ';
		if (!isNull(title)) {
			title = title + '%';
			where += ' and a.title like :title  ';
		}
		if (!isNull(type)) {
			where += ' and type=type  ';
		}
		if (!isNull(tag)) {
			where += ' and tag=tag  ';
		}
		let order = ' order by  a.sort_no , a.create_time desc';
		if (!isNull(sorter)) {
			order = `order by ${sorter.split('|').join(' ')} `;
		}

		let params = {
			page_index,
			page_size,
			title
		};
		let pageList = await m_tanabata.getPageList(params, attrs, table, where, order);
		return pageList;
	}

	
}
export default new PhotoService();