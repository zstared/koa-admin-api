import ApiError from '../../lib/api_error';
import { RCode } from '../../lib/enum';
import m_face from '../../model/face_recognition/face';
import m_face_type from '../../model/face_recognition/face_type';
import { isNull, genFileCode } from '../../lib/utils';
import { Op } from 'sequelize';
import m_file from '../../model/core/file';
import { faceDetection } from '../../lib/face_api';
import graphicsmagick from '../../lib/graphicsmagick';
import path from 'path';
import fs from 'fs-extra';
import config from '../../config';
import { getMingXingImgs } from '../../lib/crawler';

const img_folder = 'public/static/face/mingxing';
const mingxing_img_path = path.join(__dirname, '../../', img_folder);


class FaceService {
    constructor() {}

    /**
     * 创建人脸
     * @param {*} params
     */
    async create(params) {
        const { face_name, file_code, create_user, type_id } = params;
        const is_exist = await m_face.isExist(face_name);
        if (is_exist) {
            throw new ApiError(RCode.fr.C3000002, '人脸名称已存在');
        }

        const face_files = await m_file.getFileByCodes(file_code);
        if (!face_files || face_files.length == 0) {
            throw new ApiError(RCode.core.C2003001, '文件不存在');
        }
        const tasks = face_files.map(face_file =>
            faceDetection(
                face_file.directory + '/' + face_file.name
            )
        );

        let results = [];
        try {
            results = await Promise.all(tasks);
        } catch (e) {
            throw e;
        }
        const descriptor = results.filter((item, index) => {
            if (item.length == 0) {
                file_code.splice(index, 1);
                return false;
            } else {
                return true;
            }
        });

        if (descriptor.length == 0) {
            throw new ApiError(RCode.fr.C3000000, '未检测到人脸');
        }

        const result = await m_face.create({
            face_name,
            type_id,
            file_code,
            descriptor,
            create_user
        });
        if (result) {
            m_file.updateFileByCodes(file_code, result.id, 'fr_face');
        }
        this._sprite(type_id);
        return result;

    }

    /**
     * 修改人脸
     * @param {*} params
     */
    async update(params) {
        const { id, face_name, file_code, update_user, type_id, } = params;
        const is_exist = await m_face.isExist(face_name, id);
        if (is_exist) {
            throw new ApiError(RCode.fr.C3000002);
        }
        const face = { id, face_name, file_code, type_id, update_user };
        const face_exist = await m_face.getDetailsById(id);
        if (!face_exist) {
            throw new ApiError(RCode.common.C1, '人脸不存在,操作失败');
        }

        let del_code = []; //删除的人脸
        face_exist.file_code.forEach(exist => {
            if (!file_code.some(code => code == exist)) {
                del_code.push(exist);
            }
        });

        let add_code = []; //新增的人脸
        file_code.forEach(code => {
            if (!face_exist.file_code.some(exist => exist == code)) {
                add_code.push(code);
            }
        });

        console.log('del_code', del_code);
        console.log('add_code', add_code);

        let add_descriptor = [];
        let descriptor = face_exist.descriptor;
        if (del_code.length > 0) {
            let del_index = del_code.map((item) => {
                return face_exist.file_code.findIndex(code => code == item);
            });
            descriptor = descriptor.filter((item, index) => {
                return !del_index.some(code => code == index);
            });
        }

        if (add_code.length > 0) {
            const face_files = await m_file.getFileByCodes(add_code);
            if (face_files && face_files.length > 0) {
                const tasks = face_files.map(face_file =>
                    faceDetection(
                        face_file.directory + '/' + face_file.name
                    )
                );
                let results = [];
                try {
                    results = await Promise.all(tasks);
                } catch (e) {
                    throw e;
                }
                add_descriptor = results.filter((item, index) => {
                    if (item.length == 0) {
                        add_code.splice(index, 1);
                        return false;
                    } else {
                        return true;
                    }
                });
                if (add_descriptor.length == 0 && del_code.length == 0) {
                    throw new ApiError(RCode.fr.C3000000, '未检测到人脸');
                }
            } else {
                if (del_code.length == 0) {
                    throw new ApiError(RCode.core.C2003001, '文件不存在');
                }
            }

        }
        face.descriptor = descriptor.concat(add_descriptor);

        let result = await m_face.update(face);
        if (result) {
            if (add_code.length > 0) m_file.updateFileByCodes(add_code, face_exist.id, 'fr_face'); //更新文件关联
            if (del_code.length > 0) m_file.clearFileByCodes(del_code); //清除之前文件关联
            this._sprite(type_id);
        }
        return result;
    }

    /**
     * 删除人脸
     * @param {*} params
     */
    async delete(params) {
        const { id } = params;
        const face = await m_face.getDetailsById(id);
        let result = await m_face.delete(id);
        if (result) {
            m_file.clearFileByCodes(face.file_code);
        }
        return result;
    }

    /**
     * 获取人脸下拉列表
     * @param {*} params
     */
    async getDropList(params) {
        const { face_name, sorter } = params;
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
        let { page_index, page_size, face_name, sorter } = _params;

        let attrs = ' a.id,file_code,face_name,create_time,type_id,type_name ';
        let table = ' fr_face a join fr_face_type b on a.type_id=b.id ';
        let where = ' where 1=1 ';
        if (!isNull(face_name)) {
            face_name = face_name + '%';
            where += ' and face_name like  :face_name ';
        }
        let order = ' order by face_name ,a.id desc ';
        if (!isNull(sorter)) {
            order = `order by ${sorter.split('|').join(' ')} `;
        }
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

    /**
     * 拼图
     */
    async _sprite(type_id) {
        let list = await m_face.query('select file_code from fr_face where type_id=:type_id order by id desc limit 60', { type_id: type_id });
        let file_codes = [];
        list.forEach(item => {
            file_codes = file_codes.concat(item.file_code);
        });
        const file_info = await m_file.getFileByCodes(file_codes);
        const img_source_paths = file_info.map(item => {
            return path.join(__dirname, '../../../', item.directory + '/' + item.name);
        });


        let face_type = await m_face_type.getDetailsById(type_id);
        const { cover_code, type_code } = face_type;
        if (cover_code) {
            const img_taget_path = path.join(__dirname, '../../../', `/public/static/face/${cover_code}/${type_code}.jpg`);
            await graphicsmagick.sprite(img_source_paths, img_taget_path);
            const file = await fs.stat(img_taget_path);
            await m_file.updateByCode({
                code: cover_code,
                size: file.size
            });
        } else {
            let code = genFileCode();
            const dir = path.join(__dirname, '../../../', `/public/static/face/${code}/`);
            await fs.mkdir(dir);
            const img_taget_path = dir + `${type_code}.jpg`;
            await graphicsmagick.sprite(img_source_paths, img_taget_path);
            const file = await fs.stat(img_taget_path);

            await m_file.create({
                code: code,
                name: 'face_sprite.jpg',
                size: file.size,
                ext: 'jpg',
                type: 'image/jpeg',
                'table_id': face_type.id,
                'table_name': 'fr_face_type',
                folder: 'face',
                directory: '/public/static/face/' + code,
                is_static: 1,
                is_compress: 0,
                is_thumb: 0,
                origin: config.origin,
                path: `/face/${code}/${type_code}.jpg`,
                path_hd: '',
                path_thumb: '',
            });
            await m_face_type.update({ id: face_type.id, cover_code: code });
        }



    }

    /**
     * 获取人脸类型列表
     * @param {*} params 
     */
    async getFaceTypeList() {
        return await m_face_type.getList(['id', 'type_name'], null, [
            ['id']
        ]);
    }

    /**
     * 初始明星脸库
     */
    async initMingXingImg() {
        const mingxing = await getMingXingImgs(mingxing_img_path);
        for (let i = 0; i < mingxing.length; i++) {

        }

    }
}

export default new FaceService();