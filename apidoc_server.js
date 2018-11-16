const Koa=require('koa');
const path=require('path');
const fs=require('fs');
const Static=require('koa-static');
const app=new Koa();
app.use(Static(path.join(__dirname,'./apidoc')));
app.use(async (ctx)=>{
	ctx.body = fs.readFileSync('./apidoc/index.html');
});
app.listen(9090,function(){
	console.log('apidoc已启动,监听9090端口...');
});