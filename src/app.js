import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
//路由
const router = require('./router/index.js');
//配置
import config from './config';

//中间件
import authentication from './middleware/authentication.js';
import exception from './middleware/exception';
import operationLog from './middleware/operation_log';

import { ErrorCode } from './lib/enum.js';

const app = new Koa();

//挂载中间件
app.use(cors());

app.use(bodyParser());
app.use(exception);
app.use(authentication);
app.use(operationLog);

//挂载路由
app.use(router.routes());
app.use(async(ctx)=>{
	ctx.error(ErrorCode.NotFound,`请求地址[${ctx.URL}]有误!`);
});

const server=app.listen(config.port, () => {
	console.log(`WebAPI服务已启动!监听端口${config.port}...`);
});

module.exports=server;