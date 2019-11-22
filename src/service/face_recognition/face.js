import ApiError from '../../lib/api_error';
import {
	RCode
} from '../../lib/enum';
import m_face from '../../model/face_recognition/face';
import {
	isNull
} from '../../lib/utils';
import {
	Op
} from 'sequelize';
class FaceService {
	constructor() {}

	/**
	 * 创建人脸
	 * @param {*} params 
	 */
	async create(params) {
		const {
			face_name,
			file_code,
			desc
		} = params;
		return m_face.create({face_name,file_code,desc});
	}

	/**
	 * 修改人脸
	 * @param {*} params 
	 */
	async update(params) {
		const {
			id,
			face_name,
			desc
		} = params;
		const role_exist = await m_face.getDetailsById(id);
		if (!role_exist) {
			throw new ApiError(RCode.common.C1, '人脸不存在,操作失败');
		}
		let result = await m_face.update({
			id,face_name,desc
		});
		return result;
	}

	/**
	 * 删除人脸
	 * @param {*} params 
	 */
	async delete(params) {
		const {
			id
		} = params;
		let result = await m_face.delete(id);
		return result;
	}

	/**
	 * 根据ID获取人脸详情信息
	 * @param {*} params 
	 */
	async details(params) {
		const {
			id
		} = params;
		return await m_face.getDetailsById(id, ['id', 'face_name', 'desc']);
	}

	/**
	 * 获取人脸列表
	 * @param {*} params 
	 */
	async getList(params) {
		const {
			face_name,
			sorter
		} = params;
		let where = {};
		if (!isNull(face_name)) {
			where.face_name = {
				[Op.like]: face_name + '%'
			};
		}
		let order = [
			['face_name'],
			[['id','desc']]
		]; //排序
		if (sorter) {
			order.unshift(sorter.split('|'));
		}
		let attr = ['id', 'file_code','face_name', 'description ', 'create_time'];
		return await m_face.getList(attr, where, order);
	}

	/**
	 * 获取人脸分页列表
	 * @param {*} _params 
	 */
	async getPageList(_params) {
		let {
			page_index,
			page_size,
			face_name,
			sorter,
		} = _params;

		let attrs = ' id,file_code,face_name,description,create_time ';
		let table = ' fr_face ';
		let where = ' where 1=1 ';
		if (!isNull(face_name)) {
			face_name = face_name + '%';
			where += ' and face_name like  :face_name ';
		}
		let order = ' order by face_name ,id desc ';
		if (!isNull(sorter)) {
			order = `order by ${sorter.split('|').join(' ')} `;
		}
		console.log(order);
		let params = {
			page_index,
			page_size,
			face_name
		};
		return await m_face.getPageList(params, attrs, table, where, order);
	}
}

export default new FaceService();