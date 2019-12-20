const s_face = require('./service/face_recognition/face').default;

const run = async () => {
    /*爬取明星人脸 */
    s_face.initMingXingImg();
};

run();