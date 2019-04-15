import fs from 'fs-extra';
import uuidv1 from 'uuid/v1';
import path from 'path';
import ApiError from '../../lib/api_error';
import {
	RCode
} from '../../lib/enum';
import gm from 'gm';
import m_file from '../../model/core/file';
import config from '../../config';
import log4js from '../../lib/log';
const logger = log4js.logger('file');

const imageMagick = gm.subClass({
	imageMagick: true
});
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
			let {
				folder_name,
				is_thumb,
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
			is_static=is_image?true:is_static; //图片文件存储过静态资源
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
			reader.pipe(upStream,{end:true}); // 可读流通过管道写入可写流


			//生成缩略图
			let thumb_flag = false;
			if (is_thumb && is_image) {
				try {
					thumb_flag = await this.mkThumb(file_name, dir_path, thumb_w, thumb_h);
				} catch (err) {
					logger.error('【error】', 'message:', err.msg || '', 'desc:', err.desc || err.message || 'System Exception');
					logger.error('【stack】\n ', err.stack || '');
				}
			}

			//获取文件信息
			// const fileInfo = await this.getImageInfo(`${dir_path}/${file_name}`);
			// console.log('fileInfo', fileInfo);

			let file_data = {
				code: file_code,
				name: file.name,
				size: file.size,
				ext: ext,
				type: file.type,
				folder: folder_name,
				directory: dir,
				is_static: is_static ? 1 : 0,
				is_thumb: is_thumb ? 1 : 0,
				origin: is_static ? config.origin : '',
				path: is_static ? dir.replace('/public/static', '') + `/${file_name}` : '',
				thumb_path: is_static && is_thumb && is_image && thumb_flag ? dir.replace('/public/static', '') +
					`/${file_code}-thumb.${ext}` : '',
				create_user: params.user_name
			};
			await m_file.create(file_data);

			await fs.unlink(file.path); //删除临时目录

			return {
				code: file_code,
				url: file_data.origin + file_data.path,
				type:file_data.type,
				thumb_url: file_data.thumb_path ? file_data.origin + file_data.thumb_path : '',
			};

		} catch (e) {
			throw new ApiError(RCode.core.C2003000, '文件上传失败', e.message);
		}

	}

	/**
	 * 生成缩略图
	 * @param {string} image_name 图片名称
	 * @param {string} image_path 图片路径
	 * @param {number} thumb_w 缩略图宽度
	 * @param {number} thumb_h 缩略图高度
	 */
	async mkThumb(image_name, image_path, thumb_w = 120, thumb_h = 120) {

		let name_arr = image_name.split('.');
		let ext = name_arr.pop();
		name_arr.push('-thumb');
		let thumb_name = name_arr.join('') + `.${ext}`;
		return new Promise((resolve, reject) => {
			imageMagick(`${image_path}/${image_name}`)
				.noProfile()
				.autoOrient()
				.thumb(thumb_w, thumb_h, `${image_path}/${thumb_name}`, 90, function (err) {
					if (!err) {
						resolve(true);
					} else {
						console.log(err);
						reject(false);
					}
				});
		});
	}

	/**
	 * 获取图片详细信息
	 * @param {string|buffer} iamge 图片路径或文件流
	 */
	async getImageInfo(image) {
		const magic = imageMagick(image);

		// size - 返回图像的大小（WxH）
		// format - 返回图像格式（gif，jpeg，png等）
		// depth - 返回图像颜色深度
		// color - 返回颜色数
		// res - 返回图像分辨率
		// filesize - 返回图像文件大小
		// identify - 返回所有可用的图像数据
		// orientation - 返回图像的EXIF方向

		const size = new Promise((resolve, reject) => {
			magic.size((err, value) => {
				if (!err) {
					resolve(value);
				} else {
					reject(null);
				}
			});
		});

		const format = new Promise((resolve, reject) => {
			magic.format((err, value) => {
				if (!err) {
					resolve(value);
				} else {
					reject(null);
				}
			});
		});

		const depth = new Promise((resolve, reject) => {
			magic.depth((err, value) => {
				if (!err) {
					resolve(value);
				} else {
					reject(null);
				}
			});
		});

		const color = new Promise((resolve, reject) => {
			magic.color((err, value) => {
				if (!err) {
					resolve(value);
				} else {
					reject(null);
				}
			});
		});

		const res = new Promise((resolve, reject) => {
			magic.res((err, value) => {
				if (!err) {
					resolve(value);
				} else {
					reject(null);
				}
			});
		});

		const filesize = new Promise((resolve, reject) => {
			magic.filesize((err, value) => {
				if (!err) {
					resolve(value);
				} else {
					reject(null);
				}
			});
		});

		const identify = new Promise((resolve, reject) => {
			magic.identify((err, value) => {
				if (!err) {
					resolve(value);
				} else {
					reject(null);
				}
			});
		});

		const orientation = new Promise((resolve, reject) => {
			magic.orientation((err, value) => {
				if (!err) {
					resolve(value);
				} else {
					reject(null);
				}
			});
		});

		try {
			const fileInfo = await Promise.all([size, format, depth, color, res, filesize, identify, orientation]);
			return {
				size: fileInfo[0],
				format: fileInfo[1],
				depth: fileInfo[2],
				color: fileInfo[3],
				res: fileInfo[4],
				filesize: fileInfo[5],
				identify: fileInfo[6],
				orientation: fileInfo[7]
			};
		} catch (e) {
			return null;
		}

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