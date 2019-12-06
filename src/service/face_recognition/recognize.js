// import ApiError from '../../lib/api_error';
// import {
//     RCode
// } from '../../lib/enum';
import m_face from '../../model/face_recognition/face';
import m_file from '../../model/core/file';

// import { faceDetection } from '../../lib/face_api';
import graphicsmagick from '../../lib/graphicsmagick';
import path from 'path';
class FaceService {
    constructor() {}


    /**
     * 识别人脸
     * @param {*} params 
     */
    async matching(params) {
        console.log(params);
        // const {
        //     file_code,
        // } = params;

        // const face_file = await m_file.getFileByCode(file_code);
        // if (!face_file) {
        //     throw new ApiError(RCode.core.C2003001, '文件不存在');
        // }

        // const descriptor = await faceDetection(face_file.directory + '/' + face_file.code + '.' + face_file.ext);
        // if (descriptor.length == 0) {
        //     throw new ApiError(RCode.fr.C3000000, '未检测到人脸');
        // } else if (descriptor.length > 1) {
        //     throw new ApiError(RCode.fr.C3000001, '检测到多张人脸');
        // }

        return await this._sprite();


    }

    async _sprite() {
        let list = await m_face.getList(['file_code']);
        let file_codes = [];
        list.forEach(item => {
            file_codes = file_codes.concat(item.file_code);
        });

        const file_info = await m_file.getFileByCodes(file_codes);

        const img_source_paths = file_info.map(item => {
            return path.join(__dirname, '../../../', item.directory + '/' + item.code + '.' + item.ext);
        });

        const img_taget_path = path.join(__dirname, '../../../', '/public/static/face/face_sprite.jpg');
        return await graphicsmagick.sprite(img_source_paths, img_taget_path);
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
        if (pageList.count) {
            for (let item of pageList.rows) {
                item.file_info = await m_file.getFileByCodes(item.file_code);
            }
        }
        return pageList;
    }
}

export default new FaceService();