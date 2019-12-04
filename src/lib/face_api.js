import '@tensorflow/tfjs-node';
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import path from 'path';

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
        (net === faceapi.nets.tinyFaceDetector ?
            new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold }) :
            new faceapi.MtcnnOptions({ minFaceSize, scaleFactor })
        );
}

const faceDetectionOptions = getFaceDetectorOptions(faceDetectionNet);


/**
 * @method 识别人脸
 * @param {*} faceImgUrl 
 */
const faceDetection = async (faceImgUrl) => {
    await faceDetectionNet.loadFromDisk(path.join(__dirname, '../../public/weights'));
    await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, '../../public/weights'));
    await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, '../../public/weights'));

    const img_path = path.join(__dirname, '../../', faceImgUrl);

    //调整图片尺寸 
    const imgSize = await graphicsmagick.getImageSize(img_path);
    const imgFileSize = await graphicsmagick.getImageFileSize(img_path);
    if (imgFileSize.indexOf('M') > 0 && imgSize.width > 1000) {
        await graphicsmagick.resize(img_path, null, 1000);
    }

    let img = await canvas.loadImage(img_path);
	const detections = await faceapi.detectAllFaces(img, faceDetectionOptions);
    if (detections.length > 0) {
        detections.sort((a, b) => a.score - b.score);
		const box = detections[0].box;
        await graphicsmagick.crop(img_path, null, box.width+20, box.height+20, box.x-10, box.y-10);

		img = await canvas.loadImage(img_path);
		const descriptors = await faceapi.detectAllFaces(img, faceDetectionOptions).withFaceLandmarks().withFaceDescriptors();
        return descriptors;
    }

    return [];
};



export { canvas, faceapi, faceDetectionNet, faceDetectionOptions, faceDetection };