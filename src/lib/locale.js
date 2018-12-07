import zh_cn from '../locale/zh-CN';
import zh_tw from '../locale/zh-TW';
import en_us from '../locale/en-US';

/**
 * 根据语言类型获取多语言配置
 * @param {String} lang 语言 如zh-CN、zh-TW、en-US
 */
export function getLocale(lang) {
	if (!lang) return zh_cn;
	let locale = {};
	switch (lang.toLowerCase()) {
	case 'zh-cn':
		locale = zh_cn;
		break;
	case 'zh-tw':
		locale = zh_tw;
		break;
	case 'en-us':
		locale = en_us;
		break;
	default:
		locale = zh_cn;
		break;
	}
	return locale;
}

/**
 * 是否为简体中文语言
 * @param {String} lang 语言 如zh-CN、zh-TW、en-US
 */
export function isCn(lang) {
	if (!lang) return true;
	let isCn = true;
	switch (lang.toLowerCase()) {
	case 'zh-cn':
		isCn = true;
		break;
	case 'zh-tw':
		isCn = false;
		break;
	case 'en-us':
		isCn = false;
		break;
	default:
		isCn = true;
		break;
	}
	return isCn;
}