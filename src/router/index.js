// app/routes/index.js
import fs from 'fs';
import path from 'path';
import Router from 'koa-router';
const router = Router();

console.log('加载路由配置...');
fs.readdirSync(__dirname).filter(file => file !== 'index.js'
).forEach(dir => {
	fs.readdirSync(path.join(__dirname,dir)).forEach(file=>{
		console.log(file);
		const route = require(path.join(__dirname,dir, file));
		router.use(route.routes(), route.allowedMethods());
	});
});

console.log('路由配置已加载!');
module.exports = router;