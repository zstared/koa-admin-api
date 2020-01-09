import '@tensorflow/tfjs-node';
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import path from 'path';
import fs from 'fs-extra';
import { updateFileName } from './utils';

import graphicsmagick from './graphicsmagick';

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const faceDetectionNet = faceapi.nets.ssdMobilenetv1;
// export const faceDetectionNet = tinyFaceDetector
// export const faceDetectionNet = mtcnn

// SsdMobilenetv1Options
const minConfidence = 0.5;

// TinyFaceDetectorOptions
const inputSize = 408;
const scoreThreshold = 0.5;

// MtcnnOptions
const minFaceSize = 50;
const scaleFactor = 0.8;

function getFaceDetectorOptions(net) {
    return net === faceapi.nets.ssdMobilenetv1 ?
        new faceapi.SsdMobilenetv1Options({ minConfidence }) :
        net === faceapi.nets.tinyFaceDetector ?
        new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold }) :
        new faceapi.MtcnnOptions({ minFaceSize, scaleFactor });
}

const faceDetectionOptions = getFaceDetectorOptions(faceDetectionNet);

/**
 * @method 检测人脸
 * @param {*} img_path
 */
const faceDetection = async img_path => {
    try {
        await faceDetectionNet.loadFromDisk(
            path.join(__dirname, '../asset/weights')
        );
        await faceapi.nets.faceLandmark68Net.loadFromDisk(
            path.join(__dirname, '../asset/weights')
        );
        await faceapi.nets.faceLandmark68TinyNet.loadFromDisk(
            path.join(__dirname, '../asset/weights')
        );
        await faceapi.nets.faceRecognitionNet.loadFromDisk(
            path.join(__dirname, '../asset/weights')
        );

        console.log(img_path);
        console.log(1);
        //调整图片尺寸
        let imgSize = 0;
        try {
            imgSize = await graphicsmagick.getImageSize(img_path);
        } catch (e) {
            console.log(e);
        }
        console.log(imgSize);
        const imgFileSize = await graphicsmagick.getImageFileSize(img_path);
        console.log(imgFileSize);
        if (imgFileSize.indexOf('M') > 0 && imgSize.width > 1000) {
            console.log(1.1);
            await graphicsmagick.resize(img_path, null, 1000);
        }
        console.log(2);

        let img = await canvas.loadImage(img_path);
        console.log(3);
        const detections = await faceapi.detectAllFaces(img, faceDetectionOptions);
        console.log(4);
        if (detections.length > 0) {
            detections.sort((a, b) => a.score - b.score);

            //多张人脸 截取人脸得分最高的人脸
            if (detections.length > 1) {
                const box = detections[0].box;
                await graphicsmagick.crop(
                    img_path,
                    null,
                    box.width + 80,
                    box.height + 80,
                    box.x - 40,
                    box.y - 40
                );
            }
            console.log(5);

            img = await canvas.loadImage(img_path);
            console.log(6);
            const descriptors = await faceapi
                .detectAllFaces(img, faceDetectionOptions)
                .withFaceLandmarks()
                .withFaceDescriptors();
            console.log(7);
            let result = [];
            if (descriptors.length > 0) {
                //人脸标识图
                const out = faceapi.createCanvasFromMedia(img);
                new faceapi.draw.DrawFaceLandmarks(descriptors[0].landmarks, { drawLines: true, drawPoints: true, pointSize: 2, lineWidth: 2 }).draw(out);
                fs.writeFile(updateFileName(img_path, 'face'), out.toBuffer('image/jpeg'));
                console.log(8);
                result = descriptors.map(item => {
                    return item.descriptor;
                });
                console.log(9);
            }
            return result;
        }

        return [];
    } catch (e) {
        console.log(e);
        throw e;
    }
};

/**
 * @method 识别人脸
 * @param {*} faceImgUrl
 */
const faceRecognize = async faceImgUrl => {
    await faceDetectionNet.loadFromDisk(
        path.join(__dirname, '../asset/weights')
    );
    await faceapi.nets.faceLandmark68Net.loadFromDisk(
        path.join(__dirname, '../asset/weights')
    );
    await faceapi.nets.faceRecognitionNet.loadFromDisk(
        path.join(__dirname, '../asset/weights')
    );

    const img_path = path.join(__dirname, '../../', faceImgUrl);

    //调整图片尺寸
    const imgSize = await graphicsmagick.getImageSize(img_path);
    const imgFileSize = await graphicsmagick.getImageFileSize(img_path);
    if (imgFileSize.indexOf('M') > 0 && imgSize.width > 1000) {
        await graphicsmagick.resize(img_path, null, 1000);
    }

    let img = await canvas.loadImage(img_path);
    const descriptors = await faceapi
        .detectAllFaces(img, faceDetectionOptions)
        .withFaceLandmarks()
        .withFaceDescriptors();
    let result = [];
    if (descriptors.length > 0) {
        result = descriptors.map(item => {
            return item.descriptor;
        });
    }
    return result;

};

/**
 * 匹配人脸
 * @param {*} refDesc 
 * @param {*} queryDesc 
 */
const faceMatch = async (label, refDesc, queryDesc) => {
    const result = [];
    queryDesc.forEach(desc => {
        const res = faceapi.utils.round(faceapi.euclideanDistance(_convertToFloat32Array(refDesc), _convertToFloat32Array(desc)), 4);
        result.push(res);
    });
    return result;
};

/**
 * 转换成
 * @param {*} descriptor 
 */
const _convertToFloat32Array = (descriptor) => {
    return new Float32Array(Object.values(descriptor));
};


export {
    canvas,
    faceapi,
    faceDetectionNet,
    faceDetectionOptions,
    faceDetection,
    faceRecognize,
    faceMatch
};