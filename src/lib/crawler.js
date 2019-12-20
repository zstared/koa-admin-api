const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const uudvi = require('uuid').v1;

/**
 *  获取明星图片 http://www.mingxing.com
 * @param {*} save_path 
 */
export const getMingXingImgs = async (mingxing_img_path) => {
    const time = Date.now();
    if (!fs.existsSync(mingxing_img_path)) {
        await fs.mkdir(mingxing_img_path);
    }
    const images = [];
    for (let i = 1; i <= 1; i++) {
        const res = await superagent.get(`http://www.mingxing.com/ziliao/index?type=neidi&p=${i}`);
        let $ = cheerio.load(res.text);
        // $('.page_starlist img').each(async (index, item) => {
        //     console.log((index + 1) + ((i - 1) * 24), item.attribs['alt'], item.attribs['src']);
        //     await superagent.get(item.attribs['src']).pipe(fs.createWriteStream(path.join(__dirname, '../../public/images/') + item.attribs['alt'] + '.jpg'));
        //     console.log(index);
        // });

        const imgs = $('.page_starlist img');
        for (let j = 0; j < imgs.length; j++) {
            const item = imgs[j];
            const url = 'http://www.mingxing.com' + item.parent.parent.attribs['href'];
            const name = item.attribs['alt'];
            const cover_img = item.attribs['src'];
            const img_urls = await _getImgUrls(url, cover_img);
            const img_codes = await _downloadImg(img_urls, mingxing_img_path);
            const mingxing = {
                name: name,
                //urls: img_urls,
                codes: img_codes
            };
            console.log((j + 1) + ((i - 1) * 24), mingxing);
            images.push(mingxing);
        }
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
    const res = await superagent.get(url);
    let $ = cheerio.load(res.text);
    const img_urls = [cover_img];
    $('.page_starphoto img').each((index, item) => {
        img_urls.push(item.attribs['src']);
    });

    return img_urls;
};

/**
 * 下载图片
 * @param {*} urls 
 */
const _downloadImg = async (urls, save_path) => {
    const codes = [];
    for (let i = 0; i < urls.length; i++) {
        let code = uudvi();
        try {
            await superagent.get(urls[i]).pipe(fs.createWriteStream(save_path + '/' + code + '.jpg'));
            codes.push(code);
        } catch (e) {
            console.log(e);
        }

    }
    return codes;
};