import Koa from 'koa';
import path from 'path';
import koaBody from 'koa-body';
import cors from 'koa2-cors';
import koaStatic from 'koa-static';
import boot from './boot';
//路由
const router = require('./router/index.js');
//配置
import config from './config';

//中间件
import authentication from './middleware/authentication';
import exception from './middleware/exception';
import operationLog from './middleware/operation_log';

import { RCode } from './lib/enum.js';

const app = new Koa();

//挂载中间件
app.use(cors()); //跨域
app.use(koaStatic(path.join(__dirname,'../public/static'))); //静态资源
app.use(koaBody({
	multipart:true,
	formidable:{
		multiples:true,
		maxFileSize: config.uploadFileLimit //最大文件 支持10M
	}
}));
app.use(exception);//异常捕获
app.use(authentication);//鉴权
app.use(operationLog);//操作日志


//挂载路由
app.use(router.routes());
app.use(async(ctx)=>{
	ctx.error(RCode.common.C1000003,`请求地址[${ctx.URL}]有误!`);
});

const server=app.listen(config.port, () => {
	console.log(`WebAPI服务已启动!监听端口${config.port}...`);
	boot.init();
});

module.exports=server;