import ApiError from '../../lib/api_error';
import {
    RCode
} from '../../lib/enum';
//import m_face from '../../model/face_recognition/face';
import m_file from '../../model/core/file';
import { faceDetection } from '../../lib/face_api';
class FaceService {
	constructor() {}
	

    /**
     * 识别人脸
     * @param {*} params 
     */
    async recognize(params) {
        const {
			file_code,
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

	}
	
	// async getList(_params){
	// 	let {
    //         page_index,
    //         page_size,
    //         face_name,
    //         sorter,
    //     } = _params;
	// }
}

export default new FaceService();