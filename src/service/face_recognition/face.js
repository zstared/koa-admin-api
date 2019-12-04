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
import m_file from '../../model/core/file';
import { faceDetection } from '../../lib/face_api';
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
			create_user
        } = params;

        const face_file = await m_file.getFileByCode(file_code);
        if (!face_file) {
            throw new ApiError(RCode.core.C2003001, '文件不存在');
        }

        const descriptor = await faceDetection(face_file.directory + '/' + face_file.code + '.' + face_file.ext);
        if (descriptor.length == 0) {
            throw new ApiError(RCode.fr.C3000000, '未检测到人脸');
        } else if (descriptor.length > 1) {
            throw new ApiError(RCode.fr.C3000001, '检测到多张人脸');
        }

		const result= await m_face.create({ face_name, file_code, descriptor,create_user });
		if(result){
			m_file.updateFileByCode(file_code,result.id,'fr_face');
		}
		return result;
    }

    /**
     * 修改人脸
     * @param {*} params 
     */
    async update(params) {
		const {id, face_name,file_code,update_user } = params;
		const  face={id,face_name,file_code,update_user};
        const face_exist = await m_face.getDetailsById(id);
        if (!face_exist) {
            throw new ApiError(RCode.common.C1, '人脸不存在,操作失败');
        }
        if (file_code != face_exist.file_code) {
            const face_file = await m_file.getFileByCode(file_code);
            if (!face_file) {
                throw new ApiError(RCode.core.C2003001, '文件不存在');
            }
            const descriptor = await faceDetection(face_file.directory + '/' + face_file.code + '.' + face_file.ext);
            if (descriptor.length == 0) {
                throw new ApiError(RCode.fr.C3000000, '未检测到人脸');
            } else if (descriptor.length > 1) {
                throw new ApiError(RCode.fr.C3000001, '检测到多张人脸');
			}
			face.descriptor=descriptor;
		}
		
		let result = await m_face.update(face);
		if(result&&file_code != face_exist.file_code){
			m_file.updateFileByCode(file_code,id,'fr_face');//更新文件关联
			m_file.clearFileByCode(face_exist.file_code);//清除之前文件关联
		}
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
		const face=await m_face.getDetailsById(id);
		let result = await m_face.delete(id);
		if(result){
			m_file.clearFileByCode(face.file_code);
		}
        return result;
    }


    /**
     * 获取人脸下拉列表
     * @param {*} params 
     */
    async getDropList(params) {
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
            [
                ['id', 'desc']
            ]
        ]; //排序
        if (sorter) {
            order.unshift(sorter.split('|'));
        }
        let attr = ['id', 'face_name', 'create_time'];
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

        let attrs = ' id,file_code,face_name,descriptor,create_time ';
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
        let params = {
            page_index,
            page_size,
            face_name
        };
		const pageList= await m_face.getPageList(params, attrs, table, where, order);
		if (pageList.count) {
			for (let item of pageList.rows) {
				item.file_info = await m_file.getFileByCode(item.file_code);
			}
		}
		return pageList;
    }
}

export default new FaceService();