const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs-extra');
import { genFileCode, zhongWenToPinyin } from './utils';
import config from '../config';

/**
 *  获取明星图片 http://www.mingxing.com
 * @param {*} save_path 
 */
export const getMingXingImgs = async (mingxing_img_path, type, page) => {
    const time = Date.now();
    if (!fs.existsSync(mingxing_img_path)) {
        await fs.mkdirs(mingxing_img_path);
    }
    const images = [];
    let targe_url = `http://www.mingxing.com/ziliao/index?type=${type}&p=${page}`;
    console.log(targe_url);
    const res = await superagent.get(targe_url);
    let $ = cheerio.load(res.text);
    // $('.page_starlist img').each(async (index, item) => {
    //     console.log((index + 1) + ((i - 1) * 24), item.attribs['alt'], item.attribs['src']);
    //     await superagent.get(item.attribs['src']).pipe(fs.createWriteStream(path.join(__dirname, '../../public/images/') + item.attribs['alt'] + '.jpg'));
    //     console.log(index);
    // });

    const imgs = $('.page_starlist img');
    if (imgs.length > 0) {
        for (let j = 0; j < imgs.length; j++) {
            const item = imgs[j];
            const url = 'http://www.mingxing.com' + item.parent.parent.attribs['href'];
            const name = item.attribs['alt'];
            const cover_img = item.attribs['src'];
            const img_urls = await _getImgUrls(url, cover_img);
            const img_info = await _downloadImg(img_urls, mingxing_img_path, zhongWenToPinyin(name));
            const mingxing = {
                name: name,
                imgs: img_info
            };
            //console.log((j + 1) + ((i - 1) * 24), mingxing);
            images.push(mingxing);
        }
    } else {
        console.log('没有图片');
    }
    console.log('time:', Date.now() - time);
    return images;
};

/**
 * 获取图片url
 * @param {*} url 
 * @param {*} cover_img 
 */
const _getImgUrls = async (url, cover_img) => {
    const img_urls = [cover_img];
    // const res = await superagent.get(url);
    // let $ = cheerio.load(res.text);
    // $('.page_starphoto img').each((index, item) => {
    //     img_urls.push(item.attribs['src']);
    // });

    return img_urls;
};

/**
 * 下载图片
 * @param {*} urls 
 */
const _downloadImg = async (urls, save_path, name) => {
    const img = {
        codes: [],
        files: []
    };
    let dir = save_path + '/' + name + '/';

    for (let i = 0; i < urls.length; i++) {
        if (i > 4) break;
        let code = genFileCode();
        const ext = urls[i].substring(urls[i].lastIndexOf('.'));
        const img_name = urls[i].substring(urls[i].lastIndexOf('/') + 1);
        try {
            await fs.mkdirs(dir + code + '/');
            const img_path = dir + code + '/' + img_name;
            await superagent.get(urls[i]).pipe(fs.createWriteStream(img_path));
            img.codes.push(code);
            await _sleep(300);
            const file = await fs.stat(img_path);
            img.files.push({
                img_path: img_path,
                code: code,
                size: file.size,
                name: img_name,
                ext: ext.replace('.', ''),
                directory: (dir + code + '/').split('xinhong-api')[1],
                origin: config.origin,
                is_static: 1,
                is_thumb: 0,
                is_compress: 0,
                path: img_path.split('/public/static')[1],
                path_thumb: img_path.split('/public/static')[1]
            });
        } catch (e) {
            console.log(e);
        }

    }
    return img;
};

/**
 * 等待
 * @param {int} time 等待时长
 */
const _sleep = async (time = 1000) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};