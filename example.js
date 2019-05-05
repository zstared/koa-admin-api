const pinyin=require('pinyin');

console.log(pinyin('bruce',{style:pinyin.STYLE_NORMAL}).map(item=>item[0]).join(''));
