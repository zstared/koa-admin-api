import fs from 'fs-extra';
import uuidv1 from 'uuid/v1';
import path from 'path';
import ApiError from '../../lib/api_error';
import {
    RCode
} from '../../lib/enum';
import m_file from '../../model/core/file';
import config from '../../config';
import log4js from '../../lib/log';
const logger = log4js.logger('file');
//import gm from 'gm';
// const graphicsmagick = gm.subClass({
//     graphicsmagick: true
// });
import graphicsmagick from '../../lib/graphicsmagick';
//图片文件类型
const file_image_type = [
    'image/jpg',
    'image/png',
    'image/gif',
    'image/jpeg',
    'image/bmp'
];

//文件保存目录 
const folder_names = [
    'avatar',
    'face',
    'album',
    'apply',
    'form'
];

class FileService {

    /**
     * 判断目录是否存在
     * @param {string} dir_path 目录 
     */
    async isExistDir(dir_path) {
        try {
            await fs.access(dir_path, fs.constants.F_OK);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * 保存文件
     * @param {Object} file 文件对象
     * @param {String} save_path  保存目录
     * @param {Object} params 参数 
     */
    async save(file, params = {}) {
        try {
			console.log(params);
            let {
                folder_name,
                is_thumb,
                is_compress,
                is_static,
                thumb_h,
                thumb_w
            } = params;
            const reader = fs.createReadStream(file.path); // 创建可读流

            const ext = file.name.split('.').pop(); // 文件扩展名
            //是否为图片
            let is_image = false;
            if (file_image_type.some(type => type == file.type)) {
                is_image = true;
            }
            is_static = is_image ? true : is_static; //图片文件存储过静态资源
            //目录名称
            if (!folder_name || !folder_names.some(item => item == folder_name)) {
                folder_name = 'common';
            }
            //存储目录
            let dir = is_static ? `/static/${folder_name}` : is_image ? `/images/${folder_name}` : `/files/${folder_name}`;
            dir = `/public${dir}`;
            let dir_path = path.join(process.cwd(), dir);
            //判断目录是否存在
            let is_access = await this.isExistDir(dir_path);
            if (!is_access) {
                await fs.mkdirs(dir_path); //创建目录
            }
            const file_code = uuidv1();
            const file_name = file_code + `.${ext}`;
            const upStream = fs.createWriteStream(`${dir_path}/${file_name}`); // 创建可写流
            reader.pipe(upStream); // 可读流通过管道写入可写流

            //压缩图片
			let compress_flag = false;
			let hd_name='';
            if (is_compress && is_image) {
                try {
                     hd_name = this._fixFileName(file_name, '-hd');
                    let img_target_path = dir_path + '/' + hd_name;
					await fs.copy(file.path, img_target_path);//复制
                    compress_flag = await graphicsmagick.compress(dir_path + '/' + file_name);
                } catch (err) {
                    logger.error('【error】', 'message:', err.msg || '', 'desc:', err.desc || err.message || 'System Exception');
                    logger.error('【stack】\n ', err.stack || '');
                }
            }

            //生成缩略图
			let thumb_flag = false;
			let thumb_name='';
            if (is_thumb && is_image) {
                try {
                     thumb_name = this._fixFileName(file_name, '-thumb');
                    let img_target_path = dir_path + '/' + thumb_name;
                    thumb_flag = await graphicsmagick.thumb(file.path, img_target_path, thumb_w, thumb_h);
                } catch (err) {
                    logger.error('【error】', 'message:', err.msg || '', 'desc:', err.desc || err.message || 'System Exception');
                    logger.error('【stack】\n ', err.stack || '');
                }
            }

			//获取文件信息
			// console.log(`${dir_path}/${file_name}`);
            // const fileInfo = await graphicsmagick.getImageInfo(`${dir_path}/${file_name}`);
            // console.log('fileInfo:',fileInfo);

            let file_data = {
                code: file_code,
                name: file.name,
                size: file.size,
                ext: ext,
                type: file.type,
                folder: folder_name,
                directory: dir,
				is_static: is_static ? 1 : 0,
				is_compress:is_compress?1:0,
                is_thumb: is_thumb ? 1 : 0,
                origin: is_static ? config.origin : '',
				path: is_static ? dir.replace('/public/static', '') + `/${file_name}` : '',
				hd_path: is_static && is_compress && is_image && compress_flag ? dir.replace('/public/static', '') +
                    `/${hd_name?hd_name:file_name}` : '',
                thumb_path: is_static && is_thumb && is_image && thumb_flag ? dir.replace('/public/static', '') +
                    `/${thumb_name}` : '',
                create_user: params.user_id
            };
            await m_file.create(file_data);

            fs.unlink(file.path); //删除临时目录

             
            return {
                code: file_code,
                url: file_data.origin + file_data.path,
                type: file_data.type,
                thumb_url: file_data.thumb_path ? file_data.origin + file_data.thumb_path : '',
            };

            // return new Promise((resolve)=>{
            //     setTimeout(()=>{
            //        resolve();
            //     },300000);
            // });
      

        } catch (e) {
            throw new ApiError(RCode.core.C2003000, '文件上传失败', e.message);
        }

    }

    /**
     * 文件名添加后缀
     * @param {string} file_name 
     */
    _fixFileName(file_name, fix) {
        let name_arr = file_name.split('.');
        let ext = name_arr.pop();
        name_arr.push(fix);
        let fix_name = name_arr.join('') + `.${ext}`;
        return fix_name;
    }

    /**
     * //下载文件信息
     * @param {*} code 
     */
    async download(code) {
        const file = await m_file.getFileByCode(code);
        return {
            path: path.join(process.cwd(), file.directory + '/' + file.code + '.' + file.ext),
            name: file.name
        };
    }
}

export default new FileService();