
import gm from 'gm';
const graphicsmagick = gm.subClass({
    graphicsmagick: true
});

class Graphicsmagick {

	constructor(){}
	

	/**
     * 图片伸缩  保持宽高比
     * @param {*} img_source_path  源图片路径
     * @param {*} img_target_path  目标图片保存路径
     * @param {*} width 宽度
     * @param {*} height 高度
     */
    async resize(img_source_path, img_target_path=null, width = null, height = null) {
        const magic = graphicsmagick(img_source_path).resize(width, height).autoOrient();
        return await this.write(magic, img_target_path?img_target_path:img_source_path);
	}
	
	/**
	 * 裁剪图片
	 * @param {*} img_source_path 源图片路径
	 * @param {*} img_target_path  目标图片保存路径
	 * @param {*} width 
	 * @param {*} height 
	 * @param {*} x 
	 * @param {*} y 
	 */
	async crop(img_source_path,img_target_path,width,height,x,y){
		const magic = graphicsmagick(img_source_path).crop(width,height,x,y).quality(100);
		return await this.write(magic, img_target_path?img_target_path:img_source_path);
	}

	/**
	 * 复制图片
	 * @param {*} img_source_path 
	 * @param {*} img_target_path 
	 */
	async copy(img_source_path,img_target_path){
		const magic=graphicsmagick(img_source_path);
		return await this.write(magic,img_target_path);
	}

    /**
     * 输出图片
     * @param {*} magic 
     * @param {*} img_target_path 
     */
    async write(magic, img_target_path) {
        return new Promise((resolve, reject) => {
            magic.write(img_target_path, err => {
                if (err) {
                    reject(false);
                } else {
                    resolve(true);
                }
            });
        });
	}
	
	/**
     * 生成缩略图
	 * @param {*} img_source_path 源图片路径
	 * @param {*} img_target_path  目标图片保存路径
     * @param {number} thumb_w 缩略图宽度
     * @param {number} thumb_h 缩略图高度
     */
    async thumb(img_source_path,  img_target_path,thumb_w = null, thumb_h = null) {
		if(!thumb_w&&!thumb_h){
			const size=this.getImageSize(img_source_path);
			if(size.width>size.height){
				thumb_w=120;
			}else{
				thumb_h=120;
			}

		} 
		const magic=graphicsmagick(img_source_path).noProfile().autoOrient().resize(thumb_w,thumb_h);
		return await this.write(magic,img_target_path);
	}

	/**
     * 图片压缩  保持宽高比
     * @param {*} img_source_path  源图片路径
     * @param {*} img_target_path  目标图片保存路径
     * @param {*} width 宽度
     * @param {*} height 高度
     */
    async compress(img_source_path, img_target_path=null) {
		let  magic = graphicsmagick(img_source_path);
		let fileSize =await this.getImageFileSize(img_source_path,magic);
		const size=await this.getImageSize(img_source_path,magic);
		if(fileSize.indexOf('M')>0){
            //magic.quality(80);
		}else if(fileSize.indexOf('K')>0){
			fileSize=fileSize.substring(0,fileSize.indexOf('K')-1);
			if(fileSize>300){
				//magic.quality(80);
			}
		}
		let width=null;
		let height=null;
		if(size.width>800||size.height>800){
			if(size.width>size.height){
                width=800;
			}else{
				height=800;
			}
		}else{
			width=size.width;
			height=size.height;
		}
        console.log(width,height);
        magic = magic.quality(100).resize(width, height).autoOrient();
        return await this.write(magic, img_target_path?img_target_path:img_source_path);
	}

	/**
	 * 获取文件大小
	 * @param {*} img_path 
	 */
    async getImageFileSize(img_path,_magic=null) {
		let magic=null;
		if(_magic){
			magic=_magic;
		}else{
			magic = graphicsmagick(img_path);
		}
        return new Promise((resolve, reject) => {
            magic.filesize((err, value) => {
                if (!err) {
                    resolve(value);
                } else {
                    reject(null);
                }
            });
        });
	}
	
	/**
	 * 获取文件尺寸
	 * @param {*} img_path 
	 */
    async getImageSize(img_path,_magic=null) {
		let magic=null;
		if(_magic){
			magic=_magic;
		}else{
			magic = graphicsmagick(img_path);
		}
        return new Promise((resolve, reject) => {
            magic.size((err, value) => {
                if (!err) {
                    resolve(value);
                } else {
                    reject(null);
                }
            });
        });
    }
	
	/**
     * 获取图片详细信息
     * @param {string|buffer} iamge 图片路径或文件流
     */
    async getImageInfo(image) {
        const magic = graphicsmagick(image);

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
}

export default new Graphicsmagick();