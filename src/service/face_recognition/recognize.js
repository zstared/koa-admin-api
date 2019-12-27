import ApiError from '../../lib/api_error';
import {
    RCode
} from '../../lib/enum';
import m_face from '../../model/face_recognition/face';
import m_file from '../../model/core/file';
import m_face_type from '../../model/face_recognition/face_type';
import RedisClient from '../../lib/redis';
const redis = new RedisClient();
import { faceRecognize, faceMatch } from '../../lib/face_api';
const prefix = 'recognize';

class FaceService {
    constructor() {}

    /**
     * 识别人脸
     * @param {*} params 
     */
    async detect(params) {
        const {
            user_id,
            file_code,
        } = params;

        const face_file = await m_file.getFileByCode(file_code);
        if (!face_file) {
            throw new ApiError(RCode.core.C2003001, '文件不存在');
        }

        console.log(face_file.directory + '/' + face_file.name);

        const descriptor = await faceRecognize(face_file.directory + '/' + face_file.name);
        if (descriptor.length == 0) {
            throw new ApiError(RCode.fr.C3000000, '未检测到人脸');
        }

        redis.setSerializable(prefix + user_id, descriptor);

        return { is_single: descriptor.length == 1 ? true : false, number: descriptor.length };
    }

    /**
     * 比对人脸
     * @param {*} params 
     */
    async matching(params) {
        const {
            face_code,
            face_id,
            user_id,
        } = params;

        const descriptor = await redis.getSerializable(prefix + user_id);

        const face = await m_face.getDetailsById(face_id, ['face_name', 'file_code', 'descriptor']);
        const index = face.file_code.findIndex((code) => {
            return code == face_code;
        });
        const distances = await faceMatch(face.face_name, face.descriptor[index][0], descriptor);

        let result = {
            distance: distances.sort((a, b) => a - b)[0],
            label: face.face_name
        };
        console.log(result);

        return result;


    }

    /**
     * 获取人脸拼图
     * @param {*} params 
     */
    async sprite() {
        const list = await m_face_type.getList();
        const images = [];
        if (list.length) {
            for (let item of list) {
                if (item.dataValues.cover_code) {
                    const file_info = await m_file.getFileByCode(item.cover_code);
                    images.push({ id: item.id, type_name: item.type_name, url: file_info ? file_info.dataValues.src : '' });
                }
            }
        }
        return images;
    }

    /**
     * 获取人脸分页列表
     * @param {*} _params
     */
    async getPageList(_params) {
        let { page_index, page_size, face_name } = _params;

        let attrs = ' id,file_code,face_name,create_time ';
        let table = ' fr_face ';
        let where = ' where 1=1 ';
        let order = ' order by id desc ';
        let params = {
            page_index,
            page_size,
            face_name
        };
        const pageList = await m_face.getPageList(
            params,
            attrs,
            table,
            where,
            order
        );
        let face_count = 0;
        if (pageList.count) {
            for (let item of pageList.rows) {
                item.file_info = await m_file.getFaceFileByCodes(item.file_code);
                face_count = face_count + item.file_code.length;
            }
        }
        pageList.face_count = face_count;
        return pageList;
    }
}

export default new FaceService();