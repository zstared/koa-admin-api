import send from 'koa-send';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import os from 'os';
import BaseController from '../../lib/base_controller';
import parameterValidate from '../../lib/parameter_validate';
import fileService from '../../service/core/file';


class FileController extends BaseController {

	/**
     * @api {post} /core/file/upload 1.上传文件
     * @apiName upload
     * @apiGroup file
     * @apiVersion  0.1.0
     * 
     * 
     * @apiParam  {String} module 模块 如avatar、
     * @apiParam  {Boolean} is_thumb 是否要生成缩略图 仅用于图片格式文件
     * @apiParamExample  {type} Request-Example:
     * {
     *     folder_name:'avatar', //目录名称
     *     is_thumb:false,
     *     is_static:'false', --false 私人的、需调接口下载；true 公开的 静态资源
     * }
     * 
     * @apiUse  ResultError
     * @apiUse  ResultSuccess
     * @apiSuccess  (Response) {String} data.code  文件ID
     * @apiSuccess  (Response) {String} data.url 文件相对路径
     * @apiSuccess  (Response) {String} data.thumb_url image格式文件的缩略图
     * @apiSuccessExample {type} Success-Response:
     * {
     *     code:'78482d20-17e0-11e9-8170-dd80e6eeb92e',
     *     name:'abc.jpg'
     *     url : '/avatar/78482d20-17e0-11e9-8170-dd80e6eeb92e.jpg',
     *     thumb_url:'/avatar/78482d20-17e0-11e9-8170-dd80e6eeb92e-thumb.jpg', 
     * }
     *
     */
	async upload(ctx) {
		const files = ctx.request.files; // 文件
		const params=ctx.request.body;//参数
		const validRule = {
			folder_name: {
				required: false,
				allowEmpty:true,
				type: 'string',
				min: 1,
				max: 50
			},
			is_static: {
				required: false,
				type: 'boolean',
			},
			is_thumb: {
				required: false,
				type: 'boolean',
			},
			thumb_w: {
				required: false,
				type: 'number',
			},
			thumb_h: {
				required: false,
				type: 'number',
			},
		};
		parameterValidate.validate(validRule, params);
		let upload_files = [];
		if (files instanceof Array) {
			upload_files = files;
		} else {
			upload_files.push(files.file);
		}
		for (let file of upload_files) {
			if (file && file.size) {
				const file_data=await fileService.save(file,Object.assign(params,ctx.user_info));
				if(file_data){
					ctx.success(file_data);
				}else{
					ctx.error();
				}

			}
		}
	}

	/**
     * @api {post} /core/file/download/:code 2.下载文件
     * @apiName download
     * @apiGroup file
     * @apiVersion  0.1.0
     * 
     * 
     * @apiParam  {String} code 文件唯一编号
     * 
     * @apiParamExample  {type} Request-Example:
     * {
     *     code:'6ecab330-1a29-11e9-a8d6-05ced3aa89c5'
     * }
     */
	async download(ctx) {
		const params = ctx.query;
		const validRule = {
			code: {
				type: 'string',
				max:36
			},
		};
		parameterValidate.validate(validRule, params);
		const file=await fileService.download(params.code);
		ctx.attachment(file.name);
		await send(ctx,file.path,{root:'/'});
	}
    
	/**
     * @api {post} /core/file/download/:code 2.下载文件
     * @apiName download
     * @apiGroup file
     * @apiVersion  0.1.0
     * 
     * 
     * @apiParam  {String} code 文件唯一编号
     * 
     * @apiParamExample  {type} Request-Example:
     * {
     *     code:'6ecab330-1a29-11e9-a8d6-05ced3aa89c5'
     * }
     */
	async downloadPackage(ctx){
		const params=ctx.request.query;
		const validRule = {
			code: {
				type: 'string',
			},
		};
		parameterValidate.validate(validRule, params);
        
		const codes=params.code.split(',');
        
		let list_file=[];
		for(let code of codes){
			const file=await fileService.download(code);
			list_file.push(file);
		}
        
		const zipName = params.name?`${params.name}.zip`:'package.zip';
		const zip_path=path.join(os.tmpdir(),zipName);
		const zipStream = fs.createWriteStream(zip_path);
		const zip = archiver('zip');

		zip.pipe(zipStream);
		for (let i = 0; i < list_file.length; i++) {
			// 添加单个文件到压缩包
			zip.append(fs.createReadStream(list_file[i].path), { name: list_file[i].name });
		}
		await zip.finalize();
		ctx.attachment(zip_path);
		await send(ctx, zip_path,{root:'/'});
        
		fs.unlink(zip_path,(()=>{}));
        
	}
}

export default new FileController();