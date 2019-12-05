import ApiError from '../../lib/api_error';
import { RCode } from '../../lib/enum';
import m_face from '../../model/face_recognition/face';
import { isNull } from '../../lib/utils';
import { Op } from 'sequelize';
import m_file from '../../model/core/file';
import { faceDetection } from '../../lib/face_api';
class FaceService {
    constructor() {}

    /**
     * 创建人脸
     * @param {*} params
     */
    async create(params) {
        const { face_name, file_code, create_user } = params;

        const face_files = await m_file.getFileByCodes(file_code);
        if (!face_files || face_files.length == 0) {
            throw new ApiError(RCode.core.C2003001, '文件不存在');
        }

        const tasks = face_files.map(face_file =>
            faceDetection(
                face_file.directory + '/' + face_file.code + '.' + face_file.ext
            )
        );
        const results = await Promise.all(tasks);
        const descriptor = results.filter((item, index) => {
            if (item.length == 0) {
                file_code.splice(index, 1);
                return false;
            } else {
                return true;
            }
        });

        console.log(file_code, descriptor);

        if (descriptor.length == 0) {
            throw new ApiError(RCode.fr.C3000000, '未检测到人脸');
        }

        const result = await m_face.create({
            face_name,
            file_code,
            descriptor,
            create_user
        });
        if (result) {
            m_file.updateFileByCodes(file_code, result.id, 'fr_face');
        }
        return result;
    }

    /**
     * 修改人脸
     * @param {*} params
     */
    async update(params) {
        const { id, face_name, file_code, update_user } = params;
        console.log(file_code);
        const face = { id, face_name, file_code, update_user };
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

        console.log('del_code',del_code);
        console.log('add_code',add_code);

        let add_descriptor = [];
        let descriptor = face_exist.descriptor;
        if (del_code.length > 0) {
            let del_index=del_code.map((item)=>{
                return face_exist.file_code.findIndex(code=>code==item);
            });
            descriptor=descriptor.filter((item,index)=>{
                return !del_index.some(code=>code==index);
            });
        }

        if (add_code.length > 0) {
            const face_files = await m_file.getFileByCodes(add_code);
            if (face_files && face_files.length > 0) {
                const tasks = face_files.map(face_file =>
                    faceDetection(
                        face_file.directory + '/' + face_file.code + '.' + face_file.ext
                    )
                );
                const results = await Promise.all(tasks);
                add_descriptor = results.filter((item, index) => {
                    if (item.length == 0) {
                        add_code.splice(index, 1);
                        return false;
                    } else {
                        return true;
                    }
                });

                if (add_descriptor.length == 0&&del_code.length==face_exist.file_code.length) {
                    throw new ApiError(RCode.fr.C3000000, '未检测到人脸');
                }
            }else{
                if(del_code.length==face_exist.file_code.length){
                    throw new ApiError(RCode.core.C2003001, '文件不存在');
                }
            }

        }

        face.descriptor = descriptor.concat(add_descriptor);
        console.log(file_code,face.descriptor);
        
        let result = await m_face.update(face);
        if (result) {
            if(add_code.length>0) m_file.updateFileByCodes(add_code, face_exist.id, 'fr_face'); //更新文件关联
            if(del_code.length>0) m_file.clearFileByCodes(del_code); //清除之前文件关联
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

        let attrs = ' id,file_code,face_name,create_time ';
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